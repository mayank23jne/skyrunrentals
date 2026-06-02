import { Controller, Get, Post, Body, Query, Param, ParseIntPipe, UseGuards, Render, Req, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as express from 'express';
import { AdminService } from './admin.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { 
  UpdateProfileDto, 
  ChangePasswordDto, 
  UpdatePromoDto, 
  UpdateTermsDto, 
  SearchVenueDto, 
  CheckLoginDto,
  AdminRegisterDto
} from './dto/admin.dto';

import { RegisterDto } from '../auth/dto/register.dto';
import { UserEntity } from '../auth/entities/user.entity';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private prisma: PrismaService,
  ) { }

  @Roles('0', '1', '2')
  @Get('profile')
  @Render('profile')
  @ApiOperation({ summary: 'Get admin profile' })
  async getProfile(@Req() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id }
    });
    return {
      admin: { ...user, username: user?.firstname || user?.email },
      activePage: 'profile',
      pageTitle: 'My Profile'
    };
  }

  @Roles('0', '1', '2')
  @Post('profile/update')
  @ApiOperation({ summary: 'Update admin profile' })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.adminService.updateProfile(req.user.id, updateProfileDto);
  }

  @Roles('0', '1', '2')
  @Post('profile/change-password')
  @ApiOperation({ summary: 'Change admin password' })
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.adminService.changePassword(req.user.id, changePasswordDto);
  }

  @Roles('0', '1', '2')
  @Get('dashboard')
  @Render('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard' })
  async getDashboard(@Req() req) {
    const isOwner = req.user.usertype === '1';
    const ownerId = req.user.id;

    const [totalUsers, totalProperties, totalEnquiries, totalBookings, recentBookings, recentPayments] = await Promise.all([
      isOwner ? 0 : this.prisma.user.count({ where: { deleted: 0 } }),
      this.prisma.property.count(isOwner ? { where: { createdBy: ownerId } } : undefined),
      this.prisma.ownerMessage.count(isOwner ? { where: { propertyOwner: ownerId } } : undefined),
      this.prisma.propertyBooking.count(isOwner ? { where: { propertyOwner: ownerId } } : undefined),
      this.prisma.propertyBooking.findMany({
        where: isOwner ? { propertyOwner: ownerId } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { property: { select: { propertyHeadline: true } } }
      }),
      this.prisma.paymentDetail.findMany({
        where: isOwner ? { userId: ownerId } : undefined,
        orderBy: { createdDate: 'desc' },
        take: 5,
        include: { user: { select: { firstname: true, lastname: true } } }
      })
    ]);

    const formatTime = (date: Date) => {
      const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
      if (diff < 60) return `Just now`;
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      return `${Math.floor(diff / 86400)} days ago`;
    };

    let activities = [
      ...recentBookings.map(b => ({
        id: `b_${b.id}`,
        action: `New booking for ${b.property?.propertyHeadline || 'Property'} by ${b.firstName} ${b.lastName}`,
        time: formatTime(b.createdAt),
        date: new Date(b.createdAt).getTime()
      })),
      ...recentPayments.map(p => ({
        id: `p_${p.id}`,
        action: `Payment of $${p.amount} received from ${p.user?.firstname} ${p.user?.lastname}`,
        time: formatTime(p.createdDate),
        date: new Date(p.createdDate).getTime()
      }))
    ];

    activities.sort((a, b) => b.date - a.date);
    const recentActivity = activities.slice(0, 5).map(({ date, ...rest }) => rest);

    return {
      admin: { ...req.user, username: req.user.username || req.user.email },
      activePage: 'dashboard',
      pageTitle: 'Dashboard',
      stats: {
        totalUsers,
        totalProperties,
        totalEnquiries,
        totalBookings,
        revenue: "$45,200"
      },
      recentActivity
    };
  }

  @Roles('0')
  @Get('users')
  @ApiOperation({ summary: 'Get list of users' })
  async getUsers(
    @Req() req,
    @Res() res,
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const where: any = {
      deleted: 0,
    };

    if (search) {
      where.OR = [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: skippedItems,
        take: pageSize,
        orderBy: { create_date: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...(req.user || {}), username: (req.user?.username || req.user?.email || 'Admin') },
      activePage: 'users',
      pageTitle: 'Users Listing',
      users,
      totalPages,
      currentPage,
      totalCount,
      searchQuery: search || ''
    };

    if (ajax === 'true') {
      return res.render('users/partials/table-rows', data);
    }

    return res.render('users/listing', data);
  }

  @Roles('0')
  @Get('users/:id/view')
  @Render('users/view')
  @ApiOperation({ summary: 'View user detail' })
  async viewUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const user = await this.adminService.getUserById(id);
    return { admin: req.user, user, activePage: 'users', pageTitle: 'View User' };
  }

  @Roles('0')
  @Get('users/:id/edit')
  @Render('users/edit')
  @ApiOperation({ summary: 'Render edit user page' })
  async editUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const user = await this.adminService.getUserById(id);
    return { admin: req.user, user, activePage: 'users', pageTitle: 'Edit User' };
  }

  @Roles('0')
  @Post('users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: UserEntity })
  async createUser(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Roles('0')
  @Post('users/:id/update')
  @ApiOperation({ summary: 'Update an existing user' })
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() registerDto: Partial<RegisterDto>) {
    await this.adminService.updateUser(id, registerDto);
    return { success: true };
  }

  @Roles('0')
  @Post('users/:id/delete')
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteUser(id);
    return { success: true };
  }

  @Roles('0')
  @Post('users/:id/toggle-status')
  @ApiOperation({ summary: 'Toggle user status' })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.toggleUserStatus(id);
  }

  @Roles('0')
  @Get('settings/donation')
  @ApiOperation({ summary: 'Get donation settings' })
  async getDonation(
    @Req() req,
    @Res() res: express.Response,
    @Query('page') page: string = '1',
    @Query('search') search?: string,
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const [donations, totalCount] = await Promise.all([
      this.adminService.findDonations({ skip: skippedItems, take: pageSize, search }),
      this.adminService.countDonations(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'settings-donation',
      pageTitle: 'Donation Management',
      donations,
      totalPages,
      currentPage,
      totalCount,
      searchQuery: search || ''
    };

    if (ajax === 'true') {
      return res.render('settings/donation/partials/table-rows', data);
    }

    return res.render('settings/donation/listing', data);
  }

  @Roles('0')
  @Get('settings/promo')
  @ApiOperation({ summary: 'Get promo code settings' })
  async getPromo(@Req() req, @Res() res: express.Response) {
    const promo = await this.adminService.getPromoSettings();
    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'settings-promo',
      pageTitle: 'Promotional Code',
      promo: promo || { title: '', code: '' }
    };
    return res.render('settings/promo/listing', data);
  }

  @Roles('0')
  @Post('settings/promo')
  @ApiOperation({ summary: 'Update promo code settings' })
  async updatePromo(@Body() updatePromoDto: UpdatePromoDto) {
    await this.adminService.updatePromoSettings(updatePromoDto);
    return { success: true };
  }

  @Roles('0')
  @Get('settings/terms')
  @ApiOperation({ summary: 'Get terms and conditions settings' })
  async getTerms(@Req() req, @Res() res: express.Response) {
    const terms = await this.adminService.getTermsSettings();
    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'settings-terms',
      pageTitle: 'Terms & Conditions',
      terms: terms || { title: '', detail: '' }
    };
    return res.render('settings/terms/listing', data);
  }

  @Roles('0')
  @Post('settings/terms')
  @ApiOperation({ summary: 'Update terms and conditions settings' })
  async updateTerms(@Body() updateTermsDto: UpdateTermsDto) {
    await this.adminService.updateTermsSettings(updateTermsDto);
    return { success: true };
  }

  @Roles('0')
  @Get('settings/employees')
  @ApiOperation({ summary: 'Get list of employees' })
  async getEmployees(
    @Req() req,
    @Res() res: express.Response,
    @Query('page') page: string = '1',
    @Query('search') search?: string,
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const [employees, totalCount] = await Promise.all([
      this.adminService.findEmployees({ skip: skippedItems, take: pageSize, search }),
      this.adminService.countEmployees(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'settings-employees',
      pageTitle: 'Employee Management',
      employees,
      totalPages,
      currentPage,
      totalCount,
      searchQuery: search || ''
    };

    if (ajax === 'true') {
      return res.render('settings/employees/partials/table-rows', data);
    }

    return res.render('settings/employees/listing', data);
  }

  @Roles('0')
  @Post('settings/employees/add')
  @ApiOperation({ summary: 'Add a new employee' })
  async addEmployee(@Body() body: any) {
    return this.adminService.createEmployee(body);
  }

  @Roles('0')
  @Post('settings/employees/:id/update')
  @ApiOperation({ summary: 'Update an existing employee' })
  async updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateEmployee(id, body);
  }

  @Roles('0')
  @Post('settings/employees/:id/delete')
  @ApiOperation({ summary: 'Delete an employee' })
  async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteEmployee(id);
  }

  @Roles('0')
  @Post('settings/employees/:id/toggle-status')
  @ApiOperation({ summary: 'Toggle employee status' })
  async toggleEmployeeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.toggleEmployeeStatus(id);
  }

  @Roles('0')
  @Post('settings/employees/:id/change-password')
  @ApiOperation({ summary: 'Change employee password' })
  async changeEmployeePassword(@Param('id', ParseIntPipe) id: number, @Body('password') password: string) {
    return this.adminService.changeEmployeePassword(id, password);
  }

  @Roles('0', '1', '2')
  @Get('currency/conversion')
  @ApiOperation({ summary: 'Get currency conversion' })
  async getCurrencyConversion(
    @Query('price') price: string,
    @Query('currencyId') currencyId?: number,
  ) {
    return this.adminService.currencyConversion(price, currencyId || 2);
  }

  @Roles('0', '1', '2')
  @Get('currency/conversion-return')
  @ApiOperation({ summary: 'Get currency conversion return' })
  async getCurrencyConversionReturn(
    @Query('price') price: string,
    @Query('currencyId') currencyId?: number,
  ) {
    return this.adminService.currencyConversionReturn(price, currencyId || 2);
  }

  @Roles('0', '1', '2')
  @Get('currency/conversion-return-without-symbol')
  @ApiOperation({ summary: 'Get currency conversion return without symbol' })
  async getCurrencyConversionReturnWithoutSymbol(
    @Query('price') price: string,
    @Query('currencyId') currencyId?: number,
  ) {
    return this.adminService.currencyConversionReturnWithoutSymbol(price, currencyId || 2);
  }

  @Roles('0', '1', '2')
  @Get('currency/conversion-in-pound')
  @ApiOperation({ summary: 'Get currency conversion in pound' })
  async getCurrencyConversionInPound(
    @Query('price') price: string,
    @Query('currencyId') currencyId?: number,
  ) {
    return this.adminService.currencyConversionInPound(price, currencyId || 2);
  }

  @Roles('0', '1', '2')
  @Post('venue/search')
  @ApiOperation({ summary: 'Search venues' })
  async searchVenue(@Body() searchVenueDto: SearchVenueDto) {
    return this.adminService.searchVenue(searchVenueDto);
  }

  @Public()
  @Post('check-verify-code')
  @ApiOperation({ summary: 'Check verification code' })
  async checkVerifyCode(@Body('verify_code') verifyCode: string) {
    return this.adminService.checkVerifyCode(verifyCode);
  }

  @Public()
  @Post('check-email')
  @ApiOperation({ summary: 'Check if email exists' })
  async checkEmail(@Body('email') email: string) {
    return this.adminService.checkEmail(email);
  }

  @Public()
  @Post('check-login')
  @ApiOperation({ summary: 'Check login credentials' })
  async checkLogin(@Body() checkLoginDto: CheckLoginDto, @Res({ passthrough: true }) res: express.Response) {
    const { username, password } = checkLoginDto;
    const user = await this.adminService.canLogin(username, password);

    if (user) {
      const loginResult = await this.authService.login(user);

      res.cookie('jwt', loginResult.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000,
      });

      const redirectUrl = user.usertype === '2' ? '/user/properties' : '/user';
      return redirectUrl;
    } else {
      return null;
    }
  }

  @Roles('0', '1', '2')
  @Get('rules')
  @ApiOperation({ summary: 'Get admin rules' })
  async getRules(@Req() req, @Query('currencyCodeId') currencyCodeId?: number) {
    return this.adminService.getRules(req.user.id, req.user.usertype, currencyCodeId);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a user via admin service' })
  async register(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.adminService.registerUser(adminRegisterDto);
  }

}

