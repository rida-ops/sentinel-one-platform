import { Injectable } from '@nestjs/common';
import { UpdateTaskStateInput } from '@sentinel/validation';
import { PrismaService } from '../../prisma.service';
import { eventService, PlatformEvent } from '@sentinel/events';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async listTasks(organizationId: string) {
    return this.prisma.task.findMany({
      where: { department: { organizationId } },
      include: {
        incident: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignTask(id: string, assignedToId: string, userId: string) {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        assignedToId,
        state: 'ASSIGNED',
      },
      include: {
        incident: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Log audit event
    await this.prisma.auditEvent.create({
      data: {
        organizationId: task.incident.organizationId,
        userId,
        entityType: 'task',
        entityId: id,
        action: 'ASSIGN',
        changes: { assignedToId },
        ipAddress: '127.0.0.1',
        userAgent: '',
      },
    });

    // Emit event
    eventService.emit(PlatformEvent.TASK_ASSIGNED, {
      taskId: task.id,
      incidentId: task.incidentId,
      assignedToId: task.assignedToId || '',
      organizationId: task.incident.organizationId,
    });

    return task;
  }

  async updateTaskState(id: string, data: UpdateTaskStateInput, userId: string) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { state: data.state },
      include: {
        incident: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Log audit event
    await this.prisma.auditEvent.create({
      data: {
        organizationId: task.incident.organizationId,
        userId,
        entityType: 'task',
        entityId: id,
        action: 'STATE_CHANGE',
        changes: { state: data.state },
        ipAddress: '127.0.0.1',
        userAgent: '',
      },
    });

    // Emit event
    eventService.emit(PlatformEvent.TASK_ASSIGNED, {
      taskId: task.id,
      incidentId: task.incidentId,
      assignedToId: task.assignedToId || '',
      organizationId: task.incident.organizationId,
    });

    return task;
  }
}
