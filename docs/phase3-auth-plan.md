# Phase 3: Authentication & User Management - Implementation Plan

## Overview
Implement a complete authentication system using NextAuth.js with email/password authentication, session management, and protected routes.

## Architecture Decisions

### Authentication Provider: NextAuth.js
- Industry-standard solution for Next.js
- Built-in session management
- Easy OAuth integration
- Secure by default

### Database: Prisma + PostgreSQL
- Type-safe database access
- Easy migrations
- NextAuth adapter support

### Session Strategy: JWT
- Stateless authentication
- Better scalability
- No database queries for session validation

---

## Implementation Steps

### 1. Install Dependencies
```bash
npm install next-auth @next-auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

### 2. Prisma Schema
Create User, Account, Session, and VerificationToken models for NextAuth.

### 3. NextAuth Configuration
- Configure email/password provider
- Set up JWT strategy
- Add callbacks for session customization
- Configure pages (login, signup, error)

### 4. API Routes
- `/api/auth/[...nextauth]` - NextAuth handler
- `/api/auth/signup` - User registration
- `/api/user/profile` - Get/update user profile

### 5. Authentication Pages
- `/login` - Login form with email/password
- `/signup` - Registration form with validation
- `/profile` - User profile page (protected)

### 6. Protected Route Wrapper
- Middleware for route protection
- Redirect to login if unauthenticated
- Session provider wrapper

### 7. Auth Components
- LoginForm component
- SignupForm component
- UserMenu (already in TopBar)
- ProtectedRoute wrapper

---

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  workspaces    WorkspaceMember[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

---

## Security Considerations

1. **Password Hashing**: Use bcryptjs with salt rounds of 10
2. **CSRF Protection**: NextAuth handles this automatically
3. **Secure Cookies**: httpOnly, secure, sameSite settings
4. **Input Validation**: Zod schemas for all forms
5. **Rate Limiting**: Consider implementing for login/signup

---

## User Flow

### Registration Flow
1. User fills signup form
2. Validate email uniqueness
3. Hash password with bcryptjs
4. Create user in database
5. Auto-login after signup
6. Redirect to dashboard

### Login Flow
1. User enters credentials
2. Validate against database
3. Create session with JWT
4. Set secure cookie
5. Redirect to dashboard

### Protected Routes
1. Check session on page load
2. Redirect to /login if not authenticated
3. Allow access if valid session

---

## Files to Create

### Configuration
- `prisma/schema.prisma` - Database models
- `lib/auth.ts` - NextAuth configuration
- `lib/validations/auth.ts` - Zod schemas

### API Routes
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/signup/route.ts`

### Pages
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(app)/profile/page.tsx`

### Components
- `components/auth/LoginForm.tsx`
- `components/auth/SignupForm.tsx`
- `components/auth/ProtectedRoute.tsx`
- `components/providers/SessionProvider.tsx`

### Middleware
- `middleware.ts` - Route protection

---

## Testing Plan

1. **Registration**: Create new user account
2. **Login**: Sign in with credentials
3. **Session**: Verify session persistence
4. **Protected Routes**: Test redirect when not logged in
5. **Logout**: Clear session and redirect
6. **Profile**: Update user information
7. **Validation**: Test form validation errors

---

## Environment Variables

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_video_saas
```
