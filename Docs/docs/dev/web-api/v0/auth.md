---
title: Auth
---

# Authentication & Authorization

## Status

**Path:** `/api/v0/auth/atatus`

**Method:** GET

### Description

Get user authentication status, mainly invoked by webpage navbar to show sign-in status.

### Payload

#### Cookies (Optional)

Cookies set by Supabase

### Response

**Type:** JSON

- `isLoggedIn: boolean`: Indicates whether the user has a valid credential.
- `userName: string?`: Contains username if the user has logged in.
- `isAdmin: boolean?`: Indicates whether the user has admin privilege if the user has logged in.
