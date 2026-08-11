import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { AssignTaskSchema, UpdateTaskStateSchema } from '@sentinel/validation';
import { generateRequestId, ApiResponse } from '@sentinel/shared';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async listTasks(@Req() req: any): Promise<ApiResponse<any>> {
    const tasks = await this.tasksService.listTasks(req.user.organizationId);
    return {
      success: true,
      data: tasks,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/assign')
  async assignTask(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any
  ): Promise<ApiResponse<any>> {
    const validated = AssignTaskSchema.parse(body);
    const task = await this.tasksService.assignTask(id, validated.assignedToId, req.user.userId);
    return {
      success: true,
      data: task,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/state')
  async updateTaskState(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any
  ): Promise<ApiResponse<any>> {
    const validated = UpdateTaskStateSchema.parse(body);
    const task = await this.tasksService.updateTaskState(id, validated, req.user.userId);
    return {
      success: true,
      data: task,
      error: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }
}
