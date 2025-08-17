#!/usr/bin/env bash

USER=$1

# 1. verificar si el usuario existe
id "$USER" >/dev/null 2>&1 || { echo "INVALID_USER"; exit 1; }

# 2. leer contraseña desde stdin
read -r PASS

# 3. invalidar cualquier cache anterior de sudo
sudo -K

# 4. intentar ejecutar un comando mínimo usando la contraseña del usuario
echo "$PASS" | sudo -S -p "" -u "$USER" true >/dev/null 2>&1
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo "VALID"
else
    echo "INVALID"
fi
