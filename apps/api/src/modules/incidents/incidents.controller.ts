import { Controller, Get, Post, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncidentsService } from './incidents.service';
import { CreateIncidentSchema, UpdateIncidentStateSchema } from '@sentinel/validation';
import { generateRequestId, ApiResponse } from '@sentinel/shared';

@Controller('incidents')
export class IncidentsController {
  constructor(private incidentsService: IncidentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async listIncidents(@Req() req: any): Promise<ApiResponse<any>> {
    const incidents = await this.incidentsService.listIncidents(req.user.organizationId);
    return {
      success: true,
      data: incidents,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getIncident(@Param('id') id: string): Promise<ApiResponse<any>> {
    const incident = await this.incidentsService.getIncidentById(id);
    return {
      success: true,
      data: incident,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createIncident(@Body() body: any, @Req() req: any): Promise<ApiResponse<any>> {
    const validated = CreateIncidentSchema.parse(body);
    const incident = await this.incidentsService.createIncident(validated, req.user.userId, req.user.organizationId);
    return {
      success: true,
      data: incident,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/state')
  async updateIncidentState(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any
  ): Promise<ApiResponse<any>> {
    const validated = UpdateIncidentStateSchema.parse(body);
    const incident = await this.incidentsService.updateIncidentState(id, validated, req.user.userId);
    return {
      success: true,
      data: incident,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }
}
