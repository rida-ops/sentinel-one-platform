# SENTINEL ONE — Platform Architecture

## Overview

SENTINEL ONE is a unified incident management platform for municipal operations. The system integrates citizen reporting, AI-assisted triage, dispatcher command-and-control, and field worker coordination into a single platform.

## Architecture Principles

1. **Monorepo Structure**: Single repository, multiple independent apps sharing common libraries.
2. **API-First**: All cross-module communication flows through well-defined APIs.
3. **Real-Time**: WebSocket support for live incident updates and worker status.
4. **Security-First**: RBAC, audit logging, and encryption at rest and in transit.
5. **Scalability**: Horizontal scaling via containerization and load balancing.
6. **Provider Agnostic**: Map provider, payment processor, and notification systems remain swappable.

## Platform Milestones

### M1: Blink Baseline
Citizen-facing incident reporting via Blink framework. Frozen baseline.

### M2: Platform Core (Current)
- Monorepo structure
- Shared packages (auth, database, validation, etc.)
- NestJS API foundation
- Prisma ORM with PostgreSQL
- Redis for sessions and events
- MinIO for file storage
- Docker Compose for local development

### M3: Incident Engine
Real incident workflow with state transitions and audit events.

### M4: Dispatch Center
Real-time dashboard for incident and worker management.

### M5: Real-Time Updates
WebSocket integration for live incident and worker status.

### M6: Map System
Operational map with incident, worker, and asset layers.

### M7: File System
Centralized file storage with audit trail.

### M8: AI Center
Incident classification, prioritization, and dispatcher assistance.

### M9: Administration
Multi-organization management and role configuration.

### M10: Mobile
Worker and citizen mobile apps sharing the same API.

### M11: Security Hardening
Full security audit, rate limiting, secrets management.

### M12: Production Deployment
Nginx + Docker + Monitoring + CI/CD pipeline.

## Directory Structure

```
sentinel-one-platform/
├── apps/
│   ├── web/                  # Next.js frontend (operations UI)
│   ├── api/                  # NestJS backend
│   ├── mobile/               # React Native (M10)
│   └── ai-center/            # AI microservice
├── packages/
│   ├── database/             # Prisma schema + migrations
│   ├── auth/                 # JWT, session, RBAC
│   ├── permissions/          # Permission engine
│   ├── validation/           # Zod schemas
│   ├── events/               # Event emitter
│   ├── logger/               # Structured logging
│   └── shared/               # Types, utilities
├── infrastructure/
│   ├── docker/               # Docker Compose + Nginx
│   └── monitoring/           # Prometheus, Grafana, Loki
├── docs/
│   ├── architecture.md       # This file
│   ├── api.md                # API reference
│   ├── security.md           # Security guidelines
│   └── operations.md         # Operational runbook
└── README.md
```

## Core Services

### PostgreSQL
- Primary relational database
- Schema managed by Prisma
- Connection pooling via pgBouncer (production)

### Redis
- Session storage
- Job queue (Bull)
- Real-time event pub/sub
- Cache layer

### MinIO
- S3-compatible object storage
- Incident photos, videos, documents
- User avatars
- Reports and exports

### NestJS API
- RESTful + GraphQL endpoints
- WebSocket gateway for real-time updates
- Authentication/authorization middleware
- Database transactions

### Next.js Web
- Operations UI (dispatcher, admin)
- Real-time incident dashboard
- Map interface
- Responsive design with Shadcn/ui

## Data Model (M2)

### Organization
- id (UUID)
- name (string)
- slug (string, unique)
- logo_url (string)
- settings (JSON)
- created_at (timestamp)
- updated_at (timestamp)

### Department
- id (UUID)
- organization_id (FK)
- name (string)
- code (string)
- color (hex)
- capabilities (array of strings)
- created_at (timestamp)

### User
- id (UUID)
- organization_id (FK)
- email (string, unique per org)
- username (string)
- password_hash (string, Argon2)
- first_name (string)
- last_name (string)
- avatar_url (string)
- role (enum: PLATFORM_OWNER, SUPER_ADMIN, MUNICIPALITY_ADMIN, DEPARTMENT_MANAGER, DISPATCHER, OPERATOR, FIELD_WORKER, CITIZEN)
- is_active (boolean)
- email_verified_at (timestamp, nullable)
- last_login_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### Session
- id (UUID)
- user_id (FK)
- device_id (string)
- ip_address (string)
- user_agent (string)
- expires_at (timestamp)
- created_at (timestamp)
- last_active_at (timestamp)

### Permission
- id (UUID)
- name (string, unique)
- description (string)
- category (string)
- created_at (timestamp)

### RolePermission
- role (enum)
- permission_id (FK)
- created_at (timestamp)

### Incident (M3)
- id (UUID)
- organization_id (FK)
- department_id (FK, nullable initially)
- reporter_id (FK, user)
- location (point geometry)
- category (string)
- description (text)
- urgency (enum: LOW, MEDIUM, HIGH, CRITICAL)
- state (enum: REPORTED, TRIAGED, ASSIGNED, ACKNOWLEDGED, IN_PROGRESS, ON_SCENE, RESOLVED, CLOSED, CANCELLED)
- ai_classification (JSON, M8)
- resolved_at (timestamp, nullable)
- closed_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### Task (M3)
- id (UUID)
- incident_id (FK)
- department_id (FK)
- assigned_to (FK, user, nullable)
- description (text)
- state (enum: PENDING, ASSIGNED, ACKNOWLEDGED, IN_PROGRESS, COMPLETED, CANCELLED)
- priority (enum: LOW, MEDIUM, HIGH, CRITICAL)
- completed_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### AuditEvent
- id (UUID)
- organization_id (FK)
- user_id (FK)
- entity_type (string)
- entity_id (UUID)
- action (string)
- changes (JSON)
- ip_address (string)
- user_agent (string)
- created_at (timestamp)

## Authentication Flow

```
1. User submits email + password
   ↓
2. Validate credentials (Argon2 verification)
   ↓
3. Create session record
   ↓
4. Issue short-lived JWT (15 minutes)
   ↓
5. Issue rotating refresh token (7 days, Redis)
   ↓
6. Store session in Redis (device tracking)
   ↓
7. Return JWT + refresh token to client
   ↓
8. Client uses JWT in Authorization header
   ↓
9. API validates JWT signature + expiration
   ↓
10. Extract user + permissions from JWT
    ↓
11. Evaluate RBAC for endpoint
    ↓
12. Allow or deny request
```

## Roles and Permissions

### Predefined Roles

- **PLATFORM_OWNER**: Full access to all organizations and features. Billing, audit logs.
- **SUPER_ADMIN**: Full access to one organization. Can create admins, configure departments.
- **MUNICIPALITY_ADMIN**: Manage organization settings, view all incidents, manage departments.
- **DEPARTMENT_MANAGER**: Manage tasks, workers, and incidents within department.
- **DISPATCHER**: View incidents, assign workers, update incident state.
- **OPERATOR**: Support dispatcher, limited incident assignment.
- **FIELD_WORKER**: View assigned tasks, update task state, upload photos.
- **CITIZEN**: Submit incidents, view own incident history.

### Permission Model

Permissions are database-driven. Examples:

- `incidents:view:all` — View all incidents
- `incidents:view:own` — View own incidents
- `incidents:create` — Create incident
- `incidents:update` — Update incident state
- `incidents:delete` — Delete incident
- `tasks:assign` — Assign tasks to workers
- `users:manage` — Manage users
- `organization:settings` — Configure organization
- `audit:view` — View audit logs

## Error Handling

All API responses follow this structure:

```json
{
  "success": true,
  "data": { },
  "error": null,
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

On error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials",
    "details": { }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

## Next Steps (M3)

1. Database schema finalization
2. API endpoint scaffolding
3. Authentication implementation
4. Incident workflow engine
5. WebSocket gateway
