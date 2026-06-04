import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsJSON } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertyHeadline: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  zip?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  propertyDescription?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bedroom?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bathroom?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  propertyType?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  onWhichFloor?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  elevator?: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : null)
  @IsNumber()
  propertyViewId?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sleeps?: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : null)
  @IsNumber()
  assignTo?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  yearPurchased?: string;

  // Contact Info
  @ApiProperty()
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactCountry?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactState?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactCity?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactStreetAddress?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactZip?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactReEmail?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactMobile?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactCallingHours?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactAltEmail?: string;

  // Amenities
  @ApiProperty()
  @IsOptional()
  @IsString()
  childrenSuitability?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  smokingSuitability?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  wheelchairSuitability?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  petsSuitability?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  otherSuitability?: string | string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  kitchenDining?: string | string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  diningArea?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  diningSeats?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  popularAmenities?: string | string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  entertainment?: string | string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  poolSpa?: string | string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  outdoorFeatures?: string | string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  otherServices?: string | string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  themes?: string | string[];

  @IsOptional()
  dynamicAmenities?: string | string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  // Bedding Info
  @ApiProperty()
  @IsOptional()
  @IsString()
  king?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  queen?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  doubleBed?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  twinSingle?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  childBed?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  babyCrib?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sleepSofaFuton?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  beddingNote?: string;

  // Nearby Places
  @ApiProperty()
  @IsOptional()
  @IsString()
  nearestAirport?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  airportDistance?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nearestAirportUnit?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nearestBeach?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  beachDistance?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nearestBeachUnit?: string;

  // seasonalRates (JSON string)
  @ApiProperty()
  @IsOptional()
  @IsJSON()
  seasonalRates?: string;

  // Extras
  @ApiProperty()
  @IsOptional()
  @IsString()
  petFee?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cleaningFee?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  taxes?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  damageProtection?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : 0)
  @IsNumber()
  mainPhotoIndex?: number;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  calendarBlockedDates?: string;
}
