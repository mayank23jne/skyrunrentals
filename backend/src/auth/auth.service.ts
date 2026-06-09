import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AuthService {
  private s3Client: S3Client;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_KEY || '',
      },
    });
  }

  async validateAdmin(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      // MD5 hashing for password verification
      const hashedInput = crypto.createHash('md5').update(pass).digest('hex');
      const isMatch = hashedInput === user.password;
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, usertype: user.usertype };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        usertype: user.usertype,
        firstname: user.firstname,
        lastname: user.lastname,
        subscription_type: user.subscription_type,
      },
    };
  }

  async register(data: any) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { contact_number: data.contact_number },
        ]
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new BadRequestException('Email already in use');
      }
      if (existingUser.contact_number === data.contact_number) {
        throw new BadRequestException('Phone number already in use');
      }
    }

    const plainPassword = data.password;
    const hashedPassword = crypto.createHash('md5').update(plainPassword).digest('hex');

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        original_password: plainPassword,
        status: 0, // Active by default
        usertype: data.usertype || '1', // Default to general user
        token: '',
        subscription_type: 0,
      },
    });

    // Generate PDF and send Email
    const policyData = await this.prisma.termCondition.findFirst({ orderBy: { id: 'asc' } });
    const pdfPath = path.join(process.cwd(), 'public/uploads/policyDoc', `privacyPolicy_${newUser.id}.pdf`);

    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 40px;">
          <h1 style="text-align: center;">${policyData?.title || 'Our Policy'}</h1>
          <div style="text-align: justify; margin: 20px 0;">
            ${policyData?.detail || ''}
          </div>
          <h2 style="text-align: right;">${newUser.firstname || ''} ${newUser.lastname || ''}</h2>
        </div>
      `;

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html);
      await page.pdf({ path: pdfPath, format: 'A4', landscape: true });
      await browser.close();

      const bucket = process.env.AWS_BUCKET;
      if (bucket) {
        const pdfBuffer = fs.readFileSync(pdfPath);
        await this.s3Client.send(new PutObjectCommand({
          Bucket: bucket,
          Key: `policyDoc/privacyPolicy_${newUser.id}.pdf`,
          Body: pdfBuffer,
          ContentType: 'application/pdf',
          ACL: 'public-read',
        }));
      }
    } catch (error) {
      console.error('Error generating or uploading policy PDF:', error);
    }

    const recipientEmails = [newUser.email, 'robin@skyrunrentals.com', 'info@skyrunrentals.com'];
    await this.mailService.sendRegistrationEmail(recipientEmails, newUser, pdfPath);

    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    return newUser;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Your mail is not registered with us');
    }

    const token = crypto.randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    const resetLink = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?id=${user.id}&token=${token}`;

    await this.mailService.sendForgotPasswordEmail(email, resetLink);
    return { success: true, message: 'Reset password link dispatched.' };
  }

  async resetPassword(id: number, token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: Number(id), token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        original_password: newPassword,
        token: '' // Clear token after successful reset
      },
    });

    return { success: true, message: 'Password has been reset successfully' };
  }
}
