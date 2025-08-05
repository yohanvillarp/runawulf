#!/bin/bash

# ================================================
# 🚀 Script de configuración del backend
# ================================================

echo
echo "🔍 Verificando versión de npm..."
echo "--------------------------------"
npm -v || {
  echo
  echo "❌ npm no está instalado. Abortando..."
  echo
  exit 1
}

echo
echo "🔧 Instalando dependencias del backend..."
echo "-----------------------------------------"
npm install || {
  echo
  echo "❌ Error al instalar dependencias. Revisa tu conexión o tu archivo package.json."
  echo
  exit 1
}

echo
echo "🛠️ Otorgando permisos a los scripts..."
echo "-------------------------------------"
if [ -d scripts ]; then
  chmod +x scripts/*.sh
  echo "✅ Permisos asignados a los scripts."
else
  echo "⚠️ Carpeta 'scripts' no encontrada, omitiendo permisos."
fi

echo
echo "✅ Configuración completa."
echo "=========================="
echo
echo -e "\e[1;32m🚀 Ahora puedes ejecutar:\e[0m"
echo -e "\e[1;32m   npm run dev\e[0m"
echo