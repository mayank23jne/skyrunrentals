import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';

@ApiTags('Admin/Settings/Plans')
@ApiBearerAuth()
@Controller('admin/settings/plans')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('0')
export class SubscriptionPlanController {
  constructor(private readonly plansService: SubscriptionPlanService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get all subscription plans' })
  async findAll(@Req() req, @Res() res: Response, @Query('page') page?: string, @Query('search') search?: string, @Query('ajax') ajax?: string) {
    const currentPage = parseInt(page || '1', 10);
    const pageSize = 10;
    const skippedItems = (currentPage - 1) * pageSize;

    const [plans, totalCount] = await Promise.all([
      this.plansService.findAll({ skip: skippedItems, take: pageSize, search }),
      this.plansService.count(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-plans',
      pageTitle: 'Subscription Plans',
      plans,
      currentPage,
      totalPages,
      totalCount,
      searchQuery: search || '',
    };

    if (ajax === 'true') {
      return res.render('plans/partials/table-rows', data);
    }

    return res.render('plans/listing', data);
  }



  @UseGuards(AuthGuard('jwt'))
  @Get('create')
  @Render('plans/create')
  @ApiOperation({ summary: 'Render create plan page' })
  async renderCreate(@Req() req) {
    return {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-plans',
      pageTitle: 'Create New Plan',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new subscription plan' })
  @ApiResponse({ status: 201, description: 'Plan created' })
  async create(@Body() createPlanDto: CreatePlanDto) {
    await this.plansService.create(createPlanDto);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/edit')
  @Render('plans/edit')
  @ApiOperation({ summary: 'Render edit plan page' })
  async renderEdit(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const plan = await this.plansService.findOne(id);
    return {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'settings-plans',
      pageTitle: 'Edit Plan',
      plan,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/update')
  @ApiOperation({ summary: 'Update an existing subscription plan' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanDto: UpdatePlanDto) {
    await this.plansService.update(id, updatePlanDto);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/delete')
  @ApiOperation({ summary: 'Delete a subscription plan' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.plansService.remove(id);
    return { success: true };
  }
}

