# Jira API Configuration

## Overview

This project uses Jira API integration through the MCP (Model Context Protocol) Atlassian server. The Jira API token is now stored in environment variables for better security and maintainability.

## Environment Variables

### For MCP Server (Docker)
- `JIRA_API_TOKEN` - Used by the MCP Atlassian Docker container

### For Client-Side (Vite)
- `VITE_JIRA_API_TOKEN` - Available in the browser through `import.meta.env`

## Configuration Files

### `.env`
Contains your actual API tokens (not committed to git):
```bash
# Jira Configuration
JIRA_API_TOKEN=your_actual_token_here
VITE_JIRA_API_TOKEN=your_actual_token_here
```

### `.env.example`
Template file showing required variables (committed to git):
```bash
# Jira Configuration
JIRA_API_TOKEN=your_jira_api_token_here
VITE_JIRA_API_TOKEN=your_jira_api_token_here
```

### `~/.kiro/settings/mcp.json`
MCP server configuration that references the environment variable:
```json
{
  "mcpServers": {
    "mcp-atlassian": {
      "command": "docker",
      "args": [
        "-e",
        "JIRA_API_TOKEN=${JIRA_API_TOKEN}",
        ...
      ]
    }
  }
}
```

## Usage in Code

### Accessing Jira Token in TypeScript

```typescript
import { env } from './config/env';

// Access the Jira API token
const jiraToken = env.jira.apiToken;
```

## How to Get Your Jira API Token

1. Log in to your Atlassian account at https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a descriptive name (e.g., "Kiro MCP Integration")
4. Copy the generated token
5. Add it to your `.env` file

## Security Notes

- Never commit `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template for other developers
- Rotate your API tokens regularly
- Use different tokens for different environments (dev, staging, prod)

## Troubleshooting

### MCP Server Not Connecting
1. Ensure `JIRA_API_TOKEN` is set in your `.env` file
2. Restart the MCP server or Kiro IDE
3. Check that the token hasn't expired

### Client-Side Access Issues
1. Ensure `VITE_JIRA_API_TOKEN` is set in your `.env` file
2. Restart the Vite dev server (`npm run dev`)
3. Remember: Only variables prefixed with `VITE_` are exposed to the browser

## Related Files

- `.env` - Your local environment variables
- `.env.example` - Template for environment variables
- `src/config/env.ts` - TypeScript environment configuration
- `~/.kiro/settings/mcp.json` - MCP server configuration
