---
title: Local agent
---

# Run Agent in local environment

:::note

In this tutorial, we will run Agent in a Fedora 40 instance

:::

## Steps

### Install system

Install a Fedora 40 VM instance.

Create a default user called `phi` for instance, do not use root user directly.

Login to the instance.

### Create a secured user for testing code

Run the following script to create a user with name `judge`:

```bash
sudo useradd -M judge
```

:::tip

You may use the following commands to modify the user

```bash
sudo userdel -r <username>      # Remove a user with its profile
sudo passwd <username>          # Reset the password of a user
```

In this page, the `<username>` is replaced with `judge`.

:::

### Adjust user permissions

To prevent a user from accessing network, use `iptables` to achieve that:

```bash
sudo iptables -A OUTPUT -m owner --uid-owner judge -j REJECT
```

If IPv6 is available, also use the following command:

```bash
ip6tables -I OUTPUT -m owner --uid-owner judge -j REJECT
```

### Prepare packages

- git
- .NET 8 SDK
- Podman

Use the following commands to install them:

```bash
sudo dnf update
sudo dnf install git dotnet-sdk-8.0 podman
```

### Clone repository

Run the following script in a proper place to clone the whole PhiJudge Git repository from GitHub.

```bash
git clone https://github.com/Ranzeplay/PhiJudge.git
```

### Build agent from source

Navigate to `PhiJudge/Source/Agent`, run the following script to build Agent:

```bash
dotnet publish -c Release
```

Run the following script to collect plugins:

```bash
mkdir dist-plugin-collection
mv Plugins/Language.Cpp/bin/Release/net8.0/PhiJudge.Plugin.Language.Cpp.dll dist-plugin-collection/Language.Cpp.dll
mv Plugins/Language.C/bin/Release/net8.0/PhiJudge.Plugin.Language.C.dll dist-plugin-collection/Language.C.dll
mv Plugins/Language.Python/bin/Release/net8.0/PhiJudge.Plugin.Language.Python.dll dist-plugin-collection/Language.Python.dll
```

And the build result of Agent itself will be in `Executor/bin/Release/net8.0/publish/`.

### Copy & install build files

We will install them to directory `/opt/phijudge`.

Run the following script to create the directory for user `phi`:

```bash
sudo mkdir /opt/phijudge
sudo chown phi /opt/phijudge/
cp Executor/bin/Release/net8.0/publish/ /opt/phijudge/executor -r
```

### Configure service

Navigate to `/opt/phijudge`

Create file `phijudge-agent.service` with content

```systemd
[Unit]
Description=PhiJudge Agent Service
After=network.target

[Service]
User=phi
ExecStart=/usr/bin/dotnet /opt/phijudge/executor/PhiJudge.Agent.Executor.dll
TimeoutStopSec=30s
Restart=on-failure
RestartSec=10
Environment="PLUGINS_DIR=/opt/phijudge/plugins"
Environment="RUNTIME=vm"
Environment="SUPABASE_URL="                            # Fill with yours
Environment="SUPABASE_KEY="                            # Fill with yours
Environment="CENTRAL_SERVER_URL="                      # Fill with yours
Environment="AGENT_ID="                                # Fill with yours

[Install]
WantedBy=multi-user.target
```

Replace the environment variables with yours.

### Install as service

Run the following bash script to create a symbolic link for service unit file:

```bash
sudo ln -s /opt/phijudge/phijudge-agent.service /etc/systemd/system/phijudge-agent.service
```

### Run service

Use the following command to start the service we just created, and also setup auto-start.

```bash
sudo systemctl start phijudge-agent
sudo systemctl enable phijudge-agent
```
