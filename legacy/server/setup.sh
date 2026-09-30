#!/bin/bash

# ================================================
# 🚀 Script de configuración del backend
# ================================================

# Definición de colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo
echo -e "${CYAN}🔍 Verificando versión de npm...${NC}"
echo "--------------------------------"
npm -v || {
  echo
  echo -e "${RED}npm no está instalado. Abortando...${NC}"
  echo
  exit 1
}

echo
echo -e "${YELLOW}Instalando dependencias del backend...${NC}"
echo "-----------------------------------------"
npm install || {
  echo
  echo -e "${RED}Error al instalar dependencias. Revisa tu conexión o tu archivo package.json.${NC}"
  echo
  exit 1
}

echo
echo -e "${MAGENTA}🛠 Otorgando permisos a los scripts...${NC}"
echo "-------------------------------------"
SCRIPTS_DIR="scripts"

if [ -d "$SCRIPTS_DIR" ]; then
  # Buscar todos los .sh recursivamente
  sh_files=($(find "$SCRIPTS_DIR" -type f -name "*.sh"))
  
  if [ ${#sh_files[@]} -gt 0 ]; then
    chmod +x "${sh_files[@]}"
    echo -e "${GREEN}✅ Permisos asignados a todos los scripts.${NC}"
  else
    echo -e "${YELLOW}⚠ No hay scripts en la carpeta '$SCRIPTS_DIR'.${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Carpeta '$SCRIPTS_DIR' no encontrada, omitiendo permisos.${NC}"
fi
echo
echo -e "${CYAN}Instalando paquetes necesarios...${NC}"
echo "-------------------------------------"
if [ -f scripts/others/download_packages.sh ]; then
    echo -e "Ejecutando ${CYAN}download_packages.sh...${NC}"
    bash scripts/others/download_packages.sh
    echo -e "${GREEN}Instalación de paquetes finalizada.${NC}"
else
    echo -e "${YELLOW}⚠ Script 'download_packages.sh' no encontrado.${NC}"
fi

echo
echo -e "${GREEN}Configuración completa. 🎉${NC}"
echo "=========================="
echo
echo -e "${GREEN}🚀 Ahora puedes ejecutar:${NC}"
echo -e "   ${CYAN}npm run dev${NC}"
echo
echo -e "${GREEN}🚀 o convertir en un servicio con:${NC}"
echo -e "   ${CYAN}/scripts/others/convert_to_daemon.sh${NC}"
echo
echo -e "${YELLOW}Recuerde agregar los scripts que requieren permisos a sudoers para que puedan ejecutar comandos sin pedir contraseña.${NC}"
echo -e "${YELLOW}Por ejemplo, agregue la línea en /etc/sudoers (con visudo):${NC}"
echo
