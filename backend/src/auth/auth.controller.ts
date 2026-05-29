import { Controller, Post, Body, UnauthorizedException, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entities/user.entity';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({ status: 200, description: 'Login successful', type: UserEntity })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    console.log('login hit ');
    const user = await this.authService.validateAdmin(loginDto.username, loginDto.password);
    console.log("body", loginDto);

    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const loginResult = await this.authService.login(user);

    // Set the JWT cookie for server-rendered pages
    res.cookie('jwt', loginResult.access_token, {
      httpOnly: true, // Improved security
      secure: false,  // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    return loginResult;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserEntity })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout — clears JWT cookie' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    return { success: true };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset link' })
  @ApiResponse({ status: 200, description: 'Reset password link dispatched' })
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  async resetPassword(@Body() body: any) {
    const { id, token, newPassword } = body;
    if (!id || !token || !newPassword) {
      throw new UnauthorizedException('Missing required fields');
    }
    return this.authService.resetPassword(id, token, newPassword);
  }
}

