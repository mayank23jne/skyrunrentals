import { ApiProperty } from '@nestjs/swagger';
import { Currency as CurrencyType } from '@prisma/client';

export class CurrencyEntity implements CurrencyType {
  constructor(partial: Partial<CurrencyEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  poundConversion: string;

  @ApiProperty({ default: 2 })
  currencyCode: number;
}

