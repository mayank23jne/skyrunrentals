import { IsString, IsInt, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyBookingDto {
  @ApiProperty({ description: 'First name of the guest' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the guest' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address of the guest' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mobile phone number' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ description: 'Message for the owner', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: 'Street address', required: false })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'Zip/Postal code', required: false })
  @IsString()
  @IsOptional()
  zip?: string;

  @ApiProperty({ description: 'Number of adults' })
  @IsInt()
  @IsOptional()
  adults?: number;

  @ApiProperty({ description: 'Number of children' })
  @IsInt()
  @IsOptional()
  childs?: number;

  @ApiProperty({ description: 'Booking dates string (e.g. 2026-06-01 to 2026-06-10)' })
  @IsString()
  @IsNotEmpty()
  bookingDates: string;

  @ApiProperty({ description: 'Total amount calculated for the booking' })
  @IsString()
  @IsOptional()
  amount?: string;
}
