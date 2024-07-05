---
title: Record
---

# Record data

## Record status

**Path:** `/api/v0/record/[id]/status`

**Method:** GET

### Description

Get current status of a certain record,
it's dynamic because of different stages.

### Payload

#### Query parameters

- `id`: Record ID

### Response

**Type:** JSON

- `status: $Enums.RecordStatus`: The current status of the requested record, with 7 possible values:
  - `PENDING`: The record has not started testing yet.
  - `COMPILING`: An agent is compiling the source code of the record.
  - `TESTING`: Compilation passed, testing program.
  - `PASSED`: All test points are in `ACCEPTED` status.
  - `FAILED`: Any test point is not in `ACCEPTED` status, or the compilation failed.
  - `ERROR`: Internal error.
  - `UNKNOWN`: The status is unknown.

## Persistent data

**Path:** `/api/v0/record/[id]/persistent`

**Method:** GET

### Description

Get the data that fixed upon submission,
such as source code, language and submitTime,
of a certain record.

### Payload

#### Query parameters

- `id`: Record ID

### Response

**Type:** JSON

#### Schema definition

```typescript
export type RecordPersistentData = {
  problem: {
    id: number;
    title: string;
    author: string;
    authorId: string;
  };
  agentId: string;
  sourceCode: string;
  language: {
    id: string;
    name: string;
  };
  submitTime: Date;
};
```

## Compilation data

**Path:** `/api/v0/record/[id]/compilation`

**Method:** GET

### Description

Get the compilation output & result of a certain record.

### Payload

#### Query parameters

- `id`: Record ID

### Response

**Type:** JSON

#### Schema definition

```typescript
export type CompilationData = {
    compilationResult: $Enums.CompilationStatus;
    compilationOutput: string;
}
```

- `compilationResult: $Enums.CompilationStatus`: Contains 4 statuses:
  - `PassedWithoutWarnings`: Compilation passed without any warnings from the compiler.
  - `PassedWithWarnings`: Compilation passed, but there were warnings.
  - `FailedWithErrors`: Failed to compile the program due to issues. There will be no execution stages, and the record will be finished.
  - `Unknown`: Status is unknown, received when the compilation hasn't started yet.
- `compilationOutput: string`: The output captured from the compiler.

## Test points status

**Path:** `/api/v0/record/[id]/testPoints`

**Method:** GET

### Description

Get all available test points of a certain record.

### Payload

#### Query parameters

- `id`: Record ID

### Response

**Type:** JSON array

#### Array entry definition

```typescript
export type TestPointViewModel = {
  order: number;
  resultType: $Enums.RecordTestPointStatus;
  actualTimeMs: number;
  averageTimeMs: number;
  timeLimitMs: number;
  actualPeakMemoryBytes: number;
  averagePeakMemoryBytes: number;
  memoryLimitBytes: number;
};
```

`order: number`: The order of the test point, notmally they have been ordered by ascending.
`resultType: $Enums.RecordTestPointStatus`: The status of the test point, with 7 values:
  - `ACCEPTED`: Passed perfectly.
  - `WRONG_ANSWER`: Only the output doesn't match with the correct one.
  - `TIME_LIMIT_EXCEEDED`: The program costs more time to finish than the time limit.
  - `MEMORY_LIMIT_EXCEEDED`: The program costs more memory to finish than the memory limit.
  - `OUTPUT_LIMIT_EXCEEDED`: The program output too much output that's impossible.
  - `RUNTIME_ERROR`: The program triggered a runtime error.
  - `UNKNOWN`: Unknown status.
- `averageTimeMs`: The average time consumed by all `ACCEPTED` programs in this test point.
- `averagePeakMemoryBytes`: The average peak memory consumed by all `ACCEPTED` programs in this test point.
