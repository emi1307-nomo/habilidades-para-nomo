---
name: postgres-best-practices
description: PostgreSQL performance optimization for production apps — query performance, indexing, connection management, Row Level Security, schema design, concurrency, monitoring. From Supabase (75K installs). Use when designing schemas, writing queries, or troubleshooting DB performance in NOMO or any PostgreSQL app.
argument-hint: "[query, schema, or performance issue]"
metadata:
  source: supabase/agent-skills
  installs: 75300
  version: "1.0.0"
---

# PostgreSQL Best Practices

Performance optimization guide for PostgreSQL in production. 8 categories prioritized by impact.

## CRITICAL: Query Performance

```sql
-- ❌ SELECT * — fetches unnecessary columns
SELECT * FROM orders WHERE restaurant_id = $1;

-- ✅ SELECT only needed columns
SELECT id, table_id, status, total, created_at
FROM orders
WHERE restaurant_id = $1
ORDER BY created_at DESC
LIMIT 20;

-- ❌ N+1 — separate query per order
-- For each order: SELECT * FROM order_items WHERE order_id = ?

-- ✅ JOIN — single query
SELECT o.id, o.status, oi.menu_item_id, oi.quantity
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.restaurant_id = $1 AND o.status = 'pending';

-- ✅ EXPLAIN ANALYZE — always check query plan
EXPLAIN ANALYZE
SELECT * FROM orders WHERE restaurant_id = $1 AND date = $2;
```

## CRITICAL: Indexing

```sql
-- Index for most common query patterns
-- (restaurant_id is almost always in the WHERE clause for NOMO)

-- Single column index
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);

-- Composite index — order matters (most selective first)
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);
CREATE INDEX idx_orders_restaurant_date ON orders(restaurant_id, created_at DESC);

-- Partial index — only index active records
CREATE INDEX idx_orders_pending ON orders(restaurant_id, created_at)
WHERE status IN ('pending', 'preparing');

-- Unique index — enforces business rules
CREATE UNIQUE INDEX idx_tables_restaurant_number
ON tables(restaurant_id, table_number);

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC; -- Low scan = possibly unused index
```

## CRITICAL: Connection Management (with Prisma)

```ts
// prisma/client.ts — singleton pattern (critical for Next.js)
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// ✅ Connection pool config in DATABASE_URL
// postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=10
```

```yaml
# docker-compose.yml — PgBouncer for connection pooling at scale
pgbouncer:
  image: pgbouncer/pgbouncer
  environment:
    DATABASES_HOST: postgres
    DATABASES_PORT: 5432
    POOL_MODE: transaction      # best for serverless/Next.js
    MAX_CLIENT_CONN: 100
    DEFAULT_POOL_SIZE: 20
```

## Schema Design

```sql
-- ✅ Use appropriate types
CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id    UUID REFERENCES tables(id),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','preparing','ready','delivered','cancelled')),
  total       NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ✅ Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ✅ Enum type for status (more efficient than CHECK)
CREATE TYPE order_status AS ENUM ('pending','preparing','ready','delivered','cancelled');
ALTER TABLE orders ALTER COLUMN status TYPE order_status USING status::order_status;
```

## Row Level Security (RLS) — Multi-tenant isolation

```sql
-- Enable RLS on all tenant tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Policy: tenants can only see their own data
CREATE POLICY tenant_isolation ON orders
  USING (restaurant_id = current_setting('app.current_restaurant_id')::uuid);

CREATE POLICY tenant_isolation ON menu_items
  USING (restaurant_id = current_setting('app.current_restaurant_id')::uuid);

-- Set context per request (in Prisma middleware or connection)
-- SET app.current_restaurant_id = 'uuid-here';
```

## Concurrency — Safe Updates

```sql
-- ❌ Race condition — two requests read same stock, both decrement
SELECT stock FROM menu_items WHERE id = $1;
-- ... check stock > 0 ...
UPDATE menu_items SET stock = stock - 1 WHERE id = $1;

-- ✅ Atomic update with conditional check
UPDATE menu_items
SET stock = stock - 1
WHERE id = $1 AND stock > 0
RETURNING stock; -- returns NULL if stock was 0

-- ✅ Advisory locks for critical sections
SELECT pg_advisory_xact_lock(hashtext('order-' || $1));
-- ... safe to proceed ...
```

## Useful Monitoring Queries

```sql
-- Slow queries (requires pg_stat_statements extension)
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Table sizes
SELECT tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as total_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- Missing indexes (sequential scans on large tables)
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > 100
ORDER BY seq_tup_read DESC;

-- Active connections
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
```

## Prisma-Specific Patterns

```ts
// ✅ Select only needed fields
const orders = await prisma.order.findMany({
  where: { restaurantId },
  select: {
    id: true,
    status: true,
    total: true,
    table: { select: { number: true } }, // nested select
    items: { select: { menuItem: { select: { name: true } }, quantity: true } }
  }
})

// ✅ Transaction for multi-table writes
const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData })
  await tx.orderItem.createMany({ data: items.map(i => ({ ...i, orderId: order.id })) })
  await tx.table.update({ where: { id: tableId }, data: { status: "occupied" } })
  return order
})

// ✅ Batch operations
await prisma.menuItem.updateMany({
  where: { restaurantId, category: "drink" },
  data: { available: false }
})
```
