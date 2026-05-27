import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { CurrencyModule } from './currency/currency.module';
import { SettingsModule } from './settings/settings.module';
import { MailModule } from './mail/mail.module';
import { PropertyModule } from './property/property.module';
import { BookingModule } from './booking/booking.module';
import { ContactModule } from './contact/contact.module';
import { PaymentModule } from './payment/payment.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [AuthModule, PrismaModule, SubscriptionPlanModule, CurrencyModule, SettingsModule, MailModule, PropertyModule, BookingModule, ContactModule, PaymentModule, S3Module],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService],
})
export class AppModule {}
