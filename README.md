# AI Video SaaS Platform

A modern AI-powered video creation platform that allows users to create professional talking avatar videos from text.

## Features

- 🎬 AI-powered video generation
- 🗣️ Text-to-speech with multiple voices
- 👤 Talking avatar library
- 🌍 Multi-language support
- 🎨 Customizable branding
- 📊 Workspace management
- 📹 Video library and sharing

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: S3-compatible object storage
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- S3-compatible storage (AWS S3, MinIO, etc.)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── (auth)/          # Authentication pages
│   ├── (app)/           # Main application pages
│   ├── api/             # API routes
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # UI components
│   ├── layout/         # Layout components
│   └── providers/      # Context providers
├── lib/                # Utility functions and configurations
├── prisma/             # Database schema and migrations
└── public/             # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## License

MIT
