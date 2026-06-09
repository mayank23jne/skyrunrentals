import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyService } from './property.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { ListingPropertyDto } from './dto/listing-property.dto';
import { PropertyEntity } from './entities/property.entity';

@ApiTags('Admin/Properties')
@ApiBearerAuth()
@Controller('admin/properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('0', '1', '2')
export class PropertyController {
  constructor(
    private propertyService: PropertyService,
    private prisma: PrismaService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get list of properties' })
  async getProperties(
    @Req() req,
    @Res() res,
    @Query('search') search?: string,
    @Query('countryId') countryId?: string,
    @Query('stateId') stateId?: string,
    @Query('cityId') cityId?: string,
    @Query('page') page: string = '1',
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const filterCountryId = countryId ? parseInt(countryId, 10) : undefined;
    const filterStateId = stateId ? parseInt(stateId, 10) : undefined;
    const filterCityId = cityId ? parseInt(cityId, 10) : undefined;

    const isOwner = req.user.usertype === '1';
    const ownerId = isOwner ? req.user.id : undefined;

    const [properties, totalCount, countries] = await Promise.all([
      this.propertyService.findMany({
        skip: skippedItems,
        take: pageSize,
        search,
        countryId: filterCountryId,
        stateId: filterStateId,
        cityId: filterCityId,
        ownerId,
      }),
      this.propertyService.count({
        search,
        countryId: filterCountryId,
        stateId: filterStateId,
        cityId: filterCityId,
        ownerId,
      }),
      this.prisma.country.findMany({ orderBy: { name: 'asc' } })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'properties',
      pageTitle: 'Property Listing',
      properties,
      countries,
      currentPage,
      totalPages,
      totalCount,
      searchQuery: search || '',
      filterCountryId,
      filterStateId,
      filterCityId,
    };

    if (ajax === 'true') {
      return res.render('admin/properties/partials/table-rows', data);
    }

    return res.render('admin/properties/listing', data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check-quota')
  @ApiOperation({ summary: 'Check if user can add more properties' })
  async checkPropertyQuota(@Req() req) {
    if (req.user.usertype === '1') {
      const paymentAgg = await this.prisma.paymentDetail.aggregate({
        where: { userId: req.user.id },
        _sum: { noOfProperty: true }
      });

      const totalAllowedProperties = paymentAgg._sum.noOfProperty || 0;
      console.log("totalAllowedProperties", totalAllowedProperties);

      if (totalAllowedProperties === 0) {
        return { limitReached: true };
      }

      const propertyCount = await this.prisma.property.count({
        where: { assignTo: req.user.id }
      });

      if (propertyCount >= totalAllowedProperties) {
        return { limitReached: true };
      }
    }
    return { limitReached: false };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('add')
  @ApiOperation({ summary: 'Get the add property page' })
  async getAddPropertyPage(@Req() req, @Res() res, @Query('userId') userId?: string) {
    if (req.user.usertype === '1') {
      const paymentAgg = await this.prisma.paymentDetail.aggregate({
        where: { userId: req.user.id, status: { in: ['success', 'succeeded', 'Completed'] } },
        _sum: { noOfProperty: true }
      });

      const totalAllowedProperties = paymentAgg._sum.noOfProperty || 0;

      if (totalAllowedProperties === 0) {
        return res.redirect(`/admin/properties?limitReached=true`);
      }

      const propertyCount = await this.prisma.property.count({
        where: { assignTo: req.user.id }
      });

      if (propertyCount >= totalAllowedProperties) {
        return res.redirect(`/admin/properties?limitReached=true`);
      }
    }

    const [countries, propertyTypes, propertyViews, users, currencies, amenityCategories, lastProperty] = await Promise.all([
      this.prisma.country.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.propertyType.findMany({ orderBy: { propertyName: 'asc' } }),
      this.prisma.propertyView.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.user.findMany({ where: { usertype: '1' }, orderBy: { firstname: 'asc' } }),
      this.prisma.currency.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.amenityCategory.findMany({ include: { items: true }, orderBy: { name: 'asc' } }).catch(() => []),
      this.prisma.property.findFirst({ orderBy: { id: 'desc' }, select: { id: true } })
    ]);

    const nextPropertyId = lastProperty ? lastProperty.id + 1 : 1;
    const selectedUserId = userId ? parseInt(userId, 10) : '';

    return res.render('admin/properties/add', {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'properties',
      pageTitle: 'Add New Property',
      countries,
      propertyTypes,
      propertyViews,
      users,
      currencies,
      amenityCategories,
      nextPropertyId,
      selectedUserId,
    });
  }


  @UseGuards(AuthGuard('jwt'))
  @Post(':id/toggle-recommended')
  @ApiOperation({ summary: 'Toggle property recommendation status' })
  async togglePropertyRecommended(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.toggleRecommendation(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  @ApiOperation({ summary: 'Create a new property' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: PropertyEntity })
  @UseInterceptors(FilesInterceptor('photos', 20))
  async createProperty(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    if (req.user.usertype === '1') {
      // For self users, force assignTo to their own ID since the field is hidden
      createPropertyDto.assignTo = req.user.id.toString();
    }

    try {
      const property = await this.propertyService.create(createPropertyDto, files, req.user.id);
      return property;
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(error.status || 500);
      return {
        message: error.message || 'Internal server error'
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/edit')
  @ApiOperation({ summary: 'Get the edit property page' })
  async getEditPropertyPage(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res) {
    const [property, countries, propertyTypes, propertyViews, users, currencies, amenityCategories] = await Promise.all([
      this.propertyService.findOne(id),
      this.prisma.country.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.propertyType.findMany({ orderBy: { propertyName: 'asc' } }),
      this.prisma.propertyView.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.user.findMany({ where: { usertype: '1' }, orderBy: { firstname: 'asc' } }),
      this.prisma.currency.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.amenityCategory.findMany({ include: { items: true }, orderBy: { name: 'asc' } }).catch(() => [])
    ]);

    if (!property) {
      return res.redirect('/admin/properties');
    }

    // Look up the country record by name to get its ID
    // (Property stores country/state/city as string names, not IDs)
    const propertyCountryRecord = property.country
      ? countries.find(c => c.id.toString() === property.country)
      : null;

    const states = propertyCountryRecord
      ? await this.prisma.state.findMany({ where: { countryId: propertyCountryRecord.id }, orderBy: { name: 'asc' } })
      : [];

    const propertyStateRecord = property.state
      ? states.find(s => s.id.toString() === property.state)
      : null;

    const cities = propertyStateRecord
      ? await this.prisma.city.findMany({ where: { stateId: propertyStateRecord.id }, orderBy: { name: 'asc' } })
      : [];

    // Load states/cities for the Contact tab (may differ from property location)
    const contactCountryName = property.contacts?.[0]?.country;
    const contactStateName = property.contacts?.[0]?.state;

    const contactCountryRecord = contactCountryName
      ? countries.find(c => c.id.toString() === contactCountryName)
      : null;

    const contactStates = (contactCountryRecord && contactCountryRecord.id !== propertyCountryRecord?.id)
      ? await this.prisma.state.findMany({ where: { countryId: contactCountryRecord.id }, orderBy: { name: 'asc' } })
      : states;

    const contactStateRecord = contactStateName
      ? contactStates.find(s => s.id.toString() === contactStateName)
      : null;

    const contactCities = (contactStateRecord && contactStateRecord.id !== propertyStateRecord?.id)
      ? await this.prisma.city.findMany({ where: { stateId: contactStateRecord.id }, orderBy: { name: 'asc' } })
      : cities;

    return res.render('admin/properties/edit', {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'properties',
      pageTitle: 'Edit Property',
      property,
      countries,
      states,
      cities,
      contactStates,
      contactCities,
      propertyTypes,
      propertyViews,
      users,
      currencies,
      amenityCategories,
    });
  }



  @UseGuards(AuthGuard('jwt'))
  @Post(':id/edit')
  @ApiOperation({ summary: 'Update an existing property' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, type: PropertyEntity })
  @UseInterceptors(FilesInterceptor('photos', 20))
  async updateProperty(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    if (req.user.usertype === '1') {
      // For self users, force assignTo to their own ID since the field is hidden
      updatePropertyDto.assignTo = req.user.id.toString();
    }

    try {
      const property = await this.propertyService.update(id, updatePropertyDto, files, req.user.id);
      return property;
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(error.status || 500);
      return {
        message: error.message || 'Internal server error'
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/delete')
  @ApiOperation({ summary: 'Delete a property' })
  async deleteProperty(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) res) {
    try {
      await this.propertyService.delete(id);
      return { message: 'Property deleted successfully' };
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500);
      return { message: 'Internal server error' };
    }
  }

  @Public()
  @Post(':id/enquire')
  @ApiOperation({ summary: 'Send enquiry message to owner' })
  async createEnquiry(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Res({ passthrough: true }) res) {
    try {
      await this.propertyService.createOwnerMessage(id, body);
      return { message: 'Message sent successfully' };
    } catch (error) {
      console.error('Error creating owner message:', error);
      res.status(500);
      return { message: 'Internal server error' };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/priority')
  @ApiOperation({ summary: 'Update property priority' })
  async updatePriority(@Param('id', ParseIntPipe) id: number, @Body() updatePriorityDto: UpdatePriorityDto) {
    return this.propertyService.updatePriority(id, updatePriorityDto.priority);
  }

}

