import { ApiProperty } from '@nestjs/swagger';
import { Property as PropertyType } from '@prisma/client';

export class PropertyEntity implements PropertyType {
  constructor(partial: Partial<PropertyEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  propertyHeadline: string | null;

  @ApiProperty({ required: false })
  summary: string | null;

  @ApiProperty({ required: false })
  country: string | null;

  @ApiProperty({ required: false })
  state: string | null;

  @ApiProperty({ required: false })
  city: string | null;

  @ApiProperty({ required: false })
  streetAddress: string | null;

  @ApiProperty({ required: false })
  zip: string | null;

  @ApiProperty({ required: false })
  recommended: number | null;

  @ApiProperty({ required: false })
  propertyDescription: string | null;

  @ApiProperty({ required: false })
  bedroom: string | null;

  @ApiProperty({ required: false })
  bathroom: string | null;

  @ApiProperty({ required: false })
  propertyType: string | null;

  @ApiProperty({ required: false })
  situatedIn: number | null;

  @ApiProperty({ required: false })
  propertyViewId: number | null;

  @ApiProperty({ required: false })
  onWhichFloor: string | null;

  @ApiProperty({ required: false })
  elevator: string | null;

  @ApiProperty({ default: '0' })
  sleeps: string | null;

  @ApiProperty({ required: false })
  assignTo: number | null;

  @ApiProperty({ required: false })
  priority: number | null;

  @ApiProperty({ required: false })
  priorityDate: Date | null;

  @ApiProperty({ required: false })
  createdBy: number | null;

  @ApiProperty({ required: false })
  yearPurchased: string | null;
}

