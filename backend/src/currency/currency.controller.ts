import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto/currency.dto';
import { CurrencyEntity } from './entities/currency.entity';

@ApiTags('Admin/Settings/Currency')
@ApiBearerAuth()
@Controller('admin/settings/currency')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('0')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get all currencies' })
  async findAll(@Req() req, @Res() res: Response, @Query('page') page?: string, @Query('search') search?: string, @Query('ajax') ajax?: string) {
    const currentPage = parseInt(page || '1', 10);
    const pageSize = 10;
    const skippedItems = (currentPage - 1) * pageSize;

    const [currencies, totalCount] = await Promise.all([
      this.currencyService.findAll({ skip: skippedItems, take: pageSize, search }),
      this.currencyService.count(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-currency',
      pageTitle: 'Currency Management',
      currencies,
      currentPage,
      totalPages,
      totalCount,
      searchQuery: search || '',
    };

    if (ajax === 'true') {
      return res.render('currency/partials/table-rows', data);
    }

    return res.render('currency/listing', data);
  }



  @UseGuards(AuthGuard('jwt'))
  @Get('create')
  @Render('currency/create')
  @ApiOperation({ summary: 'Render create currency page' })
  async renderCreate(@Req() req) {
    return {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-currency',
      pageTitle: 'Add New Currency',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new currency' })
  @ApiResponse({ status: 201, description: 'Currency created' })
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    await this.currencyService.create(createCurrencyDto);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/edit')
  @Render('currency/edit')
  @ApiOperation({ summary: 'Render edit currency page' })
  async renderEdit(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const currency = await this.currencyService.findOne(id);
    return {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-currency',
      pageTitle: 'Edit Currency',
      currency,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/update')
  @ApiOperation({ summary: 'Update an existing currency' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    await this.currencyService.update(id, updateCurrencyDto);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/delete')
  @ApiOperation({ summary: 'Delete a currency' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.currencyService.remove(id);
    return { success: true };
  }
}

