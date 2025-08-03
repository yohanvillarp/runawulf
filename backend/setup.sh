#!/bin/bash

# Verifica si es root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Por favor ejecuta este script con sudo:"
  echo "   sudo ./setup.sh"
  exit 1
fi

echo "📁 Cambiando al directorio del backend..."
cd backend || { echo "❌ No se encontró la carpeta 'backend'"; exit 1; }

echo "🔧 Instalando dependencias del backend..."
npm install

echo "📁 Cambiando al directorio del frontend..."
cd ../frontend || { echo "❌ No se encontró la carpeta 'frontend'"; exit 1; }

echo "🔧 Instalando dependencias del frontend..."
npm install

echo "🛠️ Otorgando permisos a los scripts..."
cd ../backend
if [ -d scripts ]; then
  chmod +x scripts/*.sh
else
  echo "⚠️ Carpeta 'scripts' no encontrada en backend, omitiendo permisos."
fi

echo "✅ Configuración completa."

echo "🚀 Iniciando el backend con nodemon:"
npx nodemon
