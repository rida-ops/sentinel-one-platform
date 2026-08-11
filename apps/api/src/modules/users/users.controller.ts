import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserSchema } from '@sentinel/validation';
import { generateRequestId, ApiResponse } from '@sentinel/shared';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async listUsers(@Req() req: any): Promise<ApiResponse<any>> {
    const users = await this.usersService.listUsers(req.user.organizationId);
    return {
      success: true,
      data: users,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ApiResponse<any>> {
    const user = await this.usersService.getUserById(id);
    return {
      success: true,
      data: user,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUser(@Body() body: any, @Req() req: any): Promise<ApiResponse<any>> {
    const validated = CreateUserSchema.parse(body);
    const user = await this.usersService.createUser(validated, req.user.organizationId);
    return {
      success: true,
      data: user,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }
}
