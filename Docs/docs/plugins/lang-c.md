---
title: Language C
---

# Plugin: Language C

If you are running the Agent outside of a Docker container, make sure that you have installed Podman, the plugin uses Podman to run container inside to provide a secured environment to prevent dangers.

## Build container image

### For compiling programs

Navigate to `Source/Agent/Plugins/Language.C/Docker/Compilation`

Run the following command:

```bash
podman build -t phi-plugin-c-compilation .
```

### For executing programs

Navigate to `Source/Agent/Plugins/Language.C/Docker/Execution`

Run the following command:

```bash
podman build -t phi-plugin-c-execution .
```
