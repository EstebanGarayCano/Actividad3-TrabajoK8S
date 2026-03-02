#!/bin/bash
# Despliega las 3 imágenes del Artifact Registry en Cloud Run.
# Ejecutar después de haber subido las imágenes con push-to-google-artifact-registry.sh
#
# Requisitos: gcloud auth login, gcloud auth configure-docker us-central1-docker.pkg.dev
#
# Uso:
#   export GCP_PROJECT_ID=project-5a9e4b02-002e-455f-acc
#   export GCP_REGION=us-central1
#   ./scripts/deploy-cloud-run.sh
#
# Opcional: CONNECTION_STRING_MYSQL (para Backend), REPO_NAME (default: actividad3trabajok8s)

set -e

GCP_PROJECT_ID="${GCP_PROJECT_ID:-project-5a9e4b02-002e-455f-acc}"
GCP_REGION="${GCP_REGION:-us-central1}"
REPO_NAME="${REPO_NAME:-actividad3trabajok8s}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
CONNECTION_STRING_MYSQL="${CONNECTION_STRING_MYSQL:-Server=host.docker.internal;Port=3306;Database=MyDb;User=root;Password=12345;Connection Timeout=5;}"

REGISTRY="${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${REPO_NAME}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Proyecto:  $GCP_PROJECT_ID"
echo "Región:    $GCP_REGION"
echo "Registry:  $REGISTRY"
echo ""

cd "$ROOT_DIR"

# 1. Desplegar Backend
echo ">>> Desplegando Backend en Cloud Run..."
gcloud run deploy backend \
  --image "$REGISTRY/backend:$IMAGE_TAG" \
  --region "$GCP_REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "ASPNETCORE_ENVIRONMENT=Production" \
  --set-env-vars "ConnectionStrings__DefaultConnection=$CONNECTION_STRING_MYSQL" \
  --port 5000

BACKEND_URL=$(gcloud run services describe backend --region "$GCP_REGION" --format 'value(status.url)')
echo "    Backend URL: $BACKEND_URL"
echo ""

# 2. Desplegar Productos
echo ">>> Desplegando Productos en Cloud Run..."
gcloud run deploy productos \
  --image "$REGISTRY/productos:$IMAGE_TAG" \
  --region "$GCP_REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "ASPNETCORE_ENVIRONMENT=Production" \
  --set-env-vars "ConnectionStrings__DefaultConnection=Data Source=/tmp/productos.db" \
  --port 5001

PRODUCTOS_URL=$(gcloud run services describe productos --region "$GCP_REGION" --format 'value(status.url)')
echo "    Productos URL: $PRODUCTOS_URL"
echo ""

# 3. Desplegar Frontend (usa las URLs de Backend y Productos)
echo ">>> Desplegando Frontend en Cloud Run..."
gcloud run deploy frontend \
  --image "$REGISTRY/frontend:$IMAGE_TAG" \
  --region "$GCP_REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "BACKEND_URL=$BACKEND_URL" \
  --set-env-vars "PRODUCTOS_URL=$PRODUCTOS_URL" \
  --port 80

FRONTEND_URL=$(gcloud run services describe frontend --region "$GCP_REGION" --format 'value(status.url)')
echo "    Frontend URL: $FRONTEND_URL"
echo ""
echo "=== Despliegue completado ==="
echo "  Frontend (SPA):  $FRONTEND_URL"
echo "  Backend (API):   $BACKEND_URL"
echo "  Productos (API): $PRODUCTOS_URL"
echo ""
echo "Nota: Backend necesita MySQL. En producción configura CONNECTION_STRING_MYSQL"
echo "      apuntando a Cloud SQL o tu instancia MySQL accesible desde Cloud Run."
