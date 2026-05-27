import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlanController } from './subscription-plan.controller';
import { SubscriptionPlanPublicController } from './subscription-plan-public.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionPlanController, SubscriptionPlanPublicController],
  providers: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}
