---
title: Initial data
---

# Initial data

## Get record initial data for Agent to use

**Path:** `/api/v0/agent/record/[id]`

**Method:** GET

### Description

Get initial record data

### Payload

#### Query parameters

- `id`: Record ID

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

### Response

**Type:** JSON

#### Schema definition

```typescript
export type RecordInitialData = {
  recordId: number;
  sourceCode: string; 
  language: string;
  problemId: number;
  enableOptimization: boolean;
  warningAsError: boolean;
};
```
