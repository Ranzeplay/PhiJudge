FROM mcr.microsoft.com/dotnet/runtime:9.0-alpine AS base
# USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Executor/PhiJudge.Agent.Executor.csproj", "Executor/"]
COPY ["PluginAPI/PhiJudge.Agent.PluginAPI.csproj", "PluginAPI/"]
RUN dotnet restore "./Executor/PhiJudge.Agent.Executor.csproj"
COPY . .
WORKDIR "/src/Executor"
RUN dotnet build "./PhiJudge.Agent.Executor.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./PhiJudge.Agent.Executor.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PhiJudge.Agent.Executor.dll"]
