// Enums
export enum Role {
  PLATFORM_OWNER = 'PLATFORM_OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MUNICIPALITY_ADMIN = 'MUNICIPALITY_ADMIN',
  DEPARTMENT_MANAGER = 'DEPARTMENT_MANAGER',
  DISPATCHER = 'DISPATCHER',
  OPERATOR = 'OPERATOR',
  FIELD_WORKER = 'FIELD_WORKER',
  CITIZEN = 'CITIZEN',
}

export enum IncidentState {
  REPORTED = 'REPORTED',
  TRIAGED = 'TRIAGED',
  ASSIGNED = 'ASSIGNED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_SCENE = 'ON_SCENE',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum TaskState {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum WorkerStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
  ON_BREAK = 'ON_BREAK',
  EMERGENCY = 'EMERGENCY',
}

// Common Types
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// User Types
export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionDTO {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  lastActiveAt: Date;
}

// Incident Types
export interface IncidentDTO {
  id: string;
  reporterId: string;
  departmentId?: string;
  location: GeoLocation;
  category: string;
  description: string;
  urgency: Urgency;
  state: IncidentState;
  aiClassification?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface TaskDTO {
  id: string;
  incidentId: string;
  departmentId: string;
  assignedToId?: string;
  description: string;
  state: TaskState;
  priority: Urgency;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Utility Functions
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula (distance in kilometers)
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
