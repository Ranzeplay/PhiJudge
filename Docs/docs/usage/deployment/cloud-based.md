---
title: 'Cloud-based'
---

# Cloud-based deployment

## Supabase

Deploy by yourself, or create an instance on [Supabase](https://supabase.com/).

### Set environment variables

See [Usage/Build](../build#steps-2).

## Central

You can deploy it to Vercel.

## Agent

You can deploy it to a cloud container application service like [Fly](https://fly.io/) and [Heroku](https://www.heroku.com/).

### Set environment variables

- `SUPABASE_URL`: The supabase API URL, Executor will use Realtime service.
- `SUPABASE_KEY`: The supabase key that allows to receive Realtime broadcast.
- `CENTRAL_SERVER_URL`: The URL of Central server without slash.
- `AGENT_ID`: A valid Agent ID.
- `PLUGINS_DIR`: The path to the directory where all plugins are stored in.

### Installing plugins

Put plugin file into the `PLUGIN_DIR` mentioned above, the Executor will reload all plugins automatically.
