# Resumen: Comandos Artifact Registry y Cloud Run

Solo comandos. Proyecto: `project-5a9e4b02-002e-455f-acc`, región: `us-central1`, repositorio: `actividad3trabajok8s`.

---

## 1. Configuración inicial (una vez)

```bash
gcloud config set project project-5a9e4b02-002e-455f-acc
gcloud auth configure-docker us-central1-docker.pkg.dev
```

---

## 2. Construir imágenes para Cloud Run (linux/amd64) y subir a Artifact Registry

```bash
cd "/Users/danielgaray/Documents/Arquitectura de Software/Arquitectura de Software I/Proyecto Esteban"

docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest -f Backend/Dockerfile Backend
docker push us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest

docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/productos:latest -f Productos/Dockerfile Productos
docker push us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/productos:latest

docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest -f Frontend/Dockerfile Frontend
docker push us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest
```

---

## 3. Desplegar en Cloud Run

Sustituir `CONNECTION_STRING_MYSQL` por tu cadena de conexión (Cloud SQL o la que uses). Para frontend, usar las URLs que devuelvan los deploys de backend y productos.

```bash
gcloud config set project project-5a9e4b02-002e-455f-acc

gcloud run deploy backend --image us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest --region us-central1 --platform managed --allow-unauthenticated --set-env-vars "ConnectionStrings__DefaultConnection=CONNECTION_STRING_MYSQL" --port 5000

gcloud run deploy productos --image us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/productos:latest --region us-central1 --platform managed --allow-unauthenticated --set-env-vars "ConnectionStrings__DefaultConnection=Data Source=/tmp/productos.db" --port 5001

gcloud run deploy frontend --image us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest --region us-central1 --platform managed --allow-unauthenticated --set-env-vars "BACKEND_URL=https://backend-644008958069.us-central1.run.app" --set-env-vars "PRODUCTOS_URL=https://productos-XXXXX.us-central1.run.app" --port 80
```

Obtener URLs de backend y productos antes de desplegar frontend:

```bash
gcloud run services describe backend --region us-central1 --format 'value(status.url)'
gcloud run services describe productos --region us-central1 --format 'value(status.url)'
```

Usar esas URLs en `BACKEND_URL` y `PRODUCTOS_URL` del deploy de frontend.

---

## 4. Ejemplo con connection string Cloud SQL (backend)

Si usas Cloud SQL con conexión por socket (reemplazar `PROYECTO:REGION:INSTANCIA` por tu connection name):

```bash
gcloud run deploy backend --image us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest --region us-central1 --platform managed --allow-unauthenticated --add-cloudsql-instances PROYECTO:REGION:INSTANCIA --set-env-vars "ConnectionStrings__DefaultConnection=Server=localhost;Database=MyDb;Uid=root;Pwd=TU_PASSWORD;Protocol=unix;SslMode=none;" --port 5000
```

---

## Orden recomendado

1. Ejecutar sección 1 (configuración).
2. Ejecutar sección 2 (build y push).
3. Desplegar backend (sección 3), anotar su URL.
4. Desplegar productos (sección 3), anotar su URL.
5. Desplegar frontend con `BACKEND_URL` y `PRODUCTOS_URL` de los pasos 3 y 4.
