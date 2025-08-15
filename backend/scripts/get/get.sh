#!/bin/bash

# Primer argumento que llega desde el backend
search=$1

# Ruta absoluta de la carpeta de scripts
SCRIPT_DIR="$(dirname "$0")"

case "$search" in
    interfaces)
        bash "$SCRIPT_DIR/get_interfaces.sh"
        ;;
    *)
        echo "Parámetro desconocido"
        exit 1
        ;;
esac
