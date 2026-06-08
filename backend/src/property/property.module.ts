import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PublicPropertyController } from './public-property.controller';
import { PropertyService } from './property.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [PropertyController, PublicPropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
