# Database Setup - Quick Start Guide

## Option 1: SQLite (Fastest - For Testing)

### Step 1: Update Prisma Schema
No changes needed! Already configured for SQLite.

### Step 2: Set Environment Variables
Create `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 3: Run Setup Commands
```bash
# Install dependencies (if not done)
npm install

# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed demo data
npx prisma db seed
```

### Step 4: Test the App
```bash
npm run dev
```

Login with:
- Email: `demo@example.com`
- Password: `demo123`

---

## Option 2: PostgreSQL (Production Ready)

### Step 1: Get Database URL

**Using Supabase (Recommended):**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy connection string (Direct connection)
5. Replace `[YOUR-PASSWORD]` with your password

**Using Neon:**
1. Go to https://neon.tech
2. Create new project
3. Copy connection string

### Step 2: Update Prisma Schema
Change datasource in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Set Environment Variables
Update `.env`:
```env
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### Step 4: Run Setup Commands
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed
```

### Step 5: Test the App
```bash
npm run dev
```

---

## Verification

### Check Database with Prisma Studio
```bash
npx prisma studio
```

Opens at http://localhost:5555

### Test Features
1. ✅ Signup/Login
2. ✅ Create workspace
3. ✅ Create video project
4. ✅ Generate video
5. ✅ View videos library
6. ✅ Browse templates
7. ✅ Manage assets

---

## Troubleshooting

### Error: "Can't reach database"
- Check DATABASE_URL is correct
- Ensure database service is running
- Try connection string without special characters

### Error: "Table doesn't exist"
- Run: `npx prisma db push` (SQLite)
- Or: `npx prisma migrate dev` (PostgreSQL)

### Error: "Prisma Client not generated"
- Run: `npx prisma generate`

---

## Next Steps

After database is set up:
1. Test all features
2. Deploy to production (Vercel)
3. Set up monitoring
4. Add real video generation API
