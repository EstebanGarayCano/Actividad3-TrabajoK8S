FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Productos.csproj", "./"]
RUN dotnet restore "Productos.csproj"

COPY . .
RUN dotnet build "Productos.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Productos.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://+:5001
ENTRYPOINT ["dotnet", "Productos.dll"]
