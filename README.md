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
- [Database Models Documentation](#database-models-documentation)
  - [Overview](#overview)
  - [Base Entity](#base-entity)
  - [Core Models](#core-models)
    - [User](#user)
    - [Category](#category)
    - [Transaction](#transaction)
    - [Investment](#investment)
    - [Budget](#budget)
    - [BudgetItem](#budgetitem)
  - [Enums](#enums)
  - [Entity Relationships](#entity-relationships)
  - [Database Schema Diagram](#database-schema-diagram)
- [Service Architecture & Transaction Handling](#service-architecture--transaction-handling)
  - [Overview](#overview-1)
  - [Singleton Services Pattern](#singleton-services-pattern)
  - [Transaction Logic](#transaction-logic)
  - [How It Works](#how-it-works)
  - [Visual Flow](#visual-flow)
  - [Code Pattern Explanation](#code-pattern-explanation)
  - [Benefits](#benefits)
  - [Usage Guidelines](#usage-guidelines)
  - [Summary](#summary)

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

## Database Models Documentation

This document provides a comprehensive overview of the database models and their relationships in the Fin-Folio application.

### Overview

The Fin-Folio application uses TypeORM with PostgreSQL to manage financial data. All entities extend a base `ValidationEntity` class that provides automatic validation on insert and update operations.

### Base Entity

#### ValidationEntity

All models extend this abstract base class that provides automatic validation:

```typescript
export abstract class ValidationEntity {
  @BeforeInsert()
  async validateOnInsert() {
    await validateOrReject(this);
  }

  @BeforeUpdate()
  async validateOnUpdate() {
    await validateOrReject(this, { skipMissingProperties: true });
  }
}
```

### Core Models

#### User

**Table:** `Users`

The central entity that represents application users.

**Fields:**

- `id` (number, Primary Key) - Auto-generated integer ID
- `publicId` (string, UUID, Primary Key) - Public-facing unique identifier
- `name` (varchar, required) - User's full name (1-100 characters)
- `email` (varchar, required, unique) - User's email address with validation
- `password` (varchar, optional) - Hashed password using bcrypt
- `avatarUrl` (varchar, optional) - URL to user's profile picture
- `country` (varchar, optional) - User's country
- `currency` (varchar, optional, default: 'USD') - User's preferred currency (3-character code)

**Relationships:**

- One-to-Many with `Category` (user.categories)
- One-to-Many with `Budget` (user.budgets)
- One-to-Many with `Transaction` (user.transactions)
- One-to-Many with `Investment` (user.investments)

**Special Features:**

- Password hashing with bcrypt on insert/update
- Email validation with regex pattern
- Password validation with regex pattern
- Unique constraints on email and publicId

#### Category

**Table:** `Categories`

Represents financial categories for organizing transactions and investments.

**Fields:**

- `id` (number, Primary Key) - Auto-generated integer ID
- `publicId` (string, UUID, Primary Key) - Public-facing unique identifier
- `type` (enum, required) - Category type (INCOME, EXPENSE, SAVINGS, DEBT, INVESTMENT)
- `title` (varchar, required) - Category name (1-50 characters)
- `accumulatedAmount` (double precision, optional) - Running total for this category
- `origin` (enum, default: USER) - Whether category is system-generated or user-created

**Relationships:**

- Many-to-One with `User` (category.user)
- One-to-Many with `BudgetItem` (category.budgetItems)
- One-to-Many with `Investment` (category.investments)
- One-to-Many with `Transaction` (category.transactions)

**Special Features:**

- Unique constraint on publicId
- Enum validation for type and origin

#### Transaction

**Table:** `Transactions`

Represents individual financial transactions (income, expenses, etc.).

**Fields:**

- `id` (number, Primary Key) - Auto-generated integer ID
- `publicId` (string, UUID, Primary Key) - Public-facing unique identifier
- `title` (varchar, optional) - Transaction description
- `amount` (double precision, required) - Transaction amount (2 decimal places)
- `type` (enum, required) - Transaction type (INCOME, EXPENSE, SAVINGS, DEBT, INVESTMENT)
- `date` (date, required) - Transaction date

**Relationships:**

- Many-to-One with `Category` (transaction.category)
- Many-to-One with `BudgetItem` (transaction.budgetItem, optional)
- Many-to-One with `User` (transaction.user)

**Special Features:**

- Unique constraint on publicId
- Optional budget item relationship for budget tracking
- Automatic category derivation from budget item if provided

#### Investment

**Table:** `Investments`

Represents investment holdings and their performance.

**Fields:**

- `id` (number, Primary Key) - Auto-generated integer ID
- `publicId` (string, UUID, Primary Key) - Public-facing unique identifier
- `investedAmount` (double precision, required) - Original investment amount (2 decimal places)
- `currentValue` (double precision, required) - Current market value (2 decimal places)
- `instrumentType` (enum, required) - Type of investment instrument
- `purchasedAt` (date, required) - Purchase date

**Relationships:**

- Many-to-One with `User` (investment.user)
- Many-to-One with `Category` (investment.category)

**Special Features:**

- Unique constraint on publicId
- Enum validation for instrument type
- Decimal precision for financial amounts

#### Budget

**Table:** `Budgets`

Represents monthly budget plans.

**Fields:**

- `id` (number, Primary Key) - Auto-generated integer ID
- `publicId` (string, UUID, Primary Key) - Public-facing unique identifier
- `month` (date, required) - Budget month
- `totalPlanned` (numeric, optional) - Total planned budget amount

**Relationships:**

- Many-to-One with `User` (budget.user)
- One-to-Many with `BudgetItem` (budget.items)

**Special Features:**

- Unique constraint on publicId
- Date validation for month field

#### BudgetItem

**Table:** `BudgetItems`

Represents individual category allocations within a budget.

**Fields:**

- `id` (number, Primary Key) - Auto-generated integer ID
- `publicId` (string, UUID, Primary Key) - Public-facing unique identifier
- `plannedAmount` (double precision, required) - Planned budget amount (2 decimal places)
- `actualAmount` (double precision, optional) - Actual spent amount (2 decimal places)

**Relationships:**

- Many-to-One with `Budget` (budgetItem.budget)
- Many-to-One with `Category` (budgetItem.category)
- One-to-Many with `Transaction` (budgetItem.transactions)

**Special Features:**

- Unique constraint on publicId
- Decimal precision for financial amounts
- Links transactions to budget tracking

### Enums

#### CategoryType

```typescript
export enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  SAVINGS = "SAVINGS",
  DEBT = "DEBT",
  INVESTMENT = "INVESTMENT",
}
```

#### CategoryOrigin

```typescript
export enum CategoryOrigin {
  SYSTEM = "SYSTEM",
  USER = "USER",
}
```

#### TransactionType

```typescript
export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  SAVINGS = "SAVINGS",
  DEBT = "DEBT",
  INVESTMENT = "INVESTMENT",
}
```

#### InstrumentType

```typescript
export enum InstrumentType {
  STOCK = "STOCK",
  MUTUAL_FUND = "MUTUAL_FUND",
  ETF = "ETF",
  BOND = "BOND",
  CRYPTO = "CRYPTO",
  REAL_ESTATE = "REAL_ESTATE",
  OTHER = "OTHER",
}
```

Each instrument type includes metadata about risk level, liquidity, expected returns, and tax implications.

### Entity Relationships

#### Primary Relationships

1. **User** is the central entity with one-to-many relationships to:

   - Categories
   - Budgets
   - Transactions
   - Investments

2. **Category** connects to:

   - User (many-to-one)
   - BudgetItems (one-to-many)
   - Investments (one-to-many)
   - Transactions (one-to-many)

3. **Budget** contains:

   - User (many-to-one)
   - BudgetItems (one-to-many)

4. **BudgetItem** links:

   - Budget (many-to-one)
   - Category (many-to-one)
   - Transactions (one-to-many)

5. **Transaction** references:

   - User (many-to-one)
   - Category (many-to-one)
   - BudgetItem (many-to-one, optional)

6. **Investment** references:
   - User (many-to-one)
   - Category (many-to-one)

#### Relationship Flow

```
User
├── Categories (1:N)
│   ├── BudgetItems (1:N)
│   │   └── Transactions (1:N)
│   ├── Investments (1:N)
│   └── Transactions (1:N)
├── Budgets (1:N)
│   └── BudgetItems (1:N)
├── Transactions (1:N)
└── Investments (1:N)
```

### Database Schema Diagram

```
┌─────────────────┐
│      Users      │
├─────────────────┤
│ id (PK)         │
│ publicId (PK)   │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ avatarUrl       │
│ country         │
│ currency        │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    Categories   │
├─────────────────┤
│ id (PK)         │
│ publicId (PK)   │
│ type            │
│ title           │
│ accumulatedAmount│
│ origin          │
│ userId (FK)     │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│   BudgetItems   │
├─────────────────┤
│ id (PK)         │
│ publicId (PK)   │
│ plannedAmount   │
│ actualAmount    │
│ budgetId (FK)   │
│ categoryId (FK) │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│  Transactions   │
├─────────────────┤
│ id (PK)         │
│ publicId (PK)   │
│ title           │
│ amount          │
│ type            │
│ date            │
│ categoryId (FK) │
│ budgetItemId (FK)│
│ userId (FK)     │
└─────────────────┘

┌─────────────────┐
│     Budgets     │
├─────────────────┤
│ id (PK)         │
│ publicId (PK)   │
│ month           │
│ totalPlanned    │
│ userId (FK)     │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│   BudgetItems   │
└─────────────────┘

┌─────────────────┐
│   Investments   │
├─────────────────┤
│ id (PK)         │
│ publicId (PK)   │
│ investedAmount  │
│ currentValue    │
│ instrumentType  │
│ purchasedAt     │
│ userId (FK)     │
│ categoryId (FK) │
└─────────────────┘
```

### Key Design Patterns

1. **Dual Primary Keys**: All entities use both an auto-incrementing integer ID and a UUID publicId for internal and external references.

2. **Validation**: All entities extend ValidationEntity for automatic validation using class-validator decorators.

3. **Soft Relationships**: Transactions can optionally link to BudgetItems for budget tracking while maintaining direct category relationships.

4. **Enum Consistency**: CategoryType and TransactionType use the same enum values for consistency.

5. **Financial Precision**: All monetary amounts use double precision with 2 decimal places validation.

6. **User Isolation**: All financial data is scoped to individual users through foreign key relationships.

### Usage Notes

- When creating transactions, if a budgetItem is provided, the category is automatically derived from the budgetItem's category
- Categories can be either system-generated (SYSTEM) or user-created (USER)
- All entities support soft validation on updates (skipMissingProperties: true)
- Password hashing is handled automatically on insert/update operations
- Unique constraints ensure data integrity across publicId fields

---

## Service Architecture & Transaction Handling

### Overview

Services in this application use a **singleton pattern** with **flexible transaction management**. Services can either:

1. Create their own transactions (when used as singletons)
2. Participate in existing transactions (when created with an EntityManager)

### Singleton Services Pattern

Services are created once at module load and reused across all requests:

```typescript
// apps/fin-folio-server/src/services/index.ts
import { AppDataSource } from "@/data-source";
import { createAuthService } from "./auth.service";

export const authService = createAuthService(AppDataSource);
```

### Transaction Logic

All service methods that need database transactions use a **smart transaction pattern**:

```typescript
// Example from auth.service.ts
const registerUser = async (credentials, auth) => {
  const execute = async (manager: EntityManager) => {
    // Transaction logic here
    const txnUserRepo = new UserRepository(manager);
    // ... perform operations
  };

  return dataContext instanceof EntityManager
    ? execute(dataContext) // Use existing transaction
    : runTransaction({ label: "Register User" }, execute); // Create new transaction
};
```

### How It Works

**The service always executes within a transaction**, but it intelligently decides **which transaction** to use:

1. **If service was created with `EntityManager`** → Uses the **existing transaction** (from caller)
2. **If service was created with `DataSource`** → Creates a **new transaction** (in the service)

### Visual Flow

#### Scenario 1: Singleton Service (DataSource) - Creates Own Transaction

```
┌─────────────────────────────────────────────┐
│ Call: authService.registerUser()             │
│ ↓                                            │
│ Check: dataContext instanceof EntityManager? │
│ NO (it's DataSource)                         │
│ ↓                                            │
│ Create NEW transaction here                  │
│ ↓                                            │
│ Execute with new transaction                 │
└─────────────────────────────────────────────┘
```

**Example:**

```typescript
// Singleton service created with DataSource
export const authService = createAuthService(AppDataSource);

// When called, creates its own transaction
await authService.registerUser(credentials, req.appAuth!);
// → Creates NEW transaction internally
```

#### Scenario 2: Transaction-Scoped Service (EntityManager) - Uses Existing Transaction

```
┌─────────────────────────────────────────────┐
│ Caller starts transaction:                  │
│ runTransaction(async (manager) => {         │
│   const authService = createAuthService(manager) │
│   ↓                                         │
│   Call: authService.registerUser()         │
│   ↓                                         │
│   Check: dataContext instanceof EntityManager? │
│   YES! ✅                                    │
│   ↓                                         │
│   Use EXISTING transaction (manager)       │
│   ↓                                         │
│   Execute with caller's transaction         │
│ })                                          │
└─────────────────────────────────────────────┘
```

**Example:**

```typescript
// Service created inside an existing transaction
await runTransaction(
  { label: "Complex Operation" },
  async (manager: EntityManager) => {
    const authService = createAuthService(manager);

    // Uses the existing transaction from caller
    await authService.registerUser(credentials, req.appAuth!);
    // → Uses EXISTING transaction (manager)
  }
);
```

### Code Pattern Explanation

The key logic is in the conditional check:

```typescript
return dataContext instanceof EntityManager
  ? execute(dataContext) // Use existing transaction
  : runTransaction({ label: "..." }, execute); // Create new transaction
```

**TypeScript Type Narrowing:**

- Using `dataContext instanceof EntityManager` directly in the conditional enables TypeScript to properly narrow the type
- In the `true` branch, TypeScript knows `dataContext` is `EntityManager`
- In the `false` branch, TypeScript knows it's `DataSource`

### Benefits

1. **Always Transactional**: Operations always run in transactions for data consistency
2. **Flexible**: Services can work standalone or participate in larger transactions
3. **Type-Safe**: TypeScript properly narrows types based on the check
4. **Testable**: Easy to inject different contexts for testing

### Usage Guidelines

#### Use Singleton Services For:

- Normal operations (read/write that don't need nested transactions)
- Simple CRUD operations
- Operations that need their own atomic transaction

**Example:**

```typescript
import { authService } from "@/services";

app.post("/auth/register", async (req, res) => {
  // Service creates its own transaction internally
  const result = await authService.registerUser(req.body, req.appAuth!);
  res.json(result);
});
```

#### Use Transaction-Scoped Services For:

- Complex operations requiring multiple services in one transaction
- Ensuring atomic operations across multiple service calls
- Operations that must all succeed or all fail together

**Example:**

```typescript
import { runTransaction } from "@/utils";
import { createAuthService } from "@/services/auth.service";
import { createUserService } from "@/services/user.service";

app.post("/auth/register-with-profile", async (req, res) => {
  await runTransaction({ label: "Register with Profile" }, async (manager) => {
    // All operations use the same transaction
    const authService = createAuthService(manager);
    const userService = createUserService(manager);

    const { user, tokens } = await authService.registerUser(
      req.body,
      req.appAuth!
    );
    await userService.createProfile(user.id, req.body.profile);
    // If either fails, entire transaction rolls back
  });
});
```

### Summary

| Scenario               | Service Created With | Transaction Behavior                      |
| ---------------------- | -------------------- | ----------------------------------------- |
| **Singleton**          | `DataSource`         | Creates **new** transaction internally    |
| **Transaction-Scoped** | `EntityManager`      | Uses **existing** transaction from caller |

The pattern ensures:

- ✅ All operations are transactional
- ✅ Services can work standalone
- ✅ Services can participate in larger transactions
- ✅ Type-safe with proper TypeScript narrowing
