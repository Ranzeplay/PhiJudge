---
title: Problem
---

# Problem-related APIs for Agents to use

## Problem test data

**Path:** `/api/v0/agent/problem/[id]`

**Method:** GET

### Description

Get problem ID and the all test data of the problem requested.

### Payload

#### Query parameters

- `id`: Problem ID

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

### Response

**Type:** JSON

```typescript
type JsonResponse = {
  id: number;
  testPoints: {
    input: string;
    expectedOutput: string;
    timeLimitMilliseconds: number;
    memoryLimitBytes: number;
    order: number;
  }[];
};
```

## Update supported languages

**Path:** `/api/v0/agent/languages`

**Method:** POST

### Description

Update languages that are supported by the agent to the database for Central server to allocate records.

### Payload

#### Body

**Type:** `application/json` string array

The body contains an array of strings, where each value represents the ID of a supported language.

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

### Response

**Type:** JSON

```json
{
  "message": "Languages updated"
}
```
