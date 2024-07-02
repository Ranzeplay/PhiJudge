---
title: IPluginEntrypoint
---

# Interface IPluginEntrypoint

## Description

When initializing plugins, Executor will read this class and get necessary data.

When loading and unloading the plugin, there are also methods to invoke.

## Properties

| Name                  | Data Type     | Description                           |
|-----------------------|---------------|---------------------------------------|
| Id                    | string        | The unique identifier of the plugin.   |
| Name                  | string        | The name of the plugin.                |
| Description           | string        | The description of the plugin.         |
| Author                | string        | The author of the plugin.              |
| Version               | string        | The version of the plugin.             |
| Dependencies         | string[]      | The required dependencies of the plugin. They will be loaded before this plugin loads. |
| OptionalDependencies | string[]      | The optional dependencies of the plugin. |
| SupportedLanguageId   | string[]      | The supported language IDs of the plugin. |

## Methods

### Load plugin

#### Signature

```csharp
Task Load(ILogger logger);
```

#### Parameters

- `logger: ILogger`: Give a logger for plugin to log something to output.

#### Usage

Invoked when Executor want's to load the plugin.

### Unload plugin

#### Signature

```csharp
Task Unload();
```
#### Usage

Invoked when executor want's to unload the plugin.
