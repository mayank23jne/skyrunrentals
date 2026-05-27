import { ApiProperty } from '@nestjs/swagger';
import { Plan as PlanType } from '@prisma/client';

export class SubscriptionPlanEntity implements PlanType {
  constructor(partial: Partial<SubscriptionPlanEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  planName: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  description1: string;

  @ApiProperty()
  description2: string;

  @ApiProperty()
  description3: string;

  @ApiProperty()
  description4: string;

  @ApiProperty()
  description5: string;

  @ApiProperty()
  description6: string;

  @ApiProperty()
  description7: string;

  @ApiProperty()
  description8: string;

  @ApiProperty()
  description9: string;

  @ApiProperty()
  description10: string;

  @ApiProperty()
  description11: string;

  @ApiProperty()
  description12: string;

  @ApiProperty()
  description13: string;
}

