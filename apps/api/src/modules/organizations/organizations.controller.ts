import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationsService } from './organizations.service';
import { generateRequestId, ApiResponse } from '@sentinel/shared';

@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrganization(@Body() body: any, @Req() req: any): Promise<ApiResponse<any>> {
    if (req.user.role !== 'PLATFORM_OWNER') {
      return {
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Only platform owners can create organizations' },
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
      };
    }

    const organization = await this.organizationsService.createOrganization(body.name, body.slug);
    return {
      success: true,
      data: organization,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }
}
