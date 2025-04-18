---
title: 'Agent'
---

# Agent

## Role

Agent is a software to run source code submitted by users.
Based on its function, it is suggested to be deployed in a container.
It does everything automatically including compiling code, running program and monitoring performance.

## Tasks

```mermaid
flowchart LR
  s1["`Receive record id`"]
  s2["`Pull test data`"]
  s3["`Run & profile`"]
  s4["`Upload result`"]

  s1 --> s2
  s2 --> s3
  s3 --> s4
```

It supports parallel testing if resource is abundant.
