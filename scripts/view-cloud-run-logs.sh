#!/bin/bash

# Script para ver logs de Cloud Run en tiempo real

echo "🔍 Mostrando logs de Cloud Run..."
echo ""

# Obtener logs de la última hora
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=api-cinemaec" \
  --limit=100 \
  --format="table(timestamp, severity, textPayload)" \
  --freshness=1h

echo ""
echo "💡 Para ver logs en tiempo real, ejecuta:"
echo "   gcloud logging tail 'resource.type=cloud_run_revision AND resource.labels.service_name=api-cinemaec'"
