#!/bin/bash

# Configura rutas
APP_NAME="runawulf"
NODE_PATH="$(which ts-node)"
APP_PATH="$(realpath ../src/app.ts)"
WORK_DIR="$(realpath ../src)"   
USER_NAME="$(whoami)"                 

SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"

# Crear archivo .service
echo "Creando servicio systemd: $SERVICE_FILE"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=Servicio Node.js: $APP_NAME
After=network.target

[Service]
ExecStart=$NODE_PATH $APP_PATH
WorkingDirectory=$WORK_DIR
Restart=always
User=$USER_NAME
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd y habilitar servicio
echo "Recargando systemd y activando servicio..."

sudo systemctl daemon-reload

echo
read -p "Desea que el servicio $APP_NAME sea persistente? (S/N): " isPersistent

# Convertir a mayusculas
isPersistent=$(echo "$isPersistent" | tr '[:lower:]' '[:upper:]' )

if [[ "$isPersistent" == "S" || "$isPersistent" == "SI" ]]; then
    echo "Servicio persistente."
    sudo systemctl enable $APP_NAME
else
    echo "Servicio no persistente."
fi

sudo systemctl start $APP_NAME

echo "Servicio $APP_NAME creado e iniciado con éxito."
echo "Usa 'sudo systemctl status $APP_NAME' para ver el estado."