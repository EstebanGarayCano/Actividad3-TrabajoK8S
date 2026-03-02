# Etapa 1: build de la app con Node
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: servir con nginx y proxy a las APIs
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Eliminar assets por defecto
RUN rm -rf ./*

# Copiar el build del Frontend
COPY --from=build /app/dist .

# Plantilla nginx (BACKEND_URL y PRODUCTOS_URL se sustituyen al arrancar)
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
