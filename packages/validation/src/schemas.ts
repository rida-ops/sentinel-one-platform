import { z } from 'zod';

// Authentication
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password is required'),
});

export const PasswordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letters')
  .regex(/[a-z]/, 'Must contain lowercase letters')
  .regex(/\d/, 'Must contain numbers')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Must contain special characters');

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// User Management
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['CITIZEN', 'FIELD_WORKER', 'OPERATOR', 'DISPATCHER', 'DEPARTMENT_MANAGER', 'MUNICIPALITY_ADMIN', 'SUPER_ADMIN']),
  departmentId: z.string().cuid().optional(),
  password: PasswordSchema,
});

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.enum(['CITIZEN', 'FIELD_WORKER', 'OPERATOR', 'DISPATCHER', 'DEPARTMENT_MANAGER', 'MUNICIPALITY_ADMIN', 'SUPER_ADMIN']).optional(),
  departmentId: z.string().cuid().optional().nullable(),
  isActive: z.boolean().optional(),
});

// Incidents (M3)
export const CreateIncidentSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  category: z.string().min(1).max(50),
  description: z.string().min(10).max(2000),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export const UpdateIncidentStateSchema = z.object({
  state: z.enum(['REPORTED', 'TRIAGED', 'ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'ON_SCENE', 'RESOLVED', 'CLOSED', 'CANCELLED']),
  departmentId: z.string().cuid().optional(),
  note: z.string().max(500).optional(),
});

// Tasks (M3)
export const AssignTaskSchema = z.object({
  assignedToId: z.string().cuid(),
  note: z.string().max(500).optional(),
});

export const UpdateTaskStateSchema = z.object({
  state: z.enum(['PENDING', 'ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  note: z.string().max(500).optional(),
});

// File Upload
export const FileUploadSchema = z.object({
  fileName: z.string().max(255),
  fileType: z.enum(['image', 'video', 'document']),
  fileSize: z.number().max(100 * 1024 * 1024), // 100 MB
  contentType: z.string().regex(/^(image\/(jpeg|png)|video\/mp4|application\/(pdf|msword|vnd\.openxmlformats-officedocument))/, 'File type not allowed'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateIncidentInput = z.infer<typeof CreateIncidentSchema>;
export type UpdateIncidentStateInput = z.infer<typeof UpdateIncidentStateSchema>;
export type AssignTaskInput = z.infer<typeof AssignTaskSchema>;
export type UpdateTaskStateInput = z.infer<typeof UpdateTaskStateSchema>;
export type FileUploadInput = z.infer<typeof FileUploadSchema>;
