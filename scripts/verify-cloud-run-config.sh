#!/bin/bash

# Script para verificar la configuración real de Cloud Run

echo "🔍 Verificando configuración de Cloud Run..."
echo ""

# Variables
PROJECT_ID="cinema-ec"
SERVICE_NAME="api-cinemaec"
REGION="us-central1"

echo "📋 Información del servicio Cloud Run:"
gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format="yaml(spec.template.spec.containers[0].ports,spec.template.metadata.annotations)" 2>/dev/null || echo "❌ No se pudo conectar a Cloud Run (necesita gcloud CLI configurado)"

echo ""
echo "🔧 Variables de entorno en la revisión actual:"
gcloud run revisions list --service=$SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format="table(name,status)" 2>/dev/null | head -5 || echo "❌ No disponible"

echo ""
echo "📝 Verificación de puerto en cloud-run.yaml:"
grep -A 2 "containerPort" cloud-run.yaml 2>/dev/null || echo "❌ Archivo no encontrado"

echo ""
echo "✅ Verificación completa"
echo ""
echo "Si todo está correcto:"
echo "  - containerPort en cloud-run.yaml: 8080"
echo "  - startupProbe.tcpSocket.port: 8080"
echo "  - Dockerfile EXPOSE: 8080"
echo "  - app.listen() usa: process.env.PORT || 8080"
