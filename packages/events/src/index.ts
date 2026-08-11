import { EventEmitter2 } from 'eventemitter2';

export enum PlatformEvent {
  // Incidents
  INCIDENT_CREATED = 'incident:created',
  INCIDENT_UPDATED = 'incident:updated',
  INCIDENT_STATE_CHANGED = 'incident:state_changed',
  INCIDENT_ASSIGNED = 'incident:assigned',
  
  // Tasks
  TASK_CREATED = 'task:created',
  TASK_ASSIGNED = 'task:assigned',
  TASK_STATE_CHANGED = 'task:state_changed',
  
  // Workers
  WORKER_STATUS_CHANGED = 'worker:status_changed',
  WORKER_LOCATION_UPDATED = 'worker:location_updated',
  
  // Users
  USER_LOGGED_IN = 'user:logged_in',
  USER_LOGGED_OUT = 'user:logged_out',
  
  // Notifications
  NOTIFICATION_CREATED = 'notification:created',
}

interface PlatformEventData {
  [PlatformEvent.INCIDENT_CREATED]: {
    id: string;
    reporterId: string;
    organizationId: string;
    category: string;
    urgency: string;
  };
  [PlatformEvent.INCIDENT_UPDATED]: {
    id: string;
    organizationId: string;
    changes: Record<string, any>;
  };
  [PlatformEvent.TASK_ASSIGNED]: {
    taskId: string;
    incidentId: string;
    assignedToId: string;
    organizationId: string;
  };
  [PlatformEvent.WORKER_STATUS_CHANGED]: {
    workerId: string;
    status: string;
    organizationId: string;
  };
  [key: string]: any;
}

class EventService {
  private emitter = new EventEmitter2({
    wildcard: true,
    maxListeners: 100,
  });

  emit<K extends PlatformEvent>(
    event: K,
    data: PlatformEventData[K]
  ): void {
    this.emitter.emit(event, data);
  }

  on<K extends PlatformEvent>(
    event: K,
    listener: (data: PlatformEventData[K]) => void | Promise<void>
  ): void {
    this.emitter.on(event, listener);
  }

  once<K extends PlatformEvent>(
    event: K,
    listener: (data: PlatformEventData[K]) => void | Promise<void>
  ): void {
    this.emitter.once(event, listener);
  }

  off<K extends PlatformEvent>(
    event: K,
    listener: (data: PlatformEventData[K]) => void | Promise<void>
  ): void {
    this.emitter.off(event, listener);
  }
}

export const eventService = new EventService();
