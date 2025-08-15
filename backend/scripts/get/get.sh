#!/bin/bash

# Primer argumento que llega desde el backend
search=$1

# Ruta absoluta de la carpeta de scripts
SCRIPT_DIR="$(dirname "$0")"

bash "$SCRIPT_DIR/${search}.sh"
