---
title: 'Communication'
---

```mermaid
sequenceDiagram
	participant Server
	participant RT_B as Realtime(Broadcast)
	participant Agent
	Note over Server: Received new record submission 
	Server->>RT_B: Send { recordId, agentId }
	RT_B->>Agent: Fetch by agent
	Agent->>Server: Set status: PENDING
	Agent->>Server: Fetch problem test data
	Server->> Agent: Reply data
	Agent->>Server: Set status: COMPILING
	Note over Agent: Compile according to Record data
	alt success
	Agent->>Server: Set status: EXECUTING
	Note over Agent: Test record with every test data
	loop every testPoint
	Note over Agent: Do test and collect result
	Agent->> Server: Set testData status: { RESULT }
	end
	Agent->>Server: Set status: FINISHED
	else fail
	Agent->>Server: Set status: COMPILATION_FAIL
	end
	Note over Agent: Finalize
```
