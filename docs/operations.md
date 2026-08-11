# SENTINEL ONE — Operations Runbook

## M2 Local Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- Git

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/rida-ops/sentinel-one-platform.git
cd sentinel-one-platform

# 2. Checkout M2 branch
git checkout m2/platform-core

# 3. Install dependencies
pnpm install

# 4. Start infrastructure (PostgreSQL, Redis, MinIO)
pnpm run docker:up

# 5. Setup database
pnpm run db:setup

# 6. Seed initial data
pnpm run db:seed

# 7. Start development servers
pnpm run dev
```

### Services

- **Web**: http://localhost:3001
- **API**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/api/docs
- **MinIO**: http://localhost:9001 (admin:admin_change_in_prod)
- **PostgreSQL**: localhost:5432 (sentinel:dev_password_change_in_prod)
- **Redis**: localhost:6379

### Database Operations

```bash
# Create migration
cd packages/database && pnpm run migration:create -- --name add_incident_table

# Run migrations
pnpm run db:setup

# Rollback last migration
cd packages/database && pnpm run migration:rollback

# Generate Prisma types
cd packages/database && pnpm run generate

# Seed database
pnpm run db:seed

# Reset database (WARNING: destructive)
pnpm run db:reset
```

### Running Tests

```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:coverage
```

### Code Quality

```bash
# Lint all packages
pnpm run lint

# Fix linting issues
pnpm run lint -- --fix

# Format code
pnpm run format
```

## Monitoring

### Logs

```bash
# View all infrastructure logs
pnpm run infra:logs

# Follow API logs
pnpm run infra:logs -- api
```

### Health Checks

```bash
# Check PostgreSQL
docker exec sentinel-postgres pg_isready -U sentinel -d sentinel_one

# Check Redis
docker exec sentinel-redis redis-cli ping

# Check MinIO
curl http://localhost:9000/minio/health/live
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check PostgreSQL container
docker ps | grep postgres

# View logs
docker logs sentinel-postgres

# Restart
pnpm run docker:down && pnpm run docker:up
```

### Migration Conflicts

```bash
# Reset database
pnpm run db:reset

# Reapply migrations
pnpm run db:setup
```

## Deployment

### Staging Deployment

```bash
# Build
pnpm run build

# Push to staging
git push origin m2/platform-core

# Staging GitHub Actions will handle deployment
```

### Production Deployment (M12)

```bash
# Merge to main
git checkout main
git merge m2/platform-core

# Tag release
git tag -a v0.1.0 -m "Platform Core Release"
git push origin main --tags

# Production pipeline triggered
```

## Backup & Recovery

### Database Backup

```bash
# Full dump
docker exec sentinel-postgres pg_dump -U sentinel sentinel_one > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i sentinel-postgres psql -U sentinel sentinel_one < backup_20240101.sql
```

### MinIO Backup

```bash
# Sync to local directory
minio-cli mirror minio/sentinel-bucket ./backup/
```
