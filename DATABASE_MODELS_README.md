# Fin-Folio Database Models Documentation

This document provides a comprehensive overview of the database models and their relationships in the Fin-Folio application.

## Table of Contents

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

## Overview

The Fin-Folio application uses TypeORM with PostgreSQL to manage financial data. All entities extend a base `ValidationEntity` class that provides automatic validation on insert and update operations.

## Base Entity

### ValidationEntity

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

## Core Models

### User

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

### Category

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

### Transaction

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

### Investment

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

### Budget

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

### BudgetItem

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

## Enums

### CategoryType

```typescript
export enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  SAVINGS = "SAVINGS",
  DEBT = "DEBT",
  INVESTMENT = "INVESTMENT",
}
```

### CategoryOrigin

```typescript
export enum CategoryOrigin {
  SYSTEM = "SYSTEM",
  USER = "USER",
}
```

### TransactionType

```typescript
export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  SAVINGS = "SAVINGS",
  DEBT = "DEBT",
  INVESTMENT = "INVESTMENT",
}
```

### InstrumentType

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

## Entity Relationships

### Primary Relationships

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

### Relationship Flow

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

## Database Schema Diagram

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

## Key Design Patterns

1. **Dual Primary Keys**: All entities use both an auto-incrementing integer ID and a UUID publicId for internal and external references.

2. **Validation**: All entities extend ValidationEntity for automatic validation using class-validator decorators.

3. **Soft Relationships**: Transactions can optionally link to BudgetItems for budget tracking while maintaining direct category relationships.

4. **Enum Consistency**: CategoryType and TransactionType use the same enum values for consistency.

5. **Financial Precision**: All monetary amounts use double precision with 2 decimal places validation.

6. **User Isolation**: All financial data is scoped to individual users through foreign key relationships.

## Usage Notes

- When creating transactions, if a budgetItem is provided, the category is automatically derived from the budgetItem's category
- Categories can be either system-generated (SYSTEM) or user-created (USER)
- All entities support soft validation on updates (skipMissingProperties: true)
- Password hashing is handled automatically on insert/update operations
- Unique constraints ensure data integrity across publicId fields
