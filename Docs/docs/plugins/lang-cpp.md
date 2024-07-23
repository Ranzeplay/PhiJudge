---
title: Language C++
---

# Plugin: Language C++

If you are running the Agent outside of a Docker container, make sure that you have installed Podman, the plugin uses Podman to run container inside to provide a secured environment to prevent dangers.

## Build container image

### For compiling programs

Navigate to `Source/Agent/Plugins/Language.Cpp/Docker/Compilation`

Run the following command:

```bash
podman build -t phi-plugin-cpp-compilation .
```

### For executing programs

Navigate to `Source/Agent/Plugins/Language.Cpp/Docker/Execution`

Run the following command:

```bash
podman build -t phi-plugin-cpp-execution .
```
