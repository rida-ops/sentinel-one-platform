# SENTINEL ONE — Security Guidelines

## M2 Security Baseline

This document outlines security requirements for the SENTINEL ONE platform.

## Authentication & Authorization

### Password Management

1. **Hashing**: All passwords must be hashed with Argon2id (NOT bcrypt).
   - Time cost: 2
   - Memory cost: 65536 KiB
   - Parallelism: 4

2. **Password Policy**:
   - Minimum 12 characters
   - Must include uppercase, lowercase, digits, and special characters
   - No dictionary words
   - No reuse of last 5 passwords

3. **Password Reset**:
   - Token expires after 1 hour
   - Email verification required
   - Cannot reset to a previous password

### Session Management

1. **JWT Structure**:
   ```
   Header: { alg: "HS256", typ: "JWT" }
   Payload: {
     sub: user_id,
     email: user_email,
     role: role,
     permissions: [array],
     org_id: organization_id,
     iat: timestamp,
     exp: timestamp + 900,
     jti: unique_token_id
   }
   ```

2. **Refresh Token Rotation**:
   - Every refresh generates a new refresh token
   - Old refresh tokens are invalidated
   - Stored in Redis with TTL

3. **Session Tracking**:
   - Store session in Redis: `sessions:{user_id}:{session_id}`
   - Include device_id, ip_address, user_agent
   - Detect suspicious sessions (different IP, device)

### Multi-Factor Authentication (Future - M11)

- TOTP (Time-based One-Time Password) via Google Authenticator
- Backup codes for recovery
- Enforcement per role

## Data Protection

### At Rest

1. **Database Encryption**:
   - PostgreSQL with pgcrypto extension
   - Encrypt sensitive fields: SSN, phone, address
   - Key rotation quarterly

2. **File Encryption**:
   - MinIO with server-side encryption (SSE-S3)
   - Master key in HashiCorp Vault (production)

### In Transit

1. **TLS/HTTPS**:
   - TLS 1.3 minimum
   - Strong ciphers only
   - Certificate pinning (mobile apps)
   - HSTS header: `Strict-Transport-Security: max-age=31536000`

2. **API Communication**:
   - All endpoints HTTPS only
   - Redirect HTTP → HTTPS

## Access Control

### RBAC Implementation

1. **Role Hierarchy**:
   ```
   PLATFORM_OWNER
       ↓
   SUPER_ADMIN
       ↓
   MUNICIPALITY_ADMIN
       ↓
   [DEPARTMENT_MANAGER, DISPATCHER, OPERATOR]
       ↓
   FIELD_WORKER
       ↓
   CITIZEN
   ```

2. **Permission Evaluation**:
   ```
   if (role === 'PLATFORM_OWNER') return true
   if (permission not in role_permissions) return false
   if (resource.organization_id !== user.organization_id) return false
   if (resource.department_id && !user.departments.includes(resource.department_id)) return false
   return true
   ```

3. **Default Permissions**:
   - Deny all, allow by explicit permission
   - No wildcard permissions
   - Time-based permissions (business hours, temporary access)

### Organization Isolation

1. **Query Scoping**:
   ```sql
   SELECT * FROM incidents
   WHERE organization_id = current_user.organization_id
   ```

2. **Data Leakage Prevention**:
   - Middleware enforces organization_id in all queries
   - Prevent cross-organization data access
   - Audit logs track access attempts

## API Security

### Input Validation

1. **Schema Validation**:
   - Use Zod for all input validation
   - Type-safe parsing
   - Reject unknown fields
   - Sanitize user input

2. **File Upload Validation**:
   - Whitelist file types: jpeg, png, pdf, doc
   - Maximum file size: 100 MB
   - Scan for malware (ClamAV)
   - Rename files (UUID-based)

### Rate Limiting

1. **Endpoints**:
   - Login: 10 requests/minute per IP
   - Password reset: 5 requests/minute per email
   - API: 100 requests/minute per authenticated user
   - File upload: 10 requests/minute per user

2. **Implementation**:
   - Use Redis + sliding window algorithm
   - Return `Retry-After` header
   - Log rate limit violations

### CORS Policy

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3001',      // Development
    'https://sentinel-one.local'  // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-RateLimit-Remaining'],
  maxAge: 86400
};
```

### Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; img-src 'self' data: https:;
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), microphone=(), camera=()
```

## Audit Logging

### Events to Log

1. **Authentication**:
   - Login success/failure
   - Password change
   - Token refresh
   - Logout
   - Session invalidation

2. **Authorization**:
   - Permission denied
   - Role assignment
   - Access to sensitive data

3. **Data Changes**:
   - Create, update, delete operations
   - Field-level changes
   - User who made change
   - Before/after values

4. **System**:
   - API errors
   - Database connection failures
   - File uploads/downloads
   - Admin actions

### Log Format

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "INFO",
  "service": "api",
  "event": "incident_created",
  "user_id": "uuid",
  "organization_id": "uuid",
  "resource_id": "uuid",
  "resource_type": "incident",
  "action": "create",
  "changes": { "category": "FIRE", "urgency": "CRITICAL" },
  "ip_address": "203.0.113.42",
  "user_agent": "Mozilla/5.0...",
  "status": "success",
  "duration_ms": 145
}
```

## Secrets Management

### Environment Variables

1. **Never commit secrets** to Git
2. Use `.env.example` for documentation
3. Rotate secrets quarterly
4. Audit secret access

### Production Secrets

- JWT signing key
- Database password
- Redis password
- MinIO credentials
- API keys (payment, SMS, email)
- Encryption master key

### Secret Storage

- **Development**: `.env.local` (Git-ignored)
- **Staging**: GitHub Secrets or HashiCorp Vault
- **Production**: HashiCorp Vault with Kubernetes integration

## Dependency Security

1. **Dependency Scanning**:
   - Run `npm audit` in CI
   - Automated dependency updates
   - Regular security audits

2. **Vulnerable Dependency Policy**:
   - Critical: Fix within 24 hours
   - High: Fix within 1 week
   - Medium: Fix within 30 days
   - Low: Fix within 90 days

## Incident Response

1. **Detection**:
   - Monitor logs for suspicious activity
   - Alert on rate limit violations
   - Alert on failed authentications
   - Alert on permission denials

2. **Response**:
   - Lock suspicious accounts
   - Invalidate sessions
   - Escalate to security team
   - Generate incident report

## Testing

1. **Security Tests**:
   - Authentication tests
   - Authorization tests
   - Input validation tests
   - Rate limiting tests

2. **Manual Testing**:
   - Penetration testing (quarterly)
   - Code review (per PR)
   - Dependency audit (weekly)

## Compliance

- GDPR compliance (data privacy)
- CCPA compliance (California)
- SOC 2 Type II certification (future)
