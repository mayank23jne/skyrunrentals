import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminService {
  private s3Client: S3Client;

  constructor(
    private prisma: PrismaService,
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

  async updateProfile(userId: number, data: { firstname: string; lastname: string; email: string; contact_number: string }) {
    // Check if email already exists for another user
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        contact_number: data.contact_number,
      },
    });
  }

  async changePassword(userId: number, passData: { currentPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const currentHashed = crypto.createHash('md5').update(passData.currentPassword).digest('hex');

    if (currentHashed !== user.password) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newHashed = crypto.createHash('md5').update(passData.newPassword).digest('hex');

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newHashed,
        original_password: passData.newPassword, // Update original_password as well
      },
    });
  }
  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: number, data: any) {
    // Basic sanitization
    const { password, original_password, ...updateData } = data;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { deleted: 1 },
    });
  }

  async toggleUserStatus(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    const newStatus = user.status === 0 ? 1 : 0;
    return this.prisma.user.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async findDonations(options: { skip?: number; take?: number; search?: string }) {
    const { skip, take, search } = options;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    return this.prisma.covid19Donation.findMany({
      where,
      skip,
      take,
      orderBy: { createdDate: 'desc' },
    });
  }

  async countDonations(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }
    return this.prisma.covid19Donation.count({ where });
  }

  // --- PROMOTIONAL CODES (Single Form) ---
  async getPromoSettings() {
    return this.prisma.promotionalCode.findFirst({
      orderBy: { id: 'asc' },
    });
  }

  async updatePromoSettings(data: { title: string; code: string }) {
    const existing = await this.prisma.promotionalCode.findFirst({
      orderBy: { id: 'asc' },
    });

    if (existing) {
      return this.prisma.promotionalCode.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          code: data.code,
        },
      });
    } else {
      return this.prisma.promotionalCode.create({
        data: {
          title: data.title,
          code: data.code,
        },
      });
    }
  }

  // --- TERMS & CONDITIONS (Single Form) ---
  async getTermsSettings() {
    return this.prisma.termCondition.findFirst({
      orderBy: { id: 'asc' },
    });
  }

  async updateTermsSettings(data: { title: string; detail: string }) {
    const existing = await this.prisma.termCondition.findFirst({
      orderBy: { id: 'asc' },
    });

    if (existing) {
      return this.prisma.termCondition.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          detail: data.detail,
        },
      });
    } else {
      return this.prisma.termCondition.create({
        data: {
          title: data.title,
          detail: data.detail,
        },
      });
    }
  }

  // --- EMPLOYEES / STAFF MANAGEMENT (User Table, Usertype: '2') ---
  async findEmployees(options: { skip?: number; take?: number; search?: string }) {
    const { skip, take, search } = options;
    const where: any = {
      usertype: '2',
      deleted: 0
    };

    if (search) {
      where.OR = [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
        { email: { contains: search } }
      ];
    }

    return this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' },
    });
  }

  async countEmployees(search?: string) {
    const where: any = {
      usertype: '2',
      deleted: 0
    };

    if (search) {
      where.OR = [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
        { email: { contains: search } }
      ];
    }

    return this.prisma.user.count({ where });
  }

  async createEmployee(data: any) {
    let plainPassword: string;

    if (data.system_generated_password) {
      // Generate a random 8-character alphanumeric password
      plainPassword = crypto.randomBytes(10).toString('hex'); // 8 hex chars
    } else {
      if (!data.password || data.password !== data.confirm_password) {
        throw new BadRequestException('Passwords do not match');
      }
      plainPassword = data.password;
    }

    const hashedPassword = crypto.createHash('md5').update(plainPassword).digest('hex');

    const employee = await this.prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        contact_number: data.contact_number || '',
        password: hashedPassword,
        original_password: plainPassword,
        usertype: '2',
        status: 0,
        deleted: 0,
        country: '',
        state: '',
        city: '',
        address: '',
        zipcode: 0,
        token: '',
      }
    });

    // Send credentials email if system generated
    if (data.system_generated_password) {
      const employeeRecipientEmails = [employee.email, 'info@skyrunrentals.com'];
      await this.mailService.sendEmployeeCredentials(
        employeeRecipientEmails,
        employee.firstname,
        plainPassword,
      );
    }

    // Return the generated password so the frontend can inform the admin
    return {
      success: true,
      employee,
      generatedPassword: data.system_generated_password ? plainPassword : undefined,
    };
  }

  async updateEmployee(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        contact_number: data.contact_number,
        status: parseInt(data.status) || 0,
      }
    });
  }

  async toggleEmployeeStatus(id: number) {
    const employee = await this.prisma.user.findUnique({ where: { id } });
    if (!employee) throw new BadRequestException('Employee not found');

    return this.prisma.user.update({
      where: { id },
      data: { status: employee.status === 0 ? 1 : 0 }
    });
  }

  async deleteEmployee(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { deleted: 1 }
    });
  }

  async changeEmployeePassword(id: number, newPassword: string) {
    const hashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        original_password: newPassword
      }
    });
  }

  // --- CURRENCY CONVERSION METHODS ---
  private async getCurrencyData(currencyId: number) {
    return this.prisma.currency.findUnique({
      where: { id: currencyId },
    });
  }

  private cleanPrice(price: any): number {
    if (typeof price === 'number') return price;
    return parseFloat(price?.toString().replace(/[^0-9.]/g, '')) || 0;
  }

  async currencyConversion(price: any, currencyId: number) {
    const usdPrice = this.cleanPrice(price);
    if (usdPrice === 0) return '0';

    const currency = await this.getCurrencyData(currencyId);
    if (!currency) return price.toString();

    const converted = Math.round(usdPrice * currency.conversionRate);
    const formatted = new Intl.NumberFormat('en-US').format(converted);
    return `${currency.currency}${formatted}`;
  }

  async currencyConversionReturn(price: any, currencyId: number) {
    return this.currencyConversion(price, currencyId);
  }

  async currencyConversionReturnWithoutSymbol(price: any, currencyId: number) {
    const usdPrice = this.cleanPrice(price);
    if (usdPrice === 0) return '0';

    const currency = await this.getCurrencyData(currencyId);
    if (!currency) return price.toString();

    const converted = Math.round(usdPrice * currency.conversionRate);
    return new Intl.NumberFormat('en-US').format(converted);
  }

  async currencyConversionInPound(price: any, currencyId: number) {
    const usdPrice = this.cleanPrice(price);
    if (usdPrice === 0) return '0';

    const currency = await this.getCurrencyData(currencyId);
    if (!currency) return price.toString();

    const poundRate = parseFloat(currency.poundConversion) || 0;
    const converted = Math.round(usdPrice * poundRate);
    return new Intl.NumberFormat('en-US').format(converted);
  }

  // --- SEARCH VENUE API ---
  async searchVenue(data: any) {
    const { venue_type, venue_id, check_in, check_out, guest } = data;
    const where: any = {};

    // 1. Dynamic Geographic Filtering (Resolving ID to Name per current DB pattern)
    if (venue_type === 'city' && venue_id) {
      const city = await this.prisma.city.findUnique({ where: { id: parseInt(venue_id) } });
      if (city) where.city = city.name;
    } else if (venue_type === 'state' && venue_id) {
      const state = await this.prisma.state.findUnique({ where: { id: parseInt(venue_id) } });
      if (state) where.state = state.name;
    } else if (venue_type === 'country' && venue_id) {
      const country = await this.prisma.country.findUnique({ where: { id: parseInt(venue_id) } });
      if (country) where.country = country.name;
    }

    // 2. Guest filtering (Sleeps)
    if (guest) {
      where.sleeps = { gte: guest.toString() };
    }

    // 3. Fetch Properties
    const properties = await this.prisma.property.findMany({
      where,
      include: {
        photos: {
          take: 1,
          where: { defaultImage: 1 }
        },
        rates: {
          take: 1
        }
      },
      orderBy: { id: 'desc' }
    });

    // 4. Enrich with Location Objects (mimicking PHP augmentation)
    const enrichedProperties = await Promise.all(properties.map(async (p) => {
      const [city, state, country] = await Promise.all([
        p.city ? this.prisma.city.findFirst({ where: { name: p.city } }) : null,
        p.state ? this.prisma.state.findFirst({ where: { name: p.state } }) : null,
        p.country ? this.prisma.country.findFirst({ where: { name: p.country } }) : null,
      ]);

      return {
        ...p,
        city_obj: city,
        state_obj: state,
        country_obj: country
      };
    }));

    return enrichedProperties;
  }

  // --- FORGOT PASSWORD ---
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      return { success: false, message: 'Your mail is not registered with us' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { token }
    });

    const resetLink = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?id=${user.id}&token=${token}`;
    
    const emailSent = await this.mailService.sendForgotPasswordEmail(email, resetLink);

    if (emailSent) {
      return { success: true, message: 'A password reset has been requested for this email account' };
    } else {
      return { success: false, message: 'Failed to send password reset email' };
    }
  }

  async checkVerifyCode(verifyCode: string): Promise<string> {
    const promo = await this.prisma.promotionalCode.findFirst({
      orderBy: { id: 'asc' },
    });

    if (!promo || verifyCode !== promo.code) {
      return "Invalid Verification Code";
    }
    return "";
  }

  async checkEmail(email: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      return "Already Exist";
    }
    return "";
  }

  async canLogin(email: string, pass: string): Promise<any> {
    const hashedInput = crypto.createHash('md5').update(pass).digest('hex');
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password: hashedInput,
        status: 0,
        deleted: 0,
      },
    });
    return user;
  }

  async getRules(userId: number, usertype: string, currencyCodeId?: number) {
    const [currency, bookings, users] = await Promise.all([
      this.prisma.currency.findMany({ orderBy: { id: 'asc' } }),
      this.prisma.ownerMessage.findMany({ orderBy: { id: 'asc' } }),
      this.prisma.user.findMany({ orderBy: { id: 'asc' } }),
    ]);

    let currencyCodeData: any = '';
    if (currencyCodeId) {
      currencyCodeData = await this.prisma.currency.findMany({
        where: { id: currencyCodeId },
        orderBy: { id: 'asc' }
      });
    }

    const propertiesWhere: any = {};
    if (usertype !== '0') {
      propertiesWhere.assignTo = userId;
    }

    const properties = await this.prisma.property.findMany({
      where: propertiesWhere,
      orderBy: { id: 'desc' }
    });

    return {
      currency,
      CurrencyCode: currencyCodeData,
      bookings,
      users,
      properties
    };
  }

  async registerUser(data: any) {
    if (data.verify_code && data.verify_code !== 'SS358') {
      throw new BadRequestException('Invalid Verification Code');
    }

    const existingEmail = await this.prisma.user.findFirst({
      where: { email: data.email }
    });
    if (existingEmail) {
      throw new BadRequestException('This email is already in use');
    }

    if (data.contact_no) {
      const existingPhone = await this.prisma.user.findFirst({
        where: { contact_number: String(data.contact_no) }
      });
      if (existingPhone) {
        throw new BadRequestException('This phone number is already in use');
      }
    }

    const hashedPassword = crypto.createHash('md5').update(data.password).digest('hex');

    const user = await this.prisma.user.create({
      data: {
        firstname: data.first_name || '',
        lastname: data.last_name || '',
        email: data.email,
        password: hashedPassword,
        original_password: data.password,
        contact_number: data.contact_no ? String(data.contact_no) : '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        address: data.address || '',
        zipcode: parseInt(data.zip) || 0,
        usertype: '1',
        subscription_type: 0,
        status: 0,
        deleted: 0,
        token: '',
      }
    });

    // 1. Generate PDF
    const policyData = await this.prisma.termCondition.findFirst({ orderBy: { id: 'asc' } });
    const pdfPath = path.join(process.cwd(), 'public/uploads/policyDoc', `privacyPolicy_${user.id}.pdf`);

    // Ensure directory exists
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
          <h2 style="text-align: right;">${user.firstname} ${user.lastname}</h2>
        </div>
      `;

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html);
      await page.pdf({ path: pdfPath, format: 'A4', landscape: true });
      await browser.close();

      // 2. Upload to S3
      const bucket = process.env.AWS_BUCKET;
      if (bucket) {
        const pdfBuffer = fs.readFileSync(pdfPath);
        await this.s3Client.send(new PutObjectCommand({
          Bucket: bucket,
          Key: `policyDoc/privacyPolicy_${user.id}.pdf`,
          Body: pdfBuffer,
          ContentType: 'application/pdf',
          ACL: 'public-read',
        }));
      }
    } catch (error) {
      console.error('Error generating or uploading policy PDF:', error);
    }

    // 3. Send Email
    const recipientEmails = [user.email, 'info@skyrunrentals.com'];
    await this.mailService.sendRegistrationEmail(recipientEmails, user, pdfPath);

    // 4. Cleanup local PDF
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    return user;
  }
}
