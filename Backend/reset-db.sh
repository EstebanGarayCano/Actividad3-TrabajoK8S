#!/bin/bash
# Elimina la base SQLite del Backend para que se cree de nuevo con la tabla Usuarios.
# Ejecutar desde la carpeta Backend: ./reset-db.sh

cd "$(dirname "$0")"
rm -f proyectoesteban.db proyectoesteban.db-shm proyectoesteban.db-wal
echo "Base de datos eliminada. Reinicia el Backend con: dotnet run"
