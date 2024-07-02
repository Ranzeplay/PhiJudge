---
title: Build
---

# Build

## Clone project

**Clone project from GitHub**

```bash
git clone https://github.com/Ranzeplay/PhiJudge
```

## Docs

### Prepare packages

- [Node.js](https://nodejs.org/) (recommend to use latest LTS version)
- [pnpm](https://pnpm.io) package manager

### Working directory

Go to directory `Docs`

### Steps

**Install packages by running the following script:**

```bash
pnpm i
```

**Make a production build by running the following script:**

```bash
pnpm run build
```

**To view build result, run script:**

```bash
pnpm run serve
```

## Supabase

### Prepare packages

- A supabase instance

### Steps

**Initiate a supabase instance, and get the following values:**

- Service Role key --> `SupabaseServiceRoleKey`
- Anon key --> `SupabaseAnonKey`
- Database connection string --> `SupabasePostgresConnectionString`
- Instance API url --> `SupabaseApiUrl`

## Central server

### Prepare packages

- [Node.js](https://nodejs.org/) (recommend to use latest LTS version)
- [pnpm](https://pnpm.io) package manager

### Working directory

Go to directory `Source/Central`

### Steps

**Set environment variables in `.env` file:**

```properties
DATABASE_URL="<SupabasePostgresConnectionString>"

NEXT_PUBLIC_SUPABASE_URL="<SupabaseApiUrl>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<SupabaseAnonKey>"
SUPABASE_SERVICE_ROLE_KEY="<SupabaseServiceRoleKey>"
```

**Install packages by running the following script:**

```bash
pnpm i
```

**Make a production build by running the following script:**

```bash
pnpm run build
```

**To view build result, run script:**

```bash
pnpm start
```

## Agent

### Prepare packages

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Docker](https://www.docker.com/) (or any container such as [Podman](https://podman.io/), but there'll be difference in commands)

### Working directory

Go to directory `Source/Agent`

### Steps

**Build Executor to a single Docker image, run the following script:**

```bash
docker build -f Executor/Dockerfile -t phijudge.agent .
```

### Optional step

**Build the plugin for C programming language**

Go to relative directory `Plugins/Language.C`.

Run the following script:

```bash
dotnet publish -c Release
```

Get the target file at `Plugins/Language.C/bin/Release/net8.0/publish/PhiJudge.Plugin.Language.C.dll` 
