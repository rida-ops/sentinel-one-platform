import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { eventService, PlatformEvent } from '@sentinel/events';
import logger from '@sentinel/logger';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    logger.info(`Client connected: ${client.id}`);
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      return;
    }
    client.join(`user:${client.id}`);
  }

  handleDisconnect(client: Socket) {
    logger.info(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('incident:subscribe')
  handleIncidentSubscribe(client: Socket, data: { organizationId: string }) {
    client.join(`org:${data.organizationId}:incidents`);
  }

  @SubscribeMessage('task:subscribe')
  handleTaskSubscribe(client: Socket, data: { organizationId: string }) {
    client.join(`org:${data.organizationId}:tasks`);
  }

  broadcastIncidentCreated(organizationId: string, data: any) {
    this.server.to(`org:${organizationId}:incidents`).emit('incident:created', data);
  }

  broadcastIncidentUpdated(organizationId: string, data: any) {
    this.server.to(`org:${organizationId}:incidents`).emit('incident:updated', data);
  }

  broadcastTaskAssigned(organizationId: string, data: any) {
    this.server.to(`org:${organizationId}:tasks`).emit('task:assigned', data);
  }
}

// Listen to platform events and broadcast via WebSocket
const gateway = new GatewayService();

eventService.on(PlatformEvent.INCIDENT_CREATED, (data) => {
  gateway.broadcastIncidentCreated(data.organizationId, data);
});

eventService.on(PlatformEvent.INCIDENT_UPDATED, (data) => {
  gateway.broadcastIncidentUpdated(data.organizationId, data);
});

eventService.on(PlatformEvent.TASK_ASSIGNED, (data) => {
  gateway.broadcastTaskAssigned(data.organizationId, data);
});
