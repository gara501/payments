# Project Structure

## Root Level Organization

- **Configuration Files**: `vite.config.ts`, `tailwind.config.js`, `tsconfig.*.json`, `eslint.config.js`
- **Documentation**: `README.md`, `DATABASE_SETUP.md`, `DEPLOYMENT.md`
- **Test Files**: `test-*.html` files for manual testing and debugging
- **Scripts**: `scripts/` directory for build and verification utilities

## Source Code Structure (`src/`)

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── charts/         # Chart-specific components (Recharts wrappers)
│   └── index.ts        # Component exports
├── db/                 # Database layer
│   ├── __tests__/      # Database tests
│   ├── adapter.ts      # Main database interface
│   ├── supabase-client.ts  # Supabase client singleton
│   ├── database.types.ts   # TypeScript types for database
│   └── seedData.ts     # Sample data
├── hooks/              # Custom React hooks
│   └── __tests__/      # Hook tests
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── __tests__/      # Utility tests
└── test/               # Test configuration
```

## Architecture Patterns

### Component Organization
- **Barrel Exports**: Use `index.ts` files for clean imports
- **Co-location**: Tests alongside source files in `__tests__/` directories
- **Separation of Concerns**: Charts, forms, and UI components in separate directories

### Database Layer
- **Adapter Pattern**: `DatabaseAdapter` class provides consistent interface
- **Supabase Client**: Cloud-based PostgreSQL database access
- **Provider Pattern**: `DatabaseProvider` manages database state and initialization
- **Type Safety**: Database types defined in `database.types.ts`

### State Management
- **Custom Hooks**: Business logic encapsulated in hooks (`useSubscriptions`, `useToast`)
- **Context Providers**: Database and toast state managed via React Context
- **Local State**: Component-specific state using `useState`

### Testing Strategy
- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Database operations and hook interactions
- **Manual Tests**: HTML files for debugging complex scenarios

## File Naming Conventions

- **Components**: PascalCase (e.g., `SubscriptionCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSubscriptions.ts`)
- **Types**: camelCase files, PascalCase interfaces (e.g., `subscription.ts` → `Subscription`)
- **Tests**: Match source file name with `.test.tsx` suffix
- **Utilities**: camelCase (e.g., `dateHelpers.ts`)