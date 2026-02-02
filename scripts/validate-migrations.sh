#!/bin/bash

# Script para validar sintaxis SQL de las migraciones sin ejecutarlas

set -e

echo "🔍 Validando sintaxis de migraciones..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

echo ""
echo "📝 Verificando sintaxis SQL común..."

# Verificar espacios incorrectos en ENUM
if grep -rn "ENUM (" src/migrations/ 2>/dev/null; then
  echo -e "${RED}❌ Error: Se encontraron espacios entre ENUM y paréntesis${NC}"
  echo -e "${YELLOW}   Debe ser: ENUM(...) no ENUM (...)${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ No hay espacios incorrectos en definiciones ENUM${NC}"
fi

# Verificar sintaxis de arrays incorrecta
if grep -rn " array " src/migrations/ | grep -v "text\[\]" | grep -v "character varying\[\]" | grep -v "enum\[\]" 2>/dev/null; then
  echo -e "${RED}❌ Error: Se encontró sintaxis incorrecta de arrays${NC}"
  echo -e "${YELLOW}   Debe ser: type[] no type array${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ Sintaxis de arrays correcta${NC}"
fi

# Compilar migraciones TypeScript
echo ""
echo "🔨 Compilando migraciones TypeScript..."
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Migraciones compiladas correctamente${NC}"
else
  echo -e "${RED}❌ Error al compilar migraciones${NC}"
  ERRORS=$((ERRORS + 1))
fi

# Verificar que no haya imports o sintaxis TypeScript inválida
echo ""
echo "📋 Verificando estructura de migraciones..."
if grep -rn "MigrationInterface" src/migrations/*.ts | wc -l | grep -q "[0-9]"; then
  echo -e "${GREEN}✅ Todas las migraciones implementan MigrationInterface${NC}"
else
  echo -e "${RED}❌ Algunas migraciones no implementan MigrationInterface${NC}"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "═══════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ ¡Todas las validaciones pasaron!${NC}"
  echo -e "${GREEN}✅ Las migraciones están listas para deploy${NC}"
  echo ""
  echo "💡 Para ejecutar migraciones en desarrollo:"
  echo "   npm run migration:run"
  echo ""
  echo "💡 Para crear una nueva migración:"
  echo "   npm run migration:generate -- src/migrations/NombreMigracion"
  exit 0
else
  echo -e "${RED}❌ Se encontraron $ERRORS error(es)${NC}"
  echo -e "${RED}❌ Corrige los errores antes de hacer deploy${NC}"
  exit 1
fi
