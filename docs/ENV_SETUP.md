# Environment Variables Setup

This project uses environment variables for configuration. Vite provides built-in support for `.env` files.

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your values:**
   Edit the `.env` file and replace placeholder values with your actual configuration.

## Environment Variables

### Supabase Configuration

- `VITE_SUPABASE_URL`: Your Supabase project URL
  - Example: `https://your-project.supabase.co`
  - Required for database operations

- `VITE_SUPABASE_API_KEY`: Your Supabase anonymous/public API key
  - Found in your Supabase project settings under API
  - Required for authentication and database access

## Important Notes

### Vite Environment Variables

- **Prefix Requirement**: Only variables prefixed with `VITE_` are exposed to the client-side code
- **Security**: Never commit `.env` files to version control (already in `.gitignore`)
- **Access**: Use `import.meta.env.VITE_VARIABLE_NAME` to access variables in your code

### Using Environment Variables in Code

```typescript
// Import the typed env configuration
import { env } from './config/env';

// Access environment variables
const supabaseUrl = env.supabase.url;
```

Or directly:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

## File Structure

- `.env` - Your local environment variables (not committed to git)
- `.env.example` - Template file showing required variables (committed to git)
- `src/config/env.ts` - Typed environment configuration
- `src/vite-env.d.ts` - TypeScript declarations for environment variables

## Development vs Production

Vite automatically loads the appropriate `.env` file based on the mode:

- `.env` - Loaded in all cases
- `.env.local` - Loaded in all cases, ignored by git
- `.env.[mode]` - Only loaded in specified mode (e.g., `.env.production`)
- `.env.[mode].local` - Only loaded in specified mode, ignored by git

## Validation

The project includes automatic validation of required environment variables in development mode. Check the console for warnings about missing variables.

## Adding New Environment Variables

1. Add the variable to `.env` with `VITE_` prefix
2. Add it to `.env.example` as a template
3. Update `src/vite-env.d.ts` with the type definition
4. Update `src/config/env.ts` to export the variable
5. Update this documentation

## Troubleshooting

### Variables not loading?

1. Ensure the variable name starts with `VITE_`
2. Restart the dev server after changing `.env` files
3. Check that `.env` file is in the project root
4. Verify the variable is not commented out

### TypeScript errors?

1. Make sure `src/vite-env.d.ts` includes your variable
2. Restart your TypeScript server in your IDE
3. Check that the variable is properly typed in the interface
