# Fin-Folio

A monorepo for personal finance tracker

# PostgreSQL & PGAdmin Setup Guide

## Table of Contents

- [Overview](#overview)
- [Port Configuration](#port-configuration)
- [Docker Commands](#docker-commands)
- [Connecting with PGAdmin Desktop](#connecting-with-pgadmin-desktop)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Common Issues](#common-issues)
- [Useful PostgreSQL Commands](#useful-postgresql-commands)

---

## Overview

This project uses:

- **Docker Postgres** on port `5433` (host) → `5432` (container)
- **Homebrew Postgres** on port `5432` (if installed separately)
- **PGAdmin Desktop** to manage the database

### Why Different Ports?

Docker Postgres uses port 5433 on the host to avoid conflicts with Homebrew Postgres (which uses 5432). Inside Docker's network, Postgres still runs on the standard port 5432.

---

## Port Configuration

### Environment Variables (`.env`)

```env
# Docker Postgres - Host machine port mapping
DOCKER_PG_HOST_PORT=5433  # Port to access from host machine
PG_PORT=5432              # Port inside Docker container
PG_USER=proxima
PG_PASSWORD=your_password
PG_DB=nebula

# Application Ports
BE_SERVICE_PORT=8000
WEB_CLIENT_PORT=5173
```

### Port Usage Summary

| Service           | Host Port | Container Port | Access From                       |
| ----------------- | --------- | -------------- | --------------------------------- |
| Docker Postgres   | 5433      | 5432           | Host machine (PGAdmin Desktop)    |
| Docker Postgres   | -         | 5432           | Other Docker containers (backend) |
| Homebrew Postgres | 5432      | -              | Host machine                      |

---

## Docker Commands

### Start Services

```bash
# Start all services
docker compose up -d

# Start specific service
docker compose up -d database

# View logs
docker compose logs -f database
```

### Docker cleanup commands

```zsh

docker compose down -v --remove-orphans

docker system prune -af

```

This command stops and removes resources defined in your docker-compose.yml:

- docker compose down - Stops and removes containers and networks
- -v or --volumes - ⚠️ Also removes named volumes (deletes your database data!)
- --remove-orphans - Removes containers for services not defined in the current compose file

This is a nuclear option that cleans up almost everything Docker-related:

- docker system prune - Removes unused Docker objects
- a or --all - Removes ALL unused images (not just dangling ones)
- f or --force - Skip confirmation prompt

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

### Check Running Containers

```bash
# List all running containers
docker ps

# Filter for specific container
docker ps | grep fin-folio-database

# Check port mappings
docker port fin-folio-database
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart database
```

---

## Connecting with PGAdmin Desktop

### Connection Settings

**General Tab:**

- **Name:** `fin-folio-local` (or any descriptive name)

**Connection Tab:**

- **Host:** `localhost` or `127.0.0.1`
- **Port:** `5433` (use `DOCKER_PG_HOST_PORT` value)
- **Maintenance database:** `nebula` (use `PG_DB` value)
- **Username:** `proxima` (use `PG_USER` value)
- **Password:** Your `PG_PASSWORD` value
- **Save password:** ✓ (recommended)

### Navigate to Tables

```
Servers
└── fin-folio-local
    └── Databases
        └── nebula
            └── Schemas
                └── public
                    └── Tables
```

### Refreshing the View

1. Right-click on `Tables` → `Refresh`
2. Or disconnect/reconnect the server

---

## Debugging & Troubleshooting

### 1. Verify Docker Postgres is Running

```bash
# Check container status
docker ps | grep fin-folio-database

# Should show something like:
# fin-folio-database ... Up ... 0.0.0.0:5433->5432/tcp
```

### 2. Check Which Postgres You're Connected To

Run this in PGAdmin Query Tool:

```sql
SELECT version();
```

**Expected Result (Docker):**

```
PostgreSQL 17.6 on x86_64-pc-linux-musl, compiled by gcc (Alpine 14.2.0) 14.2.0, 64-bit
```

**Wrong Result (Homebrew):**

```
PostgreSQL 17.6 (Homebrew) on x86_64-apple-darwin...
```

If you see "Homebrew", you're connected to the wrong Postgres!

### 3. Test Connection from Command Line

```bash
# Connect to Docker Postgres
docker exec -it fin-folio-database psql -U proxima -d nebula

# Inside psql:
\dt          # List tables
\dn          # List schemas
\du          # List users
\l           # List databases
\q           # Quit
```

### 4. Check Port Availability

```bash
# Check what's running on each port
lsof -i :5432  # Should show Homebrew Postgres (if running)
lsof -i :5433  # Should show Docker Postgres

# Alternative: using netstat
netstat -an | grep LISTEN | grep 543
```

### 5. Verify Database Connection Details

Run in PGAdmin Query Tool:

```sql
-- Check current database and user
SELECT current_database(), current_user, session_user;

-- Should return: nebula, proxima, proxima
```

### 6. List All Tables

```sql
-- List tables in public schema
SELECT tablename, tableowner
FROM pg_tables
WHERE schemaname = 'public';

-- List all tables with schema info
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
```

### 7. Check Schema Permissions

```sql
-- Check schema owner
SELECT nspname, nspowner::regrole
FROM pg_namespace
WHERE nspname = 'public';

-- Check user privileges
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public';
```

---

## Common Issues

### Issue 1: Tables Not Showing in PGAdmin Desktop

**Symptoms:** Query shows tables, but sidebar doesn't display them.

**Solution:**

1. Verify you're connected to Docker Postgres (not Homebrew)
2. Check you're looking at the correct database (`nebula`, not `postgres`)
3. Right-click `Tables` → `Refresh`
4. Disconnect and reconnect the server

### Issue 2: Connected to Wrong Postgres

**Symptoms:** `SELECT version()` shows "Homebrew" or different version.

**Solution:**

```bash
# Option 1: Stop Homebrew Postgres
brew services stop postgresql@17

# Option 2: Verify PGAdmin connection uses port 5433
# Edit server properties → Connection → Port: 5433
```

### Issue 3: Port Already in Use

**Symptoms:** `docker compose up` fails with port binding error.

**Solution:**

```bash
# Check what's using the port
lsof -i :5433

# Change port in docker-compose.yml or stop conflicting service
```

### Issue 4: Permission Denied Errors

**Symptoms:** Can't access tables or schemas.

**Solution:**

```bash
# Connect to database
docker exec -it fin-folio-database psql -U proxima -d nebula

# Grant permissions
GRANT ALL ON SCHEMA public TO proxima;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO proxima;
ALTER SCHEMA public OWNER TO proxima;
```

### Issue 5: Database Doesn't Exist

**Symptoms:** Can't connect to `nebula` database.

**Solution:**

```bash
# Connect to postgres database first
docker exec -it fin-folio-database psql -U proxima -d postgres

# Create database
CREATE DATABASE nebula;
\q
```

---

## Useful PostgreSQL Commands

### Database Management

```sql
-- List all databases
\l

-- Connect to different database
\c database_name

-- Create database
CREATE DATABASE new_database;

-- Drop database
DROP DATABASE database_name;
```

### Table Operations

```sql
-- List tables
\dt

-- Describe table structure
\d table_name

-- Show table with column details
\d+ table_name

-- Count rows in table
SELECT COUNT(*) FROM table_name;
```

### User & Permission Management

```sql
-- List users
\du

-- Create user
CREATE USER username WITH PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE database_name TO username;
GRANT ALL ON SCHEMA public TO username;

-- Change password
ALTER USER username WITH PASSWORD 'new_password';
```

### Schema Operations

```sql
-- List schemas
\dn

-- Set search path
SET search_path TO schema_name;

-- Create schema
CREATE SCHEMA schema_name;
```

### Query Information

```sql
-- Show current connection info
SELECT current_database(), current_user, inet_server_addr(), inet_server_port();

-- Show all running queries
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity
WHERE state = 'active';

-- Show database size
SELECT pg_size_pretty(pg_database_size('nebula'));

-- Show table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Managing Homebrew Postgres

### Service Control

```bash
# Stop Homebrew Postgres
brew services stop postgresql@17

# Start Homebrew Postgres
brew services start postgresql@17

# Restart Homebrew Postgres
brew services restart postgresql@17

# Check status
brew services list | grep postgres

# Check if running
ps aux | grep postgres
```

### Connect to Homebrew Postgres

```bash
# Connect using psql
psql -U your_username -d postgres

# Or specify host and port explicitly
psql -h localhost -p 5432 -U your_username -d database_name
```

---

## Quick Reference Cheat Sheet

### Docker Postgres Access

```bash
# From host machine (PGAdmin Desktop)
Host: localhost
Port: 5433

# From other Docker containers (backend)
Host: database
Port: 5432

# Command line access
docker exec -it fin-folio-database psql -U proxima -d nebula
```

### Verification Commands

```bash
# Check Docker Postgres is running
docker ps | grep fin-folio-database

# Check port mappings
docker port fin-folio-database

# View logs
docker compose logs -f database

# Test connection
docker exec -it fin-folio-database psql -U proxima -d nebula -c "SELECT version();"
```

### PGAdmin Desktop Quick Actions

1. **Refresh tables:** Right-click `Tables` → Refresh
2. **Run query:** Right-click database → Query Tool
3. **Reconnect:** Right-click server → Disconnect → Connect
4. **View properties:** Right-click server → Properties

---

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PGAdmin Documentation](https://www.pgadmin.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Homebrew PostgreSQL Guide](https://formulae.brew.sh/formula/postgresql@17)

---

## Notes

- Always use port **5433** when connecting from host machine (PGAdmin Desktop)
- Backend service uses port **5432** (internal Docker network)
- Keep `.env` file secure and never commit it to version control
- Regular backups recommended for production databases

---

## Docker Dev vs Prod Guide (Node.js Monorepo)

### Local Development

- Goal: fast feedback when adding new packages.
- Do not mount an anonymous volume over `/usr/app/node_modules`.
- Start services with install-on-start to pick up new deps from the lockfile:

```bash
docker compose down -v
docker compose up --build
```

- Updated compose commands (dev):
  - Backend: `sh -c "pnpm install --frozen-lockfile && pnpm run dev"`
  - Web: `sh -c "pnpm install --frozen-lockfile && pnpm run dev -- --host"`

Why: previously an anonymous volume at `/usr/app/node_modules` masked the image's installed dependencies, causing "Cannot find module ..." after adding packages. Removing that mount and installing on container start fixes it while keeping determinism via the lockfile.

### CI/Staging/Production

- Goal: immutable, reproducible images.
- Install dependencies at build time in the Dockerfile; do not run `pnpm install` at container start.
- Do not mount source or `node_modules` in containers.
- Run the built app only (e.g. `CMD ["node", "dist/server.js"]` or `pnpm start`).

On dependency changes, rebuild images and replace containers:

```bash
docker compose up --build -V
```

Notes:

- `--build` ensures images are rebuilt from the Dockerfile (deps baked in).
- `-V` removes old anonymous volumes so stale `node_modules` cannot mask image contents.
- Keep dev and prod behaviors in separate compose files (e.g., `docker-compose.yml` + `docker-compose.dev.yml` override).

### Quick Decision

- Development: use install-on-start in compose for faster iteration.
- Production/CI: use image-only installs; rebuild with `--build -V` when deps change.
