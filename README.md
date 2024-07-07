# PhiJudge

PhiJudge is a continuation of [Semicolon.OnlineJudge](https://github.com/Ranzeplay/Semicolon.OnlineJudge). Providing open judge service.

> Under development.

## Components

- Central server
- Agent
  - Executor
  - Plugin API
  - Example plugins
- Supabase instance

## Features

- Use services Supabase provides, such as Database, Auth, and Realtime.
- Use .NET C# to develop Agent, and it's container-based.
- Plugins are dynamically loaded. To enable them, just put them into the plugins directory without rebuilding the whole Agent.
- Versioned Web API interface (currently v0).
