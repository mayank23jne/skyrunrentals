import { ApiProperty } from '@nestjs/swagger';
import { PaymentDetail as PaymentDetailType } from '@prisma/client';

export class PaymentDetailEntity implements PaymentDetailType {
  constructor(partial: Partial<PaymentDetailEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  transactionBy: number;

  @ApiProperty()
  response: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  planType: number;

  @ApiProperty()
  noOfProperty: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty({ required: false })
  data: string | null;
}

