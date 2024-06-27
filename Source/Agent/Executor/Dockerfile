FROM mcr.microsoft.com/dotnet/runtime:8.0-alpine AS base
# USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Executor/Executor.csproj", "Executor/"]
COPY ["PluginAPI/PluginAPI.csproj", "PluginAPI/"]
RUN dotnet restore "./Executor/Executor.csproj"
COPY . .
WORKDIR "/src/Executor"
RUN dotnet build "./Executor.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Executor.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=true

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Executor.dll"]