# SENTINEL ONE — API Reference

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.sentinel-one.local/api`

## Authentication

All endpoints require JWT in the `Authorization` header:

```bash
Authorization: Bearer <token>
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "dispatcher@municipality.local",
  "password": "secure_password"
}

200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "dispatcher@municipality.local",
      "firstName": "John",
      "lastName": "Dispatcher",
      "role": "DISPATCHER",
      "permissions": ["incidents:view:all", "incidents:update", "tasks:assign"]
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbG..."
}

200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "expiresIn": 900
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer <token>

204 No Content
```

## Users

### List Users

```http
GET /users?page=1&limit=50&role=DISPATCHER&organization_id=uuid
Authorization: Bearer <token>

200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "user@municipality.local",
        "firstName": "John",
        "lastName": "Doe",
        "role": "DISPATCHER",
        "isActive": true,
        "lastLoginAt": "2024-01-01T00:00:00Z",
        "createdAt": "2023-12-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Get User

```http
GET /users/:id
Authorization: Bearer <token>

200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "dispatcher@municipality.local",
    "firstName": "John",
    "lastName": "Dispatcher",
    "role": "DISPATCHER",
    "permissions": ["incidents:view:all", "incidents:update"],
    "department": {
      "id": "uuid",
      "name": "Fire Department"
    },
    "isActive": true,
    "createdAt": "2023-12-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Create User

```http
POST /users
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "newuser@municipality.local",
  "firstName": "Jane",
  "lastName": "Operator",
  "role": "OPERATOR",
  "departmentId": "uuid",
  "password": "temporary_password"
}

201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@municipality.local",
    "firstName": "Jane",
    "lastName": "Operator",
    "role": "OPERATOR",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

## Incidents (M3)

### List Incidents

```http
GET /incidents?page=1&limit=50&state=REPORTED&urgency=CRITICAL&department_id=uuid
Authorization: Bearer <token>

200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "reporterId": "uuid",
        "departmentId": "uuid",
        "location": { "latitude": 40.7128, "longitude": -74.0060 },
        "category": "FIRE",
        "description": "Smoke detected from building",
        "urgency": "CRITICAL",
        "state": "REPORTED",
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:05:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 1200, "pages": 24 }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Get Incident

```http
GET /incidents/:id
Authorization: Bearer <token>

200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "reporterId": "uuid",
    "departmentId": "uuid",
    "location": { "latitude": 40.7128, "longitude": -74.0060 },
    "category": "FIRE",
    "description": "Smoke detected from building",
    "urgency": "CRITICAL",
    "state": "TRIAGED",
    "aiClassification": {
      "category": "FIRE",
      "confidence": 0.95,
      "recommendedDepartment": "uuid",
      "recommendedPriority": "HIGH"
    },
    "attachments": [
      {
        "id": "uuid",
        "type": "image",
        "url": "/storage/incidents/uuid/photo1.jpg",
        "uploadedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "tasks": [
      {
        "id": "uuid",
        "description": "Assess fire location",
        "state": "PENDING",
        "assignedTo": null
      }
    ],
    "timeline": [
      {
        "event": "INCIDENT_CREATED",
        "actor": { "id": "uuid", "name": "John Citizen" },
        "timestamp": "2024-01-01T12:00:00Z"
      },
      {
        "event": "INCIDENT_TRIAGED",
        "actor": { "id": "uuid", "name": "AI Classifier" },
        "timestamp": "2024-01-01T12:00:30Z"
      }
    ],
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:05:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Create Incident (Citizen)

```http
POST /incidents
Content-Type: application/json
Authorization: Bearer <token>

{
  "location": { "latitude": 40.7128, "longitude": -74.0060 },
  "category": "FIRE",
  "description": "Smoke detected from apartment building",
  "urgency": "CRITICAL"
}

201 Created
{
  "success": true,
  "data": {
    "id": "uuid",
    "reporterId": "uuid",
    "location": { "latitude": 40.7128, "longitude": -74.0060 },
    "category": "FIRE",
    "description": "Smoke detected from apartment building",
    "urgency": "CRITICAL",
    "state": "REPORTED",
    "createdAt": "2024-01-01T12:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Update Incident State

```http
PATCH /incidents/:id/state
Content-Type: application/json
Authorization: Bearer <token>

{
  "state": "ASSIGNED",
  "departmentId": "uuid",
  "note": "Assigned to Fire Department"
}

200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "state": "ASSIGNED",
    "departmentId": "uuid",
    "updatedAt": "2024-01-01T12:05:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

## Tasks (M3)

### Assign Task

```http
PATCH /tasks/:id/assign
Content-Type: application/json
Authorization: Bearer <token>

{
  "assignedTo": "uuid",
  "note": "Assigned to Field Worker"
}

200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "incidentId": "uuid",
    "assignedTo": "uuid",
    "state": "ASSIGNED",
    "updatedAt": "2024-01-01T12:05:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

### Update Task State

```http
PATCH /tasks/:id/state
Content-Type: application/json
Authorization: Bearer <token>

{
  "state": "IN_PROGRESS",
  "note": "Arrived on scene"
}

200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "state": "IN_PROGRESS",
    "updatedAt": "2024-01-01T12:05:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "requestId": "uuid"
}
```

## WebSocket Events (M5)

### Connect

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbG...'
  }
});
```

### Event: Incident Created

```javascript
socket.on('incident:created', (data) => {
  console.log('New incident:', data);
  // { id, reporterId, location, category, urgency, state, createdAt }
});
```

### Event: Incident Updated

```javascript
socket.on('incident:updated', (data) => {
  console.log('Incident updated:', data);
  // { id, state, departmentId, updatedAt }
});
```

### Event: Task Assigned

```javascript
socket.on('task:assigned', (data) => {
  console.log('Task assigned:', data);
  // { id, incidentId, assignedTo, state, updatedAt }
});
```

### Event: Worker Status Changed

```javascript
socket.on('worker:status-changed', (data) => {
  console.log('Worker status:', data);
  // { workerId, status, location, timestamp }
});
```

## Error Codes

| Code | Status | Meaning |
|------|--------|----------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | User lacks required permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |
| `RATE_LIMITED` | 429 | Too many requests |

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute
- **File upload**: 10 requests per minute

Headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704110100
```
