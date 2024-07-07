---
title: "PhiJudge: A continunation of Semicolon.OnlineJudge"
slug: phijudge-a-continunation-of-semicolon-onlinejudge
authors: [ranzeplay]
date: 2024-07-07T16:15
---

# PhiJudge: A continuation of Semicolon.OnlineJudge

## Background

[PhiJudge](https://github.com/Ranzeplay/PhiJudge) is a continuation of [Semicolon.OnlineJudge](https://github.com/Ranzeplay/Semicolon.OnlineJudge),
which is a project that I made when I was in 9th grade.

I got over 3k views from [a video](https://www.bilibili.com/video/BV1tJ411a7iP), in which I described how I did that.
In 21.6.2023, I decided to rewrite the whole system, including both backend and frontend.
I have to admit that it's a hard job since I have to learn new tools
such as [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/).
However, I'm familiar with .NET C#, which made it possible to work out a "it just works" version in limited time.
Due to the heavy study tasks in the whole 12th grade, the development of the project was suspended from 15.9.2023 to 22.4.2024.
Honestly speaking, the project actually back on track on 18.5.2024, on that day, the techonology stack was finally switched to current stack.

## Differences between old and new systems

### Semicolon.OnlineJudge

A centralized system:

- Root
  - Central
    - Evaluation machine
    - Realtime state synchronization
    - Webpage
      - Problem
      - Track (Record)
      - Admin
  - Database

Except for the database service, all other services are integrated in Central.
As time goes on, it will become harder to maintain and lose extensibility.

Also, every Track is tested in the same environment as Central, which may cause danger.

### PhiJudge

A modularized system:

- Root
  - Central
    - Webpage
    - Problem
    - Record
    - Admin
  - Agent
    - Executor
    - Plugin
  - Supabase

Services are separated, easy to maintain and add new features.

The Agent is containerized, running in a container makes it easier to control.

## Advantages of the new system

## What's next

- Responsive layout that provides suitable view on both desktop and mobile screen sizes.
- Smarter ways to allocate record for agents to run.
- Make agents accept others ways than Realtime Channel to know new records to run.
- Automatically restart the test of records when there's too long time without response from the agent.
- Improve docs quality.
- More language plugins.
- Improve webpage performance.

## Example websites

The example websites will be deployed when there's a new commit on master branch.

- Central: [https://phijudge.ranzeplay.space](https://phijudge.ranzeplay.space)
- Docs: [https://docs.phijudge.ranzeplay.space](https://docs.phijudge.ranzeplay.space)
