# Technology Stack

## Core Technologies

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7.x with ES modules
- **Styling**: TailwindCSS 4.x with Vite plugin
- **Database**: Supabase (@supabase/supabase-js) for cloud-based PostgreSQL storage
- **Charts**: Recharts for data visualization
- **Testing**: Vitest with @testing-library/react and jsdom

## Development Tools

- **Linting**: ESLint 9.x with TypeScript support
- **Type Checking**: TypeScript 5.9.x
- **Package Manager**: npm with package-lock.json

## Common Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once and exit

# Quality
npm run lint         # Run ESLint on all files

# Production
npm run verify-production  # Verify production build works correctly
```

## Build Configuration

- **Base Path**: Configurable for GitHub Pages deployment (`/payments/`)
- **Target**: ES2020 for modern browser support
- **Environment Variables**: Supabase URL and API key configured via Vite env vars

## Database Architecture

- **Supabase Client**: Cloud-based PostgreSQL database with real-time capabilities
- **Schema**: Managed via Supabase migrations in `supabase/migrations/`
- **Seeding**: Automatic sample data population for development
- **Type Safety**: TypeScript types generated from database schema