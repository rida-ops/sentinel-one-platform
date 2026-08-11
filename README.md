# Sentinel One Platform

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Setup

```bash
# 1. Clone and setup
git clone https://github.com/rida-ops/sentinel-one-platform.git
cd sentinel-one-platform
git checkout m2/platform-core

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local

# 4. Start infrastructure
pnpm run docker:up

# 5. Setup database
pnpm run db:setup
pnpm run db:seed

# 6. Start development
pnpm run dev
```

### Access Points

- **Web UI**: http://localhost:3001
- **API**: http://localhost:3000/api
- **MinIO**: http://localhost:9001 (admin / minioadmin_change_in_prod)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Default Credentials (Development Only)

```
Email: admin@sentinel-one.local
Password: Change@Me123456
```

## Project Structure

See `docs/architecture.md` for detailed architecture overview.

## Milestones

- **M1**: Blink baseline (frozen)
- **M2**: Platform core (current) ✅
  - Monorepo structure
  - Database schema
  - Auth & RBAC
  - API endpoints
  - WebSocket gateway
- **M3**: Incident engine
- **M4**: Dispatch center
- **M5**: Real-time updates
- **M6**: Map system
- **M7**: File system
- **M8**: AI center
- **M9**: Administration
- **M10**: Mobile
- **M11**: Security hardening
- **M12**: Production deployment

## Development

### Running Tests

```bash
pnpm run test
pnpm run test:watch
pnpm run test:cov
```

### Code Quality

```bash
pnpm run lint
pnpm run format
```

### Database Migrations

```bash
# Create migration
cd packages/database && pnpm run migration:create -- --name your_migration_name

# Apply migrations
pnpm run db:setup

# Reset database (destructive)
pnpm run db:reset
```

## Documentation

- `docs/architecture.md` - System architecture
- `docs/api.md` - API reference
- `docs/security.md` - Security guidelines
- `docs/operations.md` - Operational runbook

## Support

For issues and questions, please open a GitHub issue.
