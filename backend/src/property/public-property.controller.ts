import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyService } from './property.service';
import { Public } from '../auth/decorators/public.decorator';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { ListingPropertyDto } from './dto/listing-property.dto';
import { PropertyEntity } from './entities/property.entity';

@ApiTags('Public/Properties')
@Controller('properties')
export class PublicPropertyController {
  constructor(
    private propertyService: PropertyService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Get(':id/details')
  @ApiOperation({ summary: 'Get property details for client' })
  async getPropertyDetails(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.getPropertyDetails(id);
  }

  @Public()
  @Post('filter')
  @ApiOperation({ summary: 'Filter properties for client' })
  @ApiResponse({ status: 200, type: [PropertyEntity] })
  async getFilterProperties(@Body() filterPropertyDto: FilterPropertyDto) {
    return this.propertyService.getFilterProperties(filterPropertyDto);
  }

  @Public()
  @Post('mock-payment')
  @ApiOperation({ summary: 'Process a mock payment for a subscription plan' })
  async mockPayment(@Body() body: any) {
    const { userId, planType, amount, description, noOfProperty } = body;
    
    if (userId) {
      // Create PaymentDetail record
      await this.prisma.paymentDetail.create({
        data: {
          userId: parseInt(userId, 10),
          transactionBy: parseInt(userId, 10),
          response: 'Success (Mock)',
          status: 'Completed',
          amount: String(amount),
          planType: parseInt(planType, 10),
          noOfProperty: parseInt(noOfProperty, 10),
          description: description,
          createdDate: new Date(),
        }
      });
      
      // Update User subscription_type
      await this.prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: { subscription_type: parseInt(planType, 10) === 999 ? 2 : 1 } // 2 for custom, 1 for regular
      });
    }

    return { success: true, message: 'Payment processed successfully' };
  }


  @Public()
  @Get('listing')
  @ApiOperation({ summary: 'Get property listing for client search' })
  async getListing(@Query() query: ListingPropertyDto) {
    return this.propertyService.getListing(query);
  }

  @Public()
  @Get('currencies')
  @ApiOperation({ summary: 'Get all currencies for public' })
  async getCurrencies() {
    return this.prisma.currency.findMany({ orderBy: { name: 'asc' } });
  }

  @Public()
  @Get('states')
  @ApiOperation({ summary: 'Get all states for destinations slider' })
  async getStates(@Query('stunning') stunning?: string) {
    const whereClause: any = { image: { not: '' } };
    if (stunning === '1') {
      whereClause.stunning = 1;
    }
    const states = await this.prisma.state.findMany({ 
      where: whereClause, // only fetch states with images (and optional stunning flag) for the slider
      orderBy: { name: 'asc' } 
    });

    return states.map(state => ({
      ...state,
      image: state.image ? process.env.IMG_PATH + 'uploads/states/' + state.image : state.image
    }));
  }

  @Public()
  @Get('countries')
  @ApiOperation({ summary: 'Get all countries for filter' })
  async getCountries() {
    return this.prisma.country.findMany({ orderBy: { name: 'asc' } });
  }

  @Public()
  @Get('calculate-fees')
  @ApiOperation({ summary: 'Calculate booking fees based on booking value' })
  async getCalculateFees(@Query('value') valueStr: string) {
    const value = parseFloat(valueStr || '1000');
    
    // Formula based on the provided screenshot requirements:
    // Holiday Haven Homes: 5% fee -> Earn = Total * 0.95
    // Airbnb: 14% to 18% fee -> Earn = Total * 0.86 (for the "or less" conservative estimate)
    // Booking.com: 15% to 25% fee -> Earn = Total * 0.85
    // Vrbo: 15% fee -> Earn = Total * 0.85
    
    return {
      bookingValue: value,
      holidayHavenHomes: Math.round(value * 0.95),
      airbnb: Math.round(value * 0.86),
      bookingCom: Math.round(value * 0.85),
      vrbo: Math.round(value * 0.85)
    };
  }
}
