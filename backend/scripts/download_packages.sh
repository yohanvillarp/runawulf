#!/bin/bash

# Lista de paquetes requeridos
REQUIRED_PACKAGES=("nmap" "systemd","iptables")

for pkg in "${REQUIRED_PACKAGES[@]}"; do
    if dpkg -s "$pkg" &>/dev/null; then
        echo "$pkg ya está instalado."
    else
        echo "Instalando $pkg..."
        sudo apt update
        sudo apt install -y "$pkg"
    fi
done
