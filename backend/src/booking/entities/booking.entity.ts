import { ApiProperty } from '@nestjs/swagger';
import { 
  Booking as BookingType, 
  PropertyBooking as PropertyBookingType,
  BookingState as BookingStateType
} from '@prisma/client';

export class BookingEntity implements BookingType {
  constructor(partial: Partial<BookingEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty({ default: 0 })
  idItem: number;

  @ApiProperty()
  theDate: Date;

  @ApiProperty({ default: 0 })
  idState: number;

  @ApiProperty({ default: 0 })
  idBooking: number;
}

export class PropertyBookingEntity implements PropertyBookingType {
  constructor(partial: Partial<PropertyBookingEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  propertyOwner: number | null;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false, default: 0 })
  adults: number | null;

  @ApiProperty({ required: false, default: 0 })
  childs: number | null;

  @ApiProperty()
  street: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zip: string;

  @ApiProperty({ required: false })
  transactionId: string | null;

  @ApiProperty()
  terms: number;

  @ApiProperty()
  response: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  bookingDates: string;

  @ApiProperty()
  createdAt: Date;
}

export class BookingStateEntity implements BookingStateType {
  constructor(partial: Partial<BookingStateEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  descEn: string;

  @ApiProperty()
  descEs: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  state: number;

  @ApiProperty()
  listOrder: number;

  @ApiProperty()
  class: string;

  @ApiProperty()
  showInKey: number;
}



