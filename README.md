# Travel Baseball - Team Management Platform

**Version 1.0.0** | Complete Travel Baseball Team Management Web App

Travel Baseball is a self-hosted web application that serves as the central hub for competitive travel baseball teams. It eliminates scattered spreadsheets, GroupMe threads, and paper line-up cards by consolidating everything a coach needs into one secure, fast, and easy-to-use platform.

---

## Features

### Core Modules

- **Schedule & Calendar** - Full calendar with practices, games, tournaments, and events
- **Roster Management** - Player profiles with photos, stats, and historical performance
- **Travel Planning** - Tournament logistics, hotel coordination, carpools, and budgets
- **Game Tracking** - Score tracking and mobile-friendly stat entry
- **Document Management** - Secure storage for insurance, medical forms, and certificates
- **Announcements** - Team-wide communication with priority levels
- **Statistics** - Comprehensive hitting, pitching, and fielding stats with calculations
- **Workout Programs** - Customizable training programs with session tracking

### Key Capabilities

- **Authentication & Security** - Role-based access control with credentials-based auth
- **Mobile-Optimized** - Responsive design for use at the field
- **Weather Integration** - 72-hour forecasts for outdoor events
- **AI Document Parsing** - Upload documents and automatically extract schedule, roster, and travel data (powered by Google Gemini)
- **PDF Export** - Rosters, itineraries, and reports
- **Backup & Restore** - Automated database and file backups
- **Docker Deployment** - Single-command deployment with docker compose

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Calendar**: FullCalendar.io
- **Charts**: Recharts
- **Deployment**: Docker + Docker Compose

---

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### 1. Clone and configure

```bash
git clone <your-repo-url> travel-baseball
cd travel-baseball
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Required - change these
DB_PASSWORD="your-secure-password"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:7373"

# Optional
WEATHER_API_KEY="your-openweathermap-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### 2. Build and run

```bash
docker compose up -d --build
```

### 3. Access the app

Open http://localhost:7373 in your browser.

The first user to register will need to be set up as the head coach using the admin setup script (see below).

---

## Admin Setup

After first deployment, create the initial admin/head coach account:

```bash
docker compose exec app npx tsx scripts/setup-admin.ts
```

This uses the `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `TEAM_NAME` values from your `.env` file.

---

## User Roles

| Role | Permissions |
|------|------------|
| **Head Coach** | Full access - manage roster, schedule, settings, invite members |
| **Assistant Coach** | Manage schedule, roster, stats, travel |
| **Team Manager** | Manage travel, documents, announcements |
| **Parent** | View schedule, roster, travel details, RSVP |
| **Player** | View schedule, own stats |

---

## Docker Management

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f app

# Rebuild after changes
docker compose up -d --build

# Stop services
docker compose down

# Full reset (removes data)
docker compose down -v
```

---

## Backup & Restore

### Backup

```bash
./scripts/backup.sh
```

Creates a timestamped backup of the PostgreSQL database and uploads directory.

### Restore

```bash
./scripts/restore.sh <backup-file>
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DB_PASSWORD` | Yes | Database password |
| `NEXTAUTH_URL` | Yes | Public URL of the app |
| `NEXTAUTH_SECRET` | Yes | NextAuth encryption key |
| `WEATHER_API_KEY` | No | OpenWeatherMap API key |
| `GEMINI_API_KEY` | No | Google Gemini API key for document parsing |
| `ADMIN_EMAIL` | No | Initial admin email |
| `ADMIN_PASSWORD` | No | Initial admin password |
| `TEAM_NAME` | No | Initial team name |

---

## Development

### Local development (without Docker)

```bash
# Install dependencies
npm install

# Set up database (requires local PostgreSQL)
npx prisma db push

# Start dev server
npm run dev
```

### Database management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

---

## Project Structure

```
travel-baseball/
├── app/
│   ├── (public)/        # Public pages (privacy, terms)
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   ├── login/           # Login page
│   └── register/        # Registration page
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── roster/          # Roster components
│   ├── schedule/        # Calendar components
│   ├── travel/          # Travel planning components
│   ├── games/           # Game stats components
│   └── dashboard/       # Dashboard layout
├── lib/                 # Utility libraries
├── prisma/              # Database schema
├── public/              # Static assets
├── scripts/             # Backup/restore utilities
├── docker-compose.yml   # Container orchestration
├── Dockerfile           # Production build
└── .env.example         # Environment template
```

---

## Troubleshooting

### App won't start
```bash
# Check logs
docker compose logs app

# Verify database is running
docker compose ps
```

### Database connection issues
```bash
# Ensure database is healthy
docker compose exec db pg_isready -U coach -d travel_baseball

# Reset database
docker compose exec app npx prisma db push --force-reset
```

### Build fails with memory error
The Dockerfile limits Node.js heap to 1.5GB. If building on a low-memory server, ensure at least 2GB RAM is available.

---

## License

Private - All rights reserved.
