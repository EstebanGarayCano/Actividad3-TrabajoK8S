# Desplegar las 3 aplicaciones en Cloud Run (Google Cloud)

Cada imagen del Artifact Registry (backend, productos, frontend) se ejecuta como un **servicio de Cloud Run**: un contenedor por servicio, con URL pública y escalado automático.

---

## Requisitos

- Imágenes ya subidas al Artifact Registry (ver `RESUMEN-PUSH-ARTIFACT-REGISTRY.md`)
- `gcloud` instalado y autenticado (`gcloud auth login`)
- Proyecto GCP con la API de Cloud Run activa (se activa al ejecutar el primer `gcloud run deploy`)

---

## Opción 1: Script automático (recomendado)

### 1. Reconstruir y subir el Frontend (solo si aún no usas la imagen con entrypoint)

El Frontend se modificó para aceptar `BACKEND_URL` y `PRODUCTOS_URL` en Cloud Run. Si tu imagen en el registry es anterior a ese cambio, reconstruye y vuelve a subir:

```bash
cd "/Users/danielgaray/Documents/Arquitectura de Software/Arquitectura de Software I/Proyecto Esteban"
docker build -t proyectoesteban-frontend:latest -f Frontend/Dockerfile Frontend
docker tag proyectoesteban-frontend:latest us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest
docker push us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest
```

### 2. Dar permiso de ejecución y ejecutar el script de despliegue

```bash
chmod +x scripts/deploy-cloud-run.sh
./scripts/deploy-cloud-run.sh
```

El script:

1. Despliega **backend** en Cloud Run (con la connection string de MySQL que tengas en `CONNECTION_STRING_MYSQL` o la por defecto).
2. Despliega **productos** en Cloud Run.
3. Obtiene las URLs de backend y productos.
4. Despliega **frontend** pasando esas URLs como variables de entorno (`BACKEND_URL`, `PRODUCTOS_URL`).

Al final muestra las 3 URLs (Frontend, Backend, Productos).

---

## Opción 2: Comandos manuales

### 1. Desplegar Backend

```bash
gcloud run deploy backend \
  --image us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "ASPNETCORE_ENVIRONMENT=Production" \
  --set-env-vars "ConnectionStrings__DefaultConnection=Server=TU_MYSQL;Port=3306;Database=MyDb;User=root;Password=xxx;Connection Timeout=5;" \
  --port 5000
```

Anota la URL que devuelve (ej: `https://backend-xxxxx-uc.a.run.app`).

### 2. Desplegar Productos

```bash
gcloud run deploy productos \
  --image us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/productos:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "ASPNETCORE_ENVIRONMENT=Production" \
  --set-env-vars "ConnectionStrings__DefaultConnection=Data Source=/tmp/productos.db" \
  --port 5001
```

Anota la URL (ej: `https://productos-xxxxx-uc.a.run.app`).

### 3. Desplegar Frontend (con las URLs de backend y productos)

Sustituye `BACKEND_URL` y `PRODUCTOS_URL` por las URLs anteriores:

```bash
gcloud run deploy frontend \
  --image us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "BACKEND_URL=https://backend-xxxxx-uc.a.run.app" \
  --set-env-vars "PRODUCTOS_URL=https://productos-xxxxx-uc.a.run.app" \
  --port 80
```

---

## Variables de entorno importantes

| Servicio   | Variable                              | Descripción |
|-----------|----------------------------------------|-------------|
| Backend   | `ConnectionStrings__DefaultConnection` | Cadena de conexión a MySQL. En producción usar Cloud SQL o IP pública. |
| Productos | `ConnectionStrings__DefaultConnection` | SQLite en `/tmp/productos.db` (efímero; se pierde al reiniciar el servicio). |
| Frontend  | `BACKEND_URL`                          | URL del servicio backend en Cloud Run (ej: `https://backend-xxx.run.app`). |
| Frontend  | `PRODUCTOS_URL`                        | URL del servicio productos en Cloud Run. |

---

## Notas

- **MySQL:** Cloud Run no puede usar `host.docker.internal`. Para producción conecta el Backend a **Cloud SQL** (MySQL en GCP) y pasa la connection string en `ConnectionStrings__DefaultConnection`.
- **Productos:** La base SQLite en `/tmp` no persiste entre reinicios. Para datos persistentes se puede usar Cloud SQL u otro almacén.
- **CORS:** Si el frontend y las APIs están en dominios distintos, puede ser necesario configurar CORS en Backend y Productos para la URL del frontend en Cloud Run.
