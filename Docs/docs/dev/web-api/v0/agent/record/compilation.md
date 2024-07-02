---
title: Compilation
---

# Compilation

## Begin compilation

**Path:** `/api/v0/agent/record/[id]/compilation/begin`

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

```json
{}
```

## Report compilation status

**Path:** `/api/v0/agent/record/[id]/compilation`

**Method:** 	POST

### Description

Submit compilation result when compilation finished

### Payload

#### Query parameters

- `id`: Record ID

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

#### Body

**Type:** `application/json`

```typescript
export type CompilationResult = {
  recordId: number;
  type: CompilationResultType;
  output: string;
}

export enum CompilationResultType {
  PassedWithoutWarnings = 'PassedWithoutWarnings',
  PassedWithWarnings = 'PassedWithWarnings',
  FailedWithErrors = 'FailedWithErrors',
  Unknown = 'Unknown',
}
```

- `output: string`: Compiler output

### Response

**Type:** JSON

```json
{}
```
