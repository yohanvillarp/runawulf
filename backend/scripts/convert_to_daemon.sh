#!/bin/bash

# Nombre de la app
APP_NAME="runawulf"

# Usuario que ejecutará el servicio
USER_NAME="$(whoami)"

# Directorio de trabajo (backend)
WORK_DIR="$(realpath ../backend)"

# Ruta al archivo principal (index.ts)
ENTRY_FILE="src/index.ts"

# Ruta a nvm.sh
NVM_PATH="$HOME/.nvm/nvm.sh"

# Ruta final del servicio
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"

# Crear archivo .service
echo "Creando servicio systemd: $SERVICE_FILE"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=Servicio Node.js: $APP_NAME
After=network.target

[Service]
ExecStart=/bin/bash -c 'source $NVM_PATH && npx ts-node $ENTRY_FILE'
WorkingDirectory=$WORK_DIR
Restart=always
User=$USER_NAME
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd
echo "Recargando systemd..."
sudo systemctl daemon-reload

# Preguntar persistencia
echo
read -p "¿Desea que el servicio $APP_NAME sea persistente? (S/N): " isPersistent
isPersistent=$(echo "$isPersistent" | tr '[:lower:]' '[:upper:]')

if [[ "$isPersistent" == "S" || "$isPersistent" == "SI" ]]; then
    sudo systemctl enable $APP_NAME
    echo "Servicio persistente habilitado."
else
    echo "Servicio no persistente."
fi

# Iniciar servicio
sudo systemctl start $APP_NAME

echo "Servicio $APP_NAME creado e iniciado con éxito."
echo "Usa 'sudo systemctl status $APP_NAME' para ver el estado."