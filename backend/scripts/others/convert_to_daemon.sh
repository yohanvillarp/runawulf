#!/bin/bash

# ================================================
# 🚀 Script de conversión a servicio del backend
# ================================================

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

APP_NAME="runawulf"
USER_NAME="$(whoami)"

# Rutas
SCRIPTS_OTHERS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SCRIPTS_DIR="$(dirname "$SCRIPTS_OTHERS_DIR")"
WORK_DIR="$(dirname "$SCRIPTS_DIR")"
ENTRY_FILE="$WORK_DIR/src/index.ts"
NVM_PATH="$HOME/.nvm/nvm.sh"
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"
WRAPPER="$WORK_DIR/start_runawulf.sh"

echo -e "${CYAN}🔍 Verificando permisos en sudoers...${NC}"

MISSING_SUDO=0
# Buscar todos los .sh en scripts y subcarpetas
mapfile -t all_scripts < <(find "$SCRIPTS_DIR" -type f -name "*.sh")
for script in "${all_scripts[@]}"; do
    if ! sudo grep -qF "$script" /etc/sudoers; then
        echo -e "${RED}❌ Falta sudoers para: $script${NC}"
        MISSING_SUDO=1
    fi
done

if [[ $MISSING_SUDO -ne 0 ]]; then
    read -p "¿Desea agregar todos los scripts a sudoers automáticamente? (S/N): " add_sudo
    add_sudo=$(echo "$add_sudo" | tr '[:lower:]' '[:upper:]')
    if [[ "$add_sudo" == "S" || "$add_sudo" == "SI" ]]; then
        for script in "${all_scripts[@]}"; do
            echo "$USER_NAME ALL=(ALL) NOPASSWD: $script" | sudo tee -a /etc/sudoers > /dev/null
        done
        echo -e "${GREEN}✅ Scripts agregados a sudoers.${NC}"
    else
        echo -e "${YELLOW}⚠️ Debe agregar los scripts a sudoers manualmente para continuar.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Todos los permisos verificados.${NC}"
fi

# Crear wrapper
cat > "$WRAPPER" <<EOF
#!/bin/bash
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
cd "$WORK_DIR"
npx ts-node src/index.ts
EOF
chmod +x "$WRAPPER"
echo -e "${GREEN}✅ Wrapper creado en $WRAPPER${NC}"

# Crear archivo .service
sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=Servicio Node.js: $APP_NAME
After=network.target

[Service]
ExecStart=$WRAPPER
WorkingDirectory=$WORK_DIR
Restart=always
User=$USER_NAME
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✅ Archivo de servicio creado: $SERVICE_FILE${NC}"
sudo systemctl daemon-reload

# Preguntar persistencia
read -p "¿Desea que el servicio $APP_NAME sea persistente? (S/N): " isPersistent
isPersistent=$(echo "$isPersistent" | tr '[:lower:]' '[:upper:]')
if [[ "$isPersistent" == "S" || "$isPersistent" == "SI" ]]; then
    sudo systemctl enable $APP_NAME
    echo -e "${GREEN}Servicio persistente habilitado.${NC}"
else
    echo -e "${YELLOW}Servicio no persistente.${NC}"
fi

# Iniciar servicio
sudo systemctl start $APP_NAME
echo -e "${GREEN}✅ Servicio $APP_NAME iniciado con éxito.${NC}"
echo -e "${GREEN}Usa 'sudo systemctl status $APP_NAME' para ver el estado.${NC}"
