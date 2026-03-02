# Resumen: Subir las 3 aplicaciones a Google Artifact Registry

Documentación de los pasos realizados para publicar las imágenes Docker (Backend, Productos, Frontend) en Google Artifact Registry.

---

## Requisitos previos

- Cuenta en Google Cloud
- Proyecto en GCP con Artifact Registry ya creado
- Docker instalado y en ejecución
- Repositorio Docker en Artifact Registry (ej.: `actividad3trabajok8s` en región `us-central1`)

---

## 1. Instalar Google Cloud SDK (gcloud)

**En macOS con Homebrew:**

```bash
brew install --cask google-cloud-sdk
```

Añadir al PATH (una vez por terminal o en `~/.zshrc`):

```bash
export PATH="/opt/homebrew/share/google-cloud-sdk/bin:$PATH"
echo 'export PATH="/opt/homebrew/share/google-cloud-sdk/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Comprobar instalación:

```bash
gcloud --version
```

---

## 2. Configuración inicial (una sola vez por máquina / proyecto)

### 2.1 Iniciar sesión en Google Cloud

```bash
gcloud auth login
```

Se abre el navegador para autenticarse con la cuenta de GCP.

### 2.2 Configurar Docker para Artifact Registry

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

Aceptar cuando pregunte si desea agregar la configuración. Con esto, `docker push` y `docker pull` podrán usar el registry de Google sin errores de autenticación.

*(Opcional)* Fijar el proyecto por defecto:

```bash
gcloud config set project PROJECT_ID
```

Sustituir `PROJECT_ID` por el ID del proyecto (ej.: `project-5a9e4b02-002e-455f-acc`).

---

## 3. Subir las 3 imágenes al registry

### 3.1 Dar permiso de ejecución al script (solo la primera vez)

```bash
chmod +x "/Users/danielgaray/Documents/Arquitectura de Software/Arquitectura de Software I/Proyecto Esteban/scripts/push-to-google-artifact-registry.sh"
```

### 3.2 Ejecutar el script de subida

```bash
cd "/Users/danielgaray/Documents/Arquitectura de Software/Arquitectura de Software I/Proyecto Esteban"
./scripts/push-to-google-artifact-registry.sh
```

El script:

1. Construye las imágenes: `backend`, `productos`, `frontend`
2. Las etiqueta con la URL del Artifact Registry
3. Las sube con `docker push`

### 3.3 Variables por defecto del script (este proyecto)

- **Proyecto GCP:** `project-5a9e4b02-002e-455f-acc`
- **Región:** `us-central1`
- **Repositorio:** `actividad3trabajok8s`
- **Tag:** `latest`

Para usar otro tag (ej.: `v1.0`):

```bash
export TAG=v1.0
./scripts/push-to-google-artifact-registry.sh
```

---

## 4. URLs de las imágenes en Artifact Registry

Tras una subida correcta, las imágenes quedan en:

| Aplicación | Imagen en Artifact Registry |
|------------|-----------------------------|
| Backend    | `us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest` |
| Productos  | `us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/productos:latest` |
| Frontend   | `us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest` |

Consola de GCP: **Artifact Registry** → proyecto → repositorio `actividad3trabajok8s` (región `us-central1`).

---

## 5. Resumen en checklist

- [ ] Instalar `gcloud` (Homebrew) y añadir al PATH
- [ ] `gcloud auth login`
- [ ] `gcloud auth configure-docker us-central1-docker.pkg.dev`
- [ ] `chmod +x scripts/push-to-google-artifact-registry.sh`
- [ ] `cd` a la raíz del proyecto y ejecutar `./scripts/push-to-google-artifact-registry.sh`
- [ ] Verificar las 3 imágenes en la consola de Artifact Registry

---

## 6. Descargar y ejecutar desde otro equipo

En otra máquina o en un servicio de GCP (Cloud Run, GKE, etc.):

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
docker pull us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest
docker run -p 5000:5000 \
  -e ConnectionStrings__DefaultConnection="Server=...;Database=MyDb;User=root;Password=...;Connection Timeout=5;" \
  us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest
```

*(Ajustar variables de entorno según el entorno de ejecución.)*
