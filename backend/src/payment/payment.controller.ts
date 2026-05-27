import { Controller, Get, Param, Req, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Public } from '../auth/decorators/public.decorator';
import { BookingPaymentDto, PaypalSuccessDto, SquarePayDto, PrepareBookingDto } from './dto/payment.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':plan_id')
  @ApiOperation({ summary: 'Get payment details for a plan' })
  async getPayment(@Param('plan_id') planId: string, @Req() req) {
    return this.paymentService.getPaymentDetails(planId, req.user.id);
  }

  @Public()
  @Post('stripe-pay-booking')
  @ApiOperation({ summary: 'Pay for booking via Stripe' })
  async stripePayBooking(@Body() bookingPaymentDto: BookingPaymentDto) {
    return this.paymentService.stripePayBooking(bookingPaymentDto);
  }

  @Public()
  @Post('prepare-booking')
  @ApiOperation({ summary: 'Prepare booking payment data' })
  async prepareBookingPayment(@Body() prepareBookingDto: PrepareBookingDto) {
    const sessionCurrencyId = prepareBookingDto.currencyCode ? (typeof prepareBookingDto.currencyCode === 'string' ? parseInt(prepareBookingDto.currencyCode, 10) : prepareBookingDto.currencyCode) : undefined;
    return this.paymentService.prepareBookingPayment(prepareBookingDto, sessionCurrencyId);
  }

  @Public()
  @Post('bookings-details')
  @ApiOperation({ summary: 'Get PayPal booking details' })
  async bookingsDetails(@Body() bookingPaymentDto: BookingPaymentDto) {
    const currencyShortForm = bookingPaymentDto.currencyShortForm || 'USD';
    return this.paymentService.paypalBookingDetails(bookingPaymentDto, currencyShortForm);
  }

  @Public()
  @Post('booking-success')
  @ApiOperation({ summary: 'Handle PayPal booking success' })
  async bookingSuccess(@Body() paypalSuccessDto: PaypalSuccessDto) {
    return this.paymentService.paypalBookingSuccess(paypalSuccessDto);
  }

  @Public()
  @Post('booking-cancel')
  @ApiOperation({ summary: 'Handle PayPal booking cancellation' })
  async bookingCancel(@Body() body: { payment_id: string | number }) {
    return this.paymentService.paypalBookingCancel(body);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('square-pay')
  @ApiOperation({ summary: 'Pay via Square for subscription' })
  async squarePay(@Body() squarePayDto: SquarePayDto, @Req() req) {
    return this.paymentService.squarePay(squarePayDto, req.user);
  }

  @Public()
  @Post('square-pay-booking')
  @ApiOperation({ summary: 'Pay for booking via Square' })
  async squarePayBooking(@Body() bookingPaymentDto: BookingPaymentDto) {
    return this.paymentService.squarePayBooking(bookingPaymentDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('payment-init')
  @ApiOperation({ summary: 'Initialize payment for subscription' })
  async paymentInit(@Body() body: any, @Req() req) {
    return this.paymentService.paymentInit(body, req.user);
  }

  @Public()
  @Post('payment-init-booking')
  @ApiOperation({ summary: 'Initialize payment for booking' })
  async paymentInitBooking(@Body() body: any) {
    return this.paymentService.paymentInitBooking(body);
  }

  @Public()
  @Post('add-new-rate-on-slot')
  @ApiOperation({ summary: 'Add new rate on slot' })
  async addNewRateOnSlot(@Body() body: any) {
    return this.paymentService.addNewRateOnSlot(body);
  }
}

