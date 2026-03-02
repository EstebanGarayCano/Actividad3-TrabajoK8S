#!/bin/sh
# Sustituye BACKEND_URL y PRODUCTOS_URL en la plantilla nginx y arranca nginx.
# En Cloud Run se pasan como variables de entorno.
set -e
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
PRODUCTOS_URL="${PRODUCTOS_URL:-http://localhost:5001}"
sed "s|\${BACKEND_URL}|$BACKEND_URL|g; s|\${PRODUCTOS_URL}|$PRODUCTOS_URL|g" \
  /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
