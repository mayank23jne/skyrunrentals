import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as express from 'express';
import { BookingService } from './booking.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { PropertyIdDto, FullCalendarBookingDto, GetBookingRatesDto } from './dto/calendar.dto';

@ApiTags('Admin/Bookings')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Roles('0', '1', '2')
  @Get('bookings')
  @ApiOperation({ summary: 'Get list of bookings' })
  async getBookings(
    @Req() req,
    @Res() res: express.Response,
    @Query('page') page: string = '1',
    @Query('search') search?: string,
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const [bookings, totalCount] = await Promise.all([
      this.bookingService.findPropertyBookings({ skip: skippedItems, take: pageSize, search }),
      this.bookingService.countPropertyBookings(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'bookings',
      pageTitle: 'Property Bookings',
      bookings,
      totalPages,
      currentPage,
      totalCount,
      searchQuery: search || ''
    };

    if (ajax === 'true') {
      return res.render('bookings/partials/table-rows', data);
    }

    return res.render('bookings/listing', data);
  }

  @Roles('0', '1', '2')
  @Get('bookings/:id/view')
  @ApiOperation({ summary: 'View booking detail' })
  async viewBooking(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res: express.Response) {
    const booking = await this.bookingService.findPropertyBookingById(id);
    if (!booking) {
      return res.redirect('/admin/bookings');
    }

    return res.render('bookings/view-detail', {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'bookings',
      pageTitle: 'Booking Details',
      booking
    });
  }

  @Roles('0', '1', '2')
  @Get('enquiries')
  @ApiOperation({ summary: 'Get list of enquiries' })
  async getEnquiries(
    @Req() req,
    @Res() res: express.Response,
    @Query('page') page: string = '1',
    @Query('search') search?: string,
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const [enquiries, totalCount] = await Promise.all([
      this.bookingService.findEnquiries({ skip: skippedItems, take: pageSize, search }),
      this.bookingService.countEnquiries(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'enquiries',
      pageTitle: 'Booking Enquiries',
      enquiries,
      totalPages,
      currentPage,
      totalCount,
      searchQuery: search || ''
    };

    if (ajax === 'true') {
      return res.render('enquiries/partials/table-rows', data);
    }

    return res.render('enquiries/listing', data);
  }

  @Roles('0', '1', '2')
  @Post('enquiries/:id/delete')
  @ApiOperation({ summary: 'Delete an enquiry' })
  async deleteEnquiry(@Param('id', ParseIntPipe) id: number) {
    await this.bookingService.deleteEnquiry(id);
    return { success: true };
  }

  @Roles('0', '1')
  @Get('transactions')
  @ApiOperation({ summary: 'Get list of transactions' })
  async getTransactions(
    @Req() req,
    @Res() res: express.Response,
    @Query('page') page: string = '1',
    @Query('search') search?: string,
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const [transactions, totalCount] = await Promise.all([
      this.bookingService.findTransactions({ skip: skippedItems, take: pageSize, search }),
      this.bookingService.countTransactions(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'transactions',
      pageTitle: 'Payment History',
      transactions,
      totalPages,
      currentPage,
      totalCount,
      searchQuery: search || ''
    };

    if (ajax === 'true') {
      return res.render('transactions/partials/table-rows', data);
    }

    return res.render('transactions/listing', data);
  }

  @Public()
  @Post('fetch-calendar-booking')
  @ApiOperation({ summary: 'Fetch calendar bookings' })
  async fetchCalendarBooking(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.fetchCalendarBookings(propertyIdDto.id);
  }

  @Public()
  @Post('fetch-calendar-rates')
  @ApiOperation({ summary: 'Fetch calendar rates' })
  async fetchCalendarRates(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.fetchCalendarBookings(propertyIdDto.id);
  }

  @Public()
  @Post('fetch-events')
  @ApiOperation({ summary: 'Fetch calendar events' })
  async fetchEvents(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.fetchEvents(propertyIdDto.id);
  }

  @Public()
  @Post('rate-events')
  @ApiOperation({ summary: 'Fetch rate events' })
  async rateEvents(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.rateEvents(propertyIdDto.id);
  }

  @Public()
  @Post('season-rates-events')
  @ApiOperation({ summary: 'Fetch season rates events' })
  async seasonRatesEvents(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.seasonRatesEvents(propertyIdDto.id);
  }

  @Public()
  @Post('booking-events')
  @ApiOperation({ summary: 'Fetch booking events' })
  async bookingEvents(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.bookingEvents(propertyIdDto.id);
  }

  @Public()
  @Post('fetch-booking-rates')
  @ApiOperation({ summary: 'Fetch booking rates' })
  async fetchBookingRates(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.fetchBookingRates(propertyIdDto.id);
  }

  @Public()
  @Post('fetch-calendar-booking-available')
  @ApiOperation({ summary: 'Fetch available booking slots' })
  async fetchCalendarBookingAvailable(@Body() propertyIdDto: PropertyIdDto) {
    return this.bookingService.fetchCalendarBookingAvailable(propertyIdDto.id);
  }

  @Public()
  @Post('fullcalendar-booking')
  @ApiOperation({ summary: 'Update full calendar booking' })
  async fullCalendarBooking(@Body() fullCalendarBookingDto: FullCalendarBookingDto) {
    return this.bookingService.updateFullCalendarBooking(
      fullCalendarBookingDto.id, 
      fullCalendarBookingDto.date, 
      fullCalendarBookingDto.booking_status
    );
  }

  @Public()
  @Post('get-booking-rates')
  @ApiOperation({ summary: 'Get booking rates for selected dates' })
  async getBookingRates(@Body() getBookingRatesDto: GetBookingRatesDto) {
    return this.bookingService.getBookingRates(getBookingRatesDto.property_id, getBookingRatesDto.selected_dates);
  }
}

