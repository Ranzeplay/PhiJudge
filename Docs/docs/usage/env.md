---
title: Enviroment
---

# Environment settings

## Environment variables

### Central

- `DATABASE_URL`: This variable holds the connection string for your PostgreSQL database.
- `NEXT_PUBLIC_SUPABASE_URL`: This variable stores the URL of your Supabase instance.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: This variable contains the anonymous key for your Supabase instance.
- `SUPABASE_SERVICE_ROLE_KEY`: This variable holds the service role key for your Supabase instance.

### Agent

- `SUPABASE_URL`: The URL of your Supabase instance. This is required for connecting to Supabase services.
- `SUPABASE_KEY`: The API key for your Supabase instance. This key is used for authenticating requests to Supabase.
- `CENTRAL_SERVER_URL`: The URL of the central server. This is necessary for services that need to communicate with the central server.
- `AGENT_ID`: A unique identifier for the agent. This ID is used to distinguish between different agents in the system.
- `PLUGINS_DIR`: The directory path where plugins are stored. This path is used to load available plugins for the application.
