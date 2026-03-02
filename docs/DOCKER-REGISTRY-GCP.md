# Subir las imágenes Docker a Google Artifact Registry

Esta guía explica **qué es** un registry, **para qué sirve** y **qué hace cada paso** al subir el proyecto.

---

## ¿Qué es un "registry" de Docker?

Un **registry** (registro) es un **almacén de imágenes Docker** en internet. Es parecido a un repositorio de código (como GitHub), pero en lugar de guardar archivos de código, guarda **imágenes** listas para ejecutar (tu Backend, Productos y Frontend empaquetados con Docker).

- **En tu máquina:** construyes las imágenes con `docker build` y las ejecutas con `docker run`.
- **En el registry:** subes esas mismas imágenes con `docker push` para que **cualquier persona o servicio** (otra PC, un servidor, Cloud Run, Kubernetes) pueda **descargarlas** con `docker pull` y ejecutarlas sin tener tu código fuente.

**Resumen:** subir al registry = publicar tu aplicación empaquetada en Docker para poder usarla desde la nube o desde otros equipos.

---

## ¿Qué es Google Artifact Registry?

Es el **servicio de Google Cloud** donde puedes guardar imágenes Docker (y otros artefactos). Antes Google tenía “Container Registry”; ahora el estándar es **Artifact Registry**: mismo concepto, servicio más moderno y con más opciones (regiones, permisos, etc.).

---

## Pasos explicados (configuración inicial, una sola vez)

### Paso 1: Iniciar sesión y elegir proyecto

```bash
gcloud auth login
gcloud config set project TU_PROJECT_ID
```

- **`gcloud auth login`:** abre el navegador para que inicies sesión con tu cuenta de Google Cloud. Así la terminal puede usar tu cuenta para acceder a tus proyectos.
- **`gcloud config set project TU_PROJECT_ID`:** indica en **qué proyecto** de GCP quieres trabajar (cada proyecto tiene su facturación y sus recursos). Sin esto, los comandos siguientes no sabrían a qué proyecto subir las imágenes.

**TU_PROJECT_ID** = el ID de tu proyecto en la consola de Google Cloud (ej: `mi-proyecto-123`).

---

### Paso 2: Activar la API de Artifact Registry

```bash
gcloud services enable artifactregistry.googleapis.com
```

En Google Cloud, cada servicio (Artifact Registry, BigQuery, etc.) está controlado por una **API**. Para poder crear repositorios y subir imágenes, esa API tiene que estar **activada** en tu proyecto. Este comando hace exactamente eso: activa el servicio de Artifact Registry en el proyecto que elegiste en el paso 1.

---

### Paso 3: Crear el repositorio Docker

```bash
gcloud artifacts repositories create proyecto-esteban \
  --repository-format=docker \
  --location=us-central1 \
  --description="Imágenes Proyecto Esteban"
```

Aquí **creas el “contenedor”** donde vivirán tus imágenes dentro de Artifact Registry:

- **`proyecto-esteban`:** nombre del repositorio (como una carpeta donde irán backend, productos y frontend).
- **`--repository-format=docker`:** indica que guardarás imágenes Docker (Artifact Registry también puede guardar otros tipos de artefactos).
- **`--location=us-central1`:** la **región** (datacenter) donde se guardará el repositorio. Puedes cambiarla (ej: `southamerica-east1` para São Paulo) según dónde quieras que estén los datos.

Solo necesitas crear este repositorio **una vez** por proyecto/región.

---

### Paso 4: Configurar Docker para que pueda subir a ese registry

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

Cuando haces `docker push`, Docker tiene que **autenticarse** contra el registry de Google. Este comando:

- Configura tu instalación local de Docker para que reconozca el dominio `us-central1-docker.pkg.dev` (o la región que uses) como registry de Google.
- Asocia las credenciales de tu cuenta (`gcloud auth login`) para que `docker push` y `docker pull` funcionen sin pedir usuario/contraseña a mano.

Sin este paso, `docker push` al Artifact Registry fallaría por falta de autenticación.

---

## Subir las imágenes (cada vez que quieras publicar)

```bash
export GCP_PROJECT_ID=tu-proyecto-id
export GCP_REGION=us-central1
chmod +x scripts/push-to-google-artifact-registry.sh
./scripts/push-to-google-artifact-registry.sh
```

El script:

1. **Construye** las 3 imágenes (backend, productos, frontend) con `docker build`.
2. **Etiqueta** cada imagen con la URL completa del registry, por ejemplo:  
   `us-central1-docker.pkg.dev/tu-proyecto-id/proyecto-esteban/backend:latest`
3. **Sube** cada una con `docker push` a Artifact Registry.

Después de esto, las imágenes están **guardadas en la nube** y se pueden descargar con `docker pull` desde cualquier sitio que tenga acceso a tu proyecto (otra máquina, Cloud Run, GKE, etc.).

---

## Resumen del flujo

| Paso | Qué haces | Para qué sirve |
|------|-----------|----------------|
| 1 | `gcloud auth login` y `config set project` | Identificarte y elegir el proyecto de GCP. |
| 2 | `gcloud services enable artifactregistry...` | Activar el servicio de Artifact Registry en ese proyecto. |
| 3 | `gcloud artifacts repositories create...` | Crear el “repositorio” donde se guardarán las imágenes. |
| 4 | `gcloud auth configure-docker ...` | Permitir que tu Docker local suba y baje imágenes a ese registry. |
| 5 | Ejecutar el script `push-to-google-artifact-registry.sh` | Construir, etiquetar y subir backend, productos y frontend al registry. |

Los pasos 1–4 son **configuración inicial (una vez)**. El paso 5 lo repites **cada vez que quieras publicar** una nueva versión de tus contenedores en Google Cloud.
