# Proyecto Esteban

Aplicación de gestión de usuarios con **frontend en React** y **backend en C# (ASP.NET Core)**, usando **SQL Server** como base de datos.

## Requisitos

- **.NET 10 SDK** (o la versión que tengas instalada para compilar localmente)
- **Node.js 18+** y **npm** – para el frontend
- **SQL Server** (LocalDB, Express o completo) – para la base de datos

## Estructura del proyecto

```
Proyecto Esteban/
├── Backend/          # Microservicio de usuarios y autenticación (puerto 5000)
├── Productos/        # Microservicio de productos (puerto 5001)
├── Frontend/         # React + Vite
├── docker-compose.yml
└── README.md
```

## Configuración de la base de datos

En `Backend/appsettings.json` (o `appsettings.Development.json`) ajusta la cadena de conexión si no usas SQL Server en localhost:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ProyectoEstebanDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

- **Server**: nombre de tu instancia de SQL Server (por ejemplo `localhost`, `.\SQLEXPRESS`, `(localdb)\MSSQLLocalDB`).
- La base de datos `ProyectoEstebanDb` se crea automáticamente la primera vez que ejecutas el backend.

## Ejecutar el backend (C#)

```bash
cd Backend
dotnet run
```

La API quedará en **http://localhost:5000**. La documentación Swagger en **http://localhost:5000/swagger**.

## Ejecutar el frontend (React)

```bash
cd Frontend
npm install
npm run dev
```

La aplicación quedará en **http://localhost:5173**. Las peticiones a `/api` se redirigen al backend (puerto 5000) mediante el proxy de Vite.

## Funcionalidad

- **Registro de usuarios**: nombre, apellido, email, nombre de usuario y contraseña (almacenada con hash BCrypt).
- **Inicio de sesión**: autenticación por nombre de usuario y contraseña.
- **Listado de usuarios**: tabla con todos los usuarios (requiere estar autenticado).
- **Alta de usuarios** (modal): crear nuevos usuarios desde la pantalla de listado.
- **Edición y eliminación** de usuarios desde la misma pantalla.

## API principal

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | `/api/auth/registro` | Registrar usuario |
| POST   | `/api/auth/login`    | Iniciar sesión   |
| GET    | `/api/usuarios`      | Listar usuarios  |
| POST   | `/api/usuarios`      | Crear usuario    |
| PUT    | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario |

## Migraciones con Entity Framework

Este proyecto está configurado para usar **migraciones** de Entity Framework (`Database.MigrateAsync()` se ejecuta al arrancar).

1. Instalar la herramienta global:  
   `dotnet tool install --global dotnet-ef`
2. En la carpeta `Backend`:  
   `dotnet ef migrations add InitialCreate`  
   `dotnet ef database update`

En desarrollo en macOS se usa, por defecto, **SQLite** con el archivo `proyectoesteban.db` (ver `appsettings.Development.json`).  
En producción / Docker se usa **SQL Server** mediante la cadena de conexión configurada.

## Microservicio de usuarios y autenticación (Docker)

El proyecto `Backend` actúa como **microservicio de usuarios/autenticación**.

Para levantarlo en Docker junto con SQL Server:

```bash
cd "Proyecto Esteban"
docker compose up --build
```

Servicios:

- `authservice` (usuarios y autenticación) en `http://localhost:5000`
- `productos` (gestión de productos) en `http://localhost:5001`
- `sqlserver` (SQL Server 2022 en contenedor, solo para auth)

La cadena de conexión de cada microservicio se define en `docker-compose.yml`.

---

## Menú y Productos (Frontend)

Tras autenticarse, el menú incluye:

- **Usuarios**: listado y gestión de usuarios.
- **1. Producto**
  - **1.1 Listar Productos**: tabla con todos los productos.
  - **1.2 Agregar productos**: formulario para crear productos.

El microservicio **Productos** expone:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/api/productos`     | Listar productos |
| GET    | `/api/productos/{id}`| Obtener producto |
| POST   | `/api/productos`     | Agregar producto |
