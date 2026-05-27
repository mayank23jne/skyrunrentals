import { ApiProperty } from '@nestjs/swagger';
import { Contact as ContactType } from '@prisma/client';

export class ContactEntity implements ContactType {
  constructor(partial: Partial<ContactEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  name: string | null;

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
  email: string | null;

  @ApiProperty({ required: false })
  regEmail: string | null;

  @ApiProperty({ required: false })
  phonecode: string | null;

  @ApiProperty({ required: false })
  phoneNote: string | null;

  @ApiProperty({ required: false })
  mobileNumber: string | null;

  @ApiProperty({ required: false })
  contactPhone: string | null;

  @ApiProperty({ required: false })
  callingHours: string | null;

  @ApiProperty({ required: false })
  faxNumber: string | null;

  @ApiProperty({ required: false })
  faxInfo: string | null;

  @ApiProperty({ required: false })
  altEmail: string | null;

  @ApiProperty()
  smsNumber: string;

  @ApiProperty()
  othLanguage: string;

  @ApiProperty({ required: false })
  enquiryLang: string | null;
}

