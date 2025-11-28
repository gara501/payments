# Supabase Migration Spec

This spec documents the migration from SQLite WASM to Supabase for the subscription management application.

## Overview

The application currently uses SQLite WASM for client-side data storage. This migration transitions to Supabase (PostgreSQL) for cloud-based storage, enabling:

- Multi-device synchronization
- Cloud-based data persistence
- Preparation for user authentication
- Simplified build process (no WASM)
- Smaller bundle size

## Spec Files

- **requirements.md**: Detailed requirements for the migration with acceptance criteria
- **design.md**: Architectural design, component changes, and implementation details
- **tasks.md**: Step-by-step implementation plan with 14 major tasks

## Key Changes

### Database
- **From**: SQLite WASM (in-memory)
- **To**: Supabase (PostgreSQL cloud)

### Data Types
- **IDs**: Integer → UUID (string)
- **Booleans**: Integer (0/1) → Native boolean
- **Timestamps**: ISO string → PostgreSQL timestamptz

### Architecture
- Remove SQLite initialization and WASM loading
- Add Supabase client creation and configuration
- Update DatabaseAdapter to use Supabase queries
- Maintain same component API (backward compatible)

## Environment Variables

The migration uses existing environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
`: Your Supabase anon/public key

These are already configured in `.env` and `src/config/env.ts`.

## Getting Started

To execute this migration:

1. Review the requirements.md file
2. Study the design.md for architectural understanding
3. Follow tasks.md sequentially
4. Start with task 1.1 (Install Dependencies)

## Migration Status

- [x] Requirements defined
- [x] Design completed
- [x] Tasks planned
- [ ] Implementation in progress
- [ ] Testing and validation
- [ ] Documentation updated
- [ ] Deployment

## Related Files

- `.env`: Environment variables (already configured)
- `src/config/env.ts`: Environment configuration
- `src/config/supabase.ts`: Supabase configuration helpers
- `src/db/adapter.ts`: Database adapter (to be updated)
- `src/types/subscription.ts`: Subscription type (to be updated)

## Notes

- All existing components will continue to work without changes
- The DatabaseAdapter interface remains the same
- Only the underlying implementation changes from SQLite to Supabase
- Tests will need to be updated to mock Supabase instead of SQLite
