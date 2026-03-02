# Despliegue inicial en Kubernetes (GKE) en GCP

Guía para desplegar las 3 aplicaciones (backend, productos, frontend) en Google Kubernetes Engine usando las imágenes del Artifact Registry. No se modifica el código del proyecto.

---

## Requisitos

- Proyecto GCP con las 3 imágenes en Artifact Registry (`actividad3trabajok8s` en `us-central1`).
- `gcloud` y `kubectl` instalados.

---

## Paso 1: Activar la API de Kubernetes Engine

```bash
gcloud config set project project-5a9e4b02-002e-455f-acc
gcloud services enable container.googleapis.com
```

---

## Paso 2: Crear un clúster GKE

```bash
gcloud container clusters create proyecto-esteban-cluster \
  --region us-central1 \
  --num-nodes 1 \
  --machine-type e2-small \
  --enable-autoscaling --min-nodes 1 --max-nodes 3
```

Tardará unos minutos. Para usar un clúster ya existente, omite este paso.

---

## Paso 3: Conectar kubectl al clúster

```bash
gcloud container clusters get-credentials proyecto-esteban-cluster --region us-central1
kubectl get nodes
```

---

## Paso 4: Permitir que el clúster pueda leer Artifact Registry

El nodo de GKE debe poder hacer pull de las imágenes. Asigna el rol de lector de Artifact Registry a la cuenta de servicio de los nodos:

```bash
# Obtener la cuenta de servicio del nodo (por defecto)
PROJECT_ID=project-5a9e4b02-002e-455f-acc
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/artifactregistry.reader"
```

---

## Paso 5: Crear namespace (opcional)

```bash
kubectl create namespace proyecto-esteban
kubectl config set-context --current --namespace=proyecto-esteban
```

Si no creas namespace, se usará `default`. En los YAML siguientes se puede sustituir `default` por `proyecto-esteban` si lo usas.

---

## Paso 6: Crear Secret con la connection string de MySQL (backend)

Sustituir `TU_CONNECTION_STRING` por tu cadena de conexión real (Cloud SQL o MySQL).

```bash
kubectl create secret generic backend-secret \
  --from-literal=ConnectionStrings__DefaultConnection='TU_CONNECTION_STRING' \
  -n default
```

Para usar namespace `proyecto-esteban` añadir: `-n proyecto-esteban`.

---

## Paso 7: Aplicar los manifiestos de Kubernetes

Crear un archivo (por ejemplo `k8s-deploy.yaml`) con el siguiente contenido y sustituir `TU_CONNECTION_STRING` en el Secret si no lo creaste en el paso 6. Las imágenes apuntan a tu Artifact Registry.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
stringData:
  ConnectionStrings__DefaultConnection: "Server=TU_MYSQL;Database=MyDb;User=root;Password=xxx;Connection Timeout=5;"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        envFrom:
        - secretRef:
            name: backend-secret
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - port: 5000
    targetPort: 5000
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: productos
spec:
  replicas: 1
  selector:
    matchLabels:
      app: productos
  template:
    metadata:
      labels:
        app: productos
    spec:
      containers:
      - name: productos
        image: us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/productos:latest
        ports:
        - containerPort: 5001
        env:
        - name: ConnectionStrings__DefaultConnection
          value: "Data Source=/tmp/productos.db"
---
apiVersion: v1
kind: Service
metadata:
  name: productos
spec:
  selector:
    app: productos
  ports:
  - port: 5001
    targetPort: 5001
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: us-central1-docker.pkg.dev/project-5a9e4b02-002e-455f-acc/actividad3trabajok8s/frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: BACKEND_URL
          value: "http://backend:5000"
        - name: PRODUCTOS_URL
          value: "http://productos:5001"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

Aplicar (desde la carpeta donde guardaste el archivo):

```bash
kubectl apply -f k8s-deploy.yaml
```

Si creaste el Secret en el paso 6, quita del YAML el bloque `Secret` (las líneas de `apiVersion: v1` hasta el primer `---` del Deployment de backend) y vuelve a aplicar solo los Deployments y Services.

---

## Paso 8: Comprobar el despliegue

```bash
kubectl get pods
kubectl get services
```

Esperar a que el servicio `frontend` tenga una **EXTERNAL-IP** (puede tardar 1–2 minutos).

```bash
kubectl get service frontend -w
```

Cuando aparezca la IP, la aplicación se puede abrir en el navegador en `http://EXTERNAL-IP`.

---

## Paso 9: Acceso a la aplicación

- **Frontend (interfaz de usuario):** `http://<EXTERNAL-IP del servicio frontend>`
- **Backend (API):** solo accesible desde dentro del clúster (`http://backend:5000`) salvo que expongas también el servicio backend con LoadBalancer o Ingress.
- **Productos (API):** igual, interno (`http://productos:5001`) salvo que lo expongas.

Para exponer backend y productos con URLs públicas se puede añadir después un Ingress o más servicios tipo LoadBalancer.

---

## Comandos útiles

```bash
# Ver pods
kubectl get pods

# Ver logs del backend
kubectl logs -l app=backend -f

# Reiniciar un deployment
kubectl rollout restart deployment backend
```

---

## Eliminar el clúster (al terminar pruebas)

```bash
gcloud container clusters delete proyecto-esteban-cluster --region us-central1
```
