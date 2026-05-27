import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class BookingPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: string | number;

  @ApiProperty()
  @IsNotEmpty()
  propertyId: string | number;

  @ApiProperty()
  @IsOptional()
  property_owner?: string | number;

  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  phoneCode?: string;

  @ApiProperty()
  @IsOptional()
  Email?: string;

  @ApiProperty()
  @IsOptional()
  Message?: string;

  @ApiProperty()
  @IsOptional()
  street?: string;

  @ApiProperty()
  @IsOptional()
  mobile?: string;

  @ApiProperty()
  @IsOptional()
  country?: string | number;

  @ApiProperty()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsOptional()
  zip?: string;

  @ApiProperty()
  @IsOptional()
  terms?: string | number;

  @ApiProperty()
  @IsOptional()
  adults?: string | number;

  @ApiProperty()
  @IsOptional()
  childs?: string | number;

  @ApiProperty()
  @IsOptional()
  booking_dates?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  stripeToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sourceId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  currencyShortForm?: string;
}

export class PaypalSuccessDto {
  @ApiProperty()
  @IsNotEmpty()
  payment_id: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  payment_status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  payment_gross?: string | number;
}

export class SquarePayDto {
  @ApiProperty()
  @IsNotEmpty()
  sourceId: string;

  @ApiProperty()
  @IsNotEmpty()
  amountInDollars: string | number;

  @ApiProperty()
  @IsNotEmpty()
  plan: string | number;

  @ApiProperty()
  @IsOptional()
  no_of_property?: string | number;

  @ApiProperty()
  @IsOptional()
  total_property?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  description1?: string;
}

export class PrepareBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  property_id: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  currencyCode?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  fetch_perNIGHT?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  property_owner?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  checkin_book?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  checkout_book?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  Selectadults?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  Selectchilds?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  booking_dates?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  total_amount?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  taxamount?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  full_place?: string;
}
