import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DepartmentsService } from './departments.service';
import { generateRequestId, ApiResponse } from '@sentinel/shared';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createDepartment(@Body() body: any, @Req() req: any): Promise<ApiResponse<any>> {
    const department = await this.departmentsService.createDepartment(
      req.user.organizationId,
      body.name,
      body.code
    );
    return {
      success: true,
      data: department,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }
}
