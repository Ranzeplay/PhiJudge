---
title: Heartbeat
---

# Heartbeat signal

## Send heartbeat signal

**Path:** `/api/v0/agent/heartbeat`

**Method:** GET

### Description

Send heartbeat signal to Central server, will update IP, status and last heartbeat time in database.

### Payload

#### Headers

- `Authorization`: Set header value as the ID of a valid Agent.

### Response

**Type:** JSON

```json
{
  "message": "Heartbeat received"
}
```
