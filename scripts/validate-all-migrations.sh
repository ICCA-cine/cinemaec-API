#!/bin/bash

echo "🔍 VALIDANDO TODAS LAS MIGRACIONES..."
echo ""

# Buscar problemas comunes
echo "⚠️  Migraciones con ENUM ( - sin espacios después):"
grep -l "ENUM (" src/migrations/*.ts | wc -l
grep -n "ENUM (" src/migrations/*.ts | head -5

echo ""
echo "⚠️  Migraciones con ' array' (incorrecto):"
grep -l " array" src/migrations/*.ts | wc -l
grep -n " array" src/migrations/*.ts | head -5

echo ""
echo "⚠️  Migraciones sin IF EXISTS en DROP TYPE:"
grep -n "DROP TYPE" src/migrations/*.ts | grep -v "IF EXISTS" | head -5

echo ""
echo "✅ Migraciones con DROP CONSTRAINT IF EXISTS (correcto):"
grep -n "DROP CONSTRAINT IF EXISTS" src/migrations/*.ts | wc -l

echo ""
echo "⚠️  Migraciones sin TRY-CATCH en operaciones de constraints:"
for f in src/migrations/1769*.ts; do
  if grep -q "CONSTRAINT.*FK_\|ADD CONSTRAINT" "$f" && ! grep -q "try\|catch" "$f"; then
    echo "  - $(basename $f)"
  fi
done

