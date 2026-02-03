#!/bin/bash

# Script para envolver DROP CONSTRAINT sin IF EXISTS en TRY-CATCH

files=(
  "src/migrations/1769623098782-CreateSubgenreAndMovieSubgenreRelation.ts"
  "src/migrations/1769623775047-ConvertAssetIdColumnsToManyToOneRelations.ts"
  "src/migrations/1769624150019-AddOwnerRelationships.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # Buscar líneas con ALTER TABLE DROP CONSTRAINT sin IF EXISTS
    grep -n "DROP CONSTRAINT" "$file" | grep -v "IF EXISTS" || echo "No encontrados"
  fi
done
