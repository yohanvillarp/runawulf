#!/bin/bash

# Verifica si es root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Por favor ejecuta este script con sudo:"
  echo "   sudo ./setup.sh"
  exit 1
fi

echo "🔍 Verificando versión de npm..."
npm -v || {
  echo "❌ npm no está instalado. Abortando..."
  exit 1
}

echo "⬆️ Intentando actualizar npm a la última versión..."
npm install -g npm@latest || {
  echo "⚠️ No se pudo actualizar npm. Continuando con la versión actual..."
}

echo "🔧 Instalando dependencias del backend..."
npm install || {
  echo "❌ Error al instalar dependencias. Revisa tu conexión o tu archivo package.json."
  exit 1
}

echo "🛠️ Otorgando permisos a los scripts..."
if [ -d scripts ]; then
  chmod +x scripts/*.sh
else
  echo "⚠️ Carpeta 'scripts' no encontrada en backend, omitiendo permisos."
fi

echo "✅ Configuración completa."

echo "🚀 Iniciando el backend con nodemon:"
npx nodemon || {
  echo "❌ nodemon no está disponible. ¿Está instalado en las dependencias?"
}