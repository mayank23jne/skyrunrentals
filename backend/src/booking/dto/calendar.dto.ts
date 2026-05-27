import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PropertyIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt()
  id: number;
}

export class FullCalendarBookingDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt()
  booking_status: number;
}

export class GetBookingRatesDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt()
  property_id: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  selected_dates: string[];
}
