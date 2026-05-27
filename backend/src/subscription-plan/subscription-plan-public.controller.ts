import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubscriptionPlanService } from './subscription-plan.service';

@ApiTags('Public/Plans')
@Controller('plans')
export class SubscriptionPlanPublicController {
  constructor(private readonly plansService: SubscriptionPlanService) {}

  @Get()
  @ApiOperation({ summary: 'Get all subscription plans for public display' })
  async findAll() {
    return this.plansService.findAll();
  }
}
