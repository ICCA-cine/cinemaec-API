#!/bin/bash

# Script para depurar problemas de migraciones localmente

set -e

echo "🔍 Depurando migraciones..."

# 1. Verificar sintaxis
echo ""
echo "1️⃣ Verificando sintaxis SQL..."
npm run migration:validate

# 2. Compilar
echo ""
echo "2️⃣ Compilando proyecto..."
npm run build

# 3. Verificar orden de migraciones
echo ""
echo "3️⃣ Listando migraciones en orden..."
ls -1 src/migrations/*.ts | sort | nl

# 4. Buscar posibles conflictos de enums
echo ""
echo "4️⃣ Verificando enums..."
echo "Buscando CREATE TYPE en migraciones:"
grep -rn "CREATE TYPE" src/migrations/ | grep -v "IF NOT EXISTS" | grep -v "CREATE TYPE IF" || echo "✅ Todos usan IF NOT EXISTS o verificaciones"

# 5. Verificar columnas duplicadas
echo ""
echo "5️⃣ Verificando ADD COLUMN..."
echo "Buscando ALTER TABLE ADD sin verificación:"
grep -rn "ALTER TABLE.*ADD \"" src/migrations/ | head -20

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Depuración completada"
echo ""
echo "💡 Para probar migraciones en una BD vacía:"
echo "   1. Inicia Docker Desktop"
echo "   2. Ejecuta: ./scripts/test-migrations.sh"
