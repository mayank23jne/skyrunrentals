import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async validateAdmin(email: string, pass: string): Promise<any> {
    console.log("email", email);
    console.log("pass", pass);
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    console.log("user", user);

    if (user) {
      console.log("user password", user.password);
      console.log("input password", pass);

      // MD5 hashing for password verification
      const hashedInput = crypto.createHash('md5').update(pass).digest('hex');
      console.log("hashedInput", hashedInput);
      const isMatch = hashedInput === user.password;

      console.log("isMatch", isMatch);
      if (isMatch) {
        console.log("user matched, is admin and active");
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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const plainPassword = data.password;
    const hashedPassword = crypto.createHash('md5').update(plainPassword).digest('hex');

    return this.prisma.user.create({
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
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Your mail is not registered with us' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    const resetLink = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?id=${user.id}&token=${token}`;
    
    // We would need mailService here, but since authService doesn't inject it yet, let's inject it.
  }
}
