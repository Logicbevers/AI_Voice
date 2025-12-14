# Important: Database Configuration

## Current Setup

**Local Development**: SQLite (`file:./dev.db`)
**Production (Vercel)**: PostgreSQL (Vercel Postgres)

## Why Two Different Databases?

SQLite works great for local development but is not supported on Vercel's serverless environment.

## How It Works

1. **Locally**: Prisma schema uses `provider = "sqlite"`
2. **On Vercel**: You'll override the schema during deployment

## Vercel Deployment Strategy

When deploying to Vercel with PostgreSQL:

### Option A: Use Environment Variable Override (Recommended)

Prisma supports provider override via environment variable:

1. Keep schema as `provider = "sqlite"` for local dev
2. On Vercel, add this environment variable:
   ```
   DATABASE_PROVIDER=postgresql
   ```

### Option B: Separate Schema Files

Create two schema files:
- `schema.prisma` (SQLite for local)
- `schema.production.prisma` (PostgreSQL for Vercel)

### Option C: Use Git Branches

- `main` branch: SQLite schema
- `production` branch: PostgreSQL schema
- Deploy `production` branch to Vercel

## Current Recommendation

**For now**: Keep SQLite locally, use PostgreSQL on Vercel by:

1. Local `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. Vercel environment variables:
   ```env
   DATABASE_URL="${POSTGRES_PRISMA_URL}"
   ```

3. Before deploying, temporarily change schema to PostgreSQL:
   ```bash
   # Change provider to "postgresql"
   git add prisma/schema.prisma
   git commit -m "chore: use PostgreSQL for production"
   git push
   ```

4. After deployment, revert locally:
   ```bash
   # Change provider back to "sqlite"
   # Don't commit this change
   npx prisma generate
   ```

## Better Solution: Multi-Provider Support

Add to `prisma/schema.prisma`:
```prisma
datasource db {
  provider = env("DATABASE_PROVIDER")  // Defaults to sqlite
  url      = env("DATABASE_URL")
}
```

Then:
- Local `.env`: `DATABASE_PROVIDER=sqlite`
- Vercel: `DATABASE_PROVIDER=postgresql`
