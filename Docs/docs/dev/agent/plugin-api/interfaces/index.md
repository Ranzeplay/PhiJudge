---
title: Interface
---

# Interfaces

> They are written in C#.

## For plugin development

- [`IPluginEntrypoint`](entrypoint) : The entrypoint of a plugin.

- [`ICompilationStage`](compilation-stage) : The executor invokes functions once it has prepared the record.

- [`IExecutionStage`](execution-stage) : The executor inbokes functions once the compilation stage has passed.
