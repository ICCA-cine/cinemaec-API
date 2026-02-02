#!/bin/bash

# Script para probar migraciones en una base de datos temporal con Docker

set -e

echo "🚀 Iniciando prueba de migraciones..."

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Nombre del contenedor temporal
CONTAINER_NAME="cinemaec-test-db-$$"

# Detener y limpiar en caso de error
cleanup() {
  echo -e "${YELLOW}🧹 Limpiando contenedor de prueba...${NC}"
  docker stop $CONTAINER_NAME 2>/dev/null || true
  docker rm $CONTAINER_NAME 2>/dev/null || true
}

# Registrar cleanup para ejecutarse al salir
trap cleanup EXIT

echo "📦 Creando base de datos PostgreSQL temporal..."
docker run --name $CONTAINER_NAME \
  -e POSTGRES_PASSWORD=test123 \
  -e POSTGRES_USER=test \
  -e POSTGRES_DB=cinemaec_test \
  -p 5433:5432 \
  -d postgres:15-alpine

echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 5

# Verificar que PostgreSQL está respondiendo
until docker exec $CONTAINER_NAME pg_isready -U test; do
  echo "Esperando PostgreSQL..."
  sleep 2
done

echo -e "${GREEN}✅ PostgreSQL está listo${NC}"

# Crear archivo .env temporal para las pruebas
cat > .env.test.temp << EOF
DATABASE_URL=postgresql://test:test123@localhost:5433/cinemaec_test
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=test
DB_PASSWORD=test123
DB_NAME=cinemaec_test
NODE_ENV=test
EOF

echo "🔄 Ejecutando migraciones..."
if NODE_ENV=test DATABASE_URL=postgresql://test:test123@localhost:5433/cinemaec_test npm run migration:run; then
  echo -e "${GREEN}✅ ¡Todas las migraciones se ejecutaron correctamente!${NC}"
  echo -e "${GREEN}✅ Las migraciones están listas para producción${NC}"
  rm .env.test.temp
  exit 0
else
  echo -e "${RED}❌ Error al ejecutar migraciones${NC}"
  echo -e "${RED}❌ Revisa el error anterior antes de hacer deploy${NC}"
  rm .env.test.temp
  exit 1
fi
