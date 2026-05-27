import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SettingsService } from './settings.service';
import { S3Service } from '../s3/s3.service';

@ApiTags('Admin/Settings')
@ApiBearerAuth()
@Controller('admin/settings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('0')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly s3Service: S3Service,
  ) { }

  // --- STATES ---
  @UseGuards(AuthGuard('jwt'))
  @Get('states')
  async listStates(
    @Req() req,
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('countryId') countryId?: string,
    @Query('ajax') ajax?: string
  ) {
    const currentPage = parseInt(page || '1', 10);
    const pageSize = 10;
    const skippedItems = (currentPage - 1) * pageSize;

    const filterCountryId = countryId ? parseInt(countryId) : undefined;
    const [states, totalCount, countries] = await Promise.all([
      this.settingsService.findStates({ skip: skippedItems, take: pageSize, search, countryId: filterCountryId }),
      this.settingsService.countStates(search, filterCountryId),
      this.settingsService.getCountries(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-states',
      pageTitle: 'States Management',
      states,
      countries,
      currentPage,
      totalPages,
      totalCount,
      searchQuery: search || '',
      filterCountryId,
    };

    if (ajax === 'true') {
      return res.render('settings/state/partials/table-rows', data);
    }

    return res.render('settings/state/listing', data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('states')
  @UseInterceptors(FileInterceptor('image'))
  async createState(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      body.image = await this.s3Service.uploadFile(file, 'images/uploads/states');
    }
    await this.settingsService.createState(body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('states/:id/update')
  @UseInterceptors(FileInterceptor('image'))
  async updateState(@Param('id', ParseIntPipe) id: number, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      body.image = await this.s3Service.uploadFile(file, 'images/uploads/states');
    }
    await this.settingsService.updateState(id, body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('states/:id/delete')
  async removeState(@Param('id', ParseIntPipe) id: number) {
    await this.settingsService.removeState(id);
    return { success: true };
  }

  // --- CITIES ---
  @UseGuards(AuthGuard('jwt'))
  @Get('cities')
  async listCities(
    @Req() req,
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('stateId') stateId?: string,
    @Query('countryId') countryId?: string,
    @Query('ajax') ajax?: string
  ) {
    const currentPage = parseInt(page || '1', 10);
    const pageSize = 10;
    const skippedItems = (currentPage - 1) * pageSize;

    const filterStateId = stateId ? parseInt(stateId) : undefined;
    const filterCountryId = countryId ? parseInt(countryId) : undefined;

    const [cities, totalCount, countries] = await Promise.all([
      this.settingsService.findCities({ skip: skippedItems, take: pageSize, search, stateId: filterStateId, countryId: filterCountryId }),
      this.settingsService.countCities(search, filterStateId, filterCountryId),
      this.settingsService.getCountries(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-cities',
      pageTitle: 'Cities Management',
      cities,
      countries,
      currentPage,
      totalPages,
      totalCount,
      searchQuery: search || '',
      filterStateId,
      filterCountryId,
    };

    if (ajax === 'true') {
      return res.render('settings/city/partials/table-rows', data);
    }

    return res.render('settings/city/listing', data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cities')
  @UseInterceptors(FileInterceptor('image'))
  async createCity(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      body.image = await this.s3Service.uploadFile(file, 'images/uploads/cities');
    }
    await this.settingsService.createCity(body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cities/:id/update')
  @UseInterceptors(FileInterceptor('image'))
  async updateCity(@Param('id', ParseIntPipe) id: number, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      body.image = await this.s3Service.uploadFile(file, 'images/uploads/cities');
    }
    await this.settingsService.updateCity(id, body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cities/:id/delete')
  async removeCity(@Param('id', ParseIntPipe) id: number) {
    await this.settingsService.removeCity(id);
    return { success: true };
  }

  // --- FEEDBACK ---
  @UseGuards(AuthGuard('jwt'))
  @Get('feedback')
  async listFeedbacks(
    @Req() req,
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('ajax') ajax?: string
  ) {
    console.log('feedback settings');
    const currentPage = parseInt(page || '1', 10);
    const pageSize = 10;
    const skippedItems = (currentPage - 1) * pageSize;

    const [feedbacksResult, totalCountResult] = await Promise.all([
      this.settingsService.findFeedbacks({ skip: skippedItems, take: pageSize, search }),
      this.settingsService.countFeedbacks(search),
    ]);

    const feedbacks = feedbacksResult || [];
    const totalCount = totalCountResult || 0;

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-feedback',
      pageTitle: 'Feedback Management',
      feedbacks,
      currentPage,
      totalPages,
      totalCount,
      searchQuery: search || '',
    };

    if (ajax === 'true') {
      return res.render('settings/feedback/partials/table-rows', data);
    }

    return res.render('settings/feedback/listing', data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('feedback')
  @UseInterceptors(FileInterceptor('userImage'))
  async createFeedback(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      body.userImage = await this.s3Service.uploadFile(file, 'images/uploads/feedback_img');
    }
    await this.settingsService.createFeedback(body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('feedback/:id/update')
  @UseInterceptors(FileInterceptor('userImage'))
  async updateFeedback(@Param('id', ParseIntPipe) id: number, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      body.userImage = await this.s3Service.uploadFile(file, 'images/uploads/feedback_img');
    }
    await this.settingsService.updateFeedback(id, body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('feedback/:id/delete')
  async removeFeedback(@Param('id', ParseIntPipe) id: number) {
    await this.settingsService.removeFeedback(id);
    return { success: true };
  }

  // --- API DATA HELPERS ---
  @UseGuards(AuthGuard('jwt'))
  @Get('data/states')
  async getStatesByCountry(@Query('countryId') countryId?: string) {
    return this.settingsService.findStates({ countryId: countryId ? parseInt(countryId) : undefined });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('data/cities')
  async getCitiesByState(@Query('stateId', ParseIntPipe) stateId: number) {
    return this.settingsService.findCities({ stateId });
  }

  // --- AMENITIES MASTER ---
  @UseGuards(AuthGuard('jwt'))
  @Get('amenities')
  async listAmenities(@Req() req, @Res() res: Response) {
    const categories = await this.settingsService.findAmenityCategories();
    return res.render('settings/amenities/index', {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-amenities',
      pageTitle: 'Amenities Master',
      categories,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('amenity-categories')
  async createAmenityCategory(@Body() body: any) {
    await this.settingsService.createAmenityCategory(body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('amenity-categories/:id/update')
  async updateAmenityCategory(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    await this.settingsService.updateAmenityCategory(id, body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('amenity-categories/:id/delete')
  async removeAmenityCategory(@Param('id', ParseIntPipe) id: number) {
    await this.settingsService.removeAmenityCategory(id);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('amenity-items')
  async createAmenityItem(@Body() body: any) {
    await this.settingsService.createAmenityItem(body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('amenity-items/:id/update')
  async updateAmenityItem(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    await this.settingsService.updateAmenityItem(id, body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('amenity-items/:id/delete')
  async removeAmenityItem(@Param('id', ParseIntPipe) id: number) {
    await this.settingsService.removeAmenityItem(id);
    return { success: true };
  }
}

