---
title: Execution
---

# Execution

## Begin execution

**Path:** `/api/v0/agent/record/[id]/execution/begin`

**Method:** GET

### Description

Begin execution stage of a record.

### Payload

#### Query parameters

- `id`: Record ID

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

### Response

**Type:** JSON

```json
{}
```

## Submit test point data

**Path:** `/api/v0/agent/record/[id]/execution`

**Method:** POST

### Payload

#### Query parameters

- `id`: Record ID

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

#### Body

**Type:** `application/json`

```typescript
type ExecutionResult = {
  recordId: number;
  order: number;
  type: ExecutionResultType;
  output: string;
  timeMilliseconds: number;
  peakMemoryBytes: number;
};

enum ExecutionResultType {
  Accepted = 'Accepted',
  WrongAnswer = 'WrongAnswer',
  TimeLimitExceeded = 'TimeLimitExceeded',
  MemoryLimitExceeded = 'MemoryLimitExceeded',
  OutputLimitExceeded = 'OutputLimitExceeded',
  RuntimeError = 'RuntimeError',
  Unknown = 'Unknown',
}
```

### Response

**Type:** JSON

```json
{
  "success": true
}
```

## Finish execution

:::warning[Deprecation]

When the last test point has submitted to the server through `/api/v0/agent/record/[id]/execution`,
the excution stage will be finished automatically.

:::

**Path:** `/api/v0/agent/record/[id]/execution/finish`

**Method:** GET

### Description

Finish execution stage of a record.

### Payload

#### Query parameters

- `id`: Record ID

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

### Response

**Type:** JSON

```json
{}
```
