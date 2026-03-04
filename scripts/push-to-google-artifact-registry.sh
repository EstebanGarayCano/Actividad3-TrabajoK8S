#!/bin/bash
# Sube las 3 imágenes del proyecto (backend, productos, frontend) a Google Artifact Registry.
#
# Requisitos:
#   - gcloud CLI instalado y autenticado (gcloud auth login)
#   - Docker en marcha
#   - Haber ejecutado una vez: gcloud auth configure-docker REGION-docker.pkg.dev
#
# Uso:
#   export GCP_PROJECT_ID=mi-proyecto
#   export GCP_REGION=us-central1
#   ./scripts/push-to-google-artifact-registry.sh
#
# Opcional: REPO_NAME (default: proyecto-esteban), TAG (default: latest)

set -e

GCP_PROJECT_ID="${GCP_PROJECT_ID:-project-5a9e4b02-002e-455f-acc}"
GCP_REGION="${GCP_REGION:-us-central1}"
REPO_NAME="${REPO_NAME:-actividad3trabajok8s}"
TAG="${TAG:-latest}"

if [ -z "$GCP_PROJECT_ID" ]; then
  echo "Error: define GCP_PROJECT_ID (tu proyecto de Google Cloud)."
  echo "  export GCP_PROJECT_ID=mi-proyecto-id"
  exit 1
fi

REGISTRY="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO_NAME}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Registro: $REGISTRY"
echo "Tag:      $TAG"
echo "Raíz:     $ROOT_DIR"
echo ""

cd "$ROOT_DIR"

# Build para linux/amd64 (GKE / Cloud Run). En Mac M1/M2 evita "no match for platform in manifest".
PLATFORM="linux/amd64"

# Build y push Backend
echo ">>> Build Backend ($PLATFORM)..."
docker build --platform $PLATFORM -t proyectoesteban-backend:$TAG -f Backend/Dockerfile Backend
docker tag proyectoesteban-backend:$TAG $REGISTRY/backend:$TAG
echo ">>> Push Backend..."
docker push $REGISTRY/backend:$TAG

# Build y push Productos
echo ">>> Build Productos ($PLATFORM)..."
docker build --platform $PLATFORM -t proyectoesteban-productos:$TAG -f Productos/Dockerfile Productos
docker tag proyectoesteban-productos:$TAG $REGISTRY/productos:$TAG
echo ">>> Push Productos..."
docker push $REGISTRY/productos:$TAG

# Build y push Frontend
echo ">>> Build Frontend ($PLATFORM)..."
docker build --platform $PLATFORM -t proyectoesteban-frontend:$TAG -f Frontend/Dockerfile Frontend
docker tag proyectoesteban-frontend:$TAG $REGISTRY/frontend:$TAG
echo ">>> Push Frontend..."
docker push $REGISTRY/frontend:$TAG

echo ""
echo "Listo. Imágenes en Artifact Registry:"
echo "  $REGISTRY/backend:$TAG"
echo "  $REGISTRY/productos:$TAG"
echo "  $REGISTRY/frontend:$TAG"
