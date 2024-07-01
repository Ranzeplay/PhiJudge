---
title: 'Record allocation'
---

# Record allocation

## Description

When there's a record being submitted, server will find a capable agent
which is able to run the programming language required by the record to run tests.

## Channel

The allocation is broadcasted through Supabase Channel `phijudge.record.alloc`.
Be noticed, all agents are connected to the channel so they can get to know if they have
been allocated a record to test.

## Message

```json
{
	"recordId": <number>,
	"agentId": <string>
}
```

## Steps

```mermaid
stateDiagram-v2
	state "Record being submitted by user" as s1
	state "Central server find a capable agent" as s2
	state "Central server broadcast to realtime channel" as s3
	state "Agent begin to test" as s4

	s1 --> s2
	s2 --> s3
	s3 --> s4
```
