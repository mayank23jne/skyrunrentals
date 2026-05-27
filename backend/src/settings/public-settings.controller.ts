import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Public/Settings')
@Controller('public/settings')
export class PublicSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /**
   * Public endpoint — no authentication required.
   * Returns all feedback/testimonial records for the frontend.
   */
  @Get('feedback')
  async getPublicFeedback() {
    return this.settingsService.findFeedbacks();
  }
}
