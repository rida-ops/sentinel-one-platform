import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema } from '@sentinel/validation';
import { generateRequestId, ApiResponse } from '@sentinel/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any): Promise<ApiResponse<any>> {
    try {
      const validated = LoginSchema.parse(body);
      const result = await this.authService.login(validated.email, validated.password);

      if (!result) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        success: true,
        data: result,
        error: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }): Promise<ApiResponse<any>> {
    const result = await this.authService.refreshToken(body.refreshToken);

    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      success: true,
      data: result,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }
}
