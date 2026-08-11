import { Injectable } from '@nestjs/common';
import { CreateIncidentInput, UpdateIncidentStateInput } from '@sentinel/validation';
import { PrismaService } from '../../prisma.service';
import { eventService, PlatformEvent } from '@sentinel/events';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async listIncidents(organizationId: string) {
    return this.prisma.incident.findMany({
      where: { organizationId },
      include: {
        reporter: { select: { id: true, firstName: true, lastName: true } },
        department: { select: { id: true, name: true } },
        attachments: true,
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getIncidentById(id: string) {
    return this.prisma.incident.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, firstName: true, lastName: true } },
        department: { select: { id: true, name: true } },
        attachments: true,
        tasks: true,
      },
    });
  }

  async createIncident(
    data: CreateIncidentInput,
    reporterId: string,
    organizationId: string
  ) {
    const incident = await this.prisma.incident.create({
      data: {
        reporterId,
        organizationId,
        category: data.category,
        description: data.description,
        urgency: data.urgency,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        state: 'REPORTED',
      },
      include: {
        reporter: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Emit event
    eventService.emit(PlatformEvent.INCIDENT_CREATED, {
      id: incident.id,
      reporterId: incident.reporterId,
      organizationId: incident.organizationId,
      category: incident.category,
      urgency: incident.urgency,
    });

    return incident;
  }

  async updateIncidentState(
    id: string,
    data: UpdateIncidentStateInput,
    userId: string
  ) {
    const incident = await this.prisma.incident.update({
      where: { id },
      data: {
        state: data.state,
        departmentId: data.departmentId,
      },
      include: {
        reporter: { select: { id: true, firstName: true, lastName: true } },
        department: { select: { id: true, name: true } },
      },
    });

    // Log audit event
    await this.prisma.auditEvent.create({
      data: {
        organizationId: incident.organizationId,
        userId,
        incidentId: id,
        entityType: 'incident',
        entityId: id,
        action: 'STATE_CHANGE',
        changes: { state: data.state },
        ipAddress: '127.0.0.1',
        userAgent: '',
      },
    });

    // Emit event
    eventService.emit(PlatformEvent.INCIDENT_UPDATED, {
      id: incident.id,
      organizationId: incident.organizationId,
      changes: { state: data.state },
    });

    return incident;
  }
}
