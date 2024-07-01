---
title: Language
---

# Programming language list

## Get enabled programming languages

**Path:** `/api/v0/lang`

**Method:** GET

### Description

Get the programming languages available on central server as a list.

### Payload

None

### Response

**Type:** JSON array

#### Array entry definition

```typescript
export type LanguageView = {
  id: string;
  name: string;
  agents: number;
  enabled: boolean;
};
```

- `id`: Language ID, normally used to apply syntax highlighting in monaco-editor.
- `name`: The friendly name of the programming language.
- `agents`: The number of agents available to test newly submitted code at the moment.
- `enabled`: Indicates whether the central server accepts records submitted with the language.
