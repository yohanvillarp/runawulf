#!/bin/bash

# Argumentos
CHAIN=$1       # INPUT, OUTPUT
RULE_NUM=$2    # Número de la regla

echo "Cadena: $CHAIN"
echo "Número de regla: $RULE_NUM"

# Solo si quieres manejar traducción de "entrada"/"salida" a INPUT/OUTPUT
case "$CHAIN" in
  entrada) CHAIN="INPUT" ;;
  salida) CHAIN="OUTPUT" ;;
esac

# Eliminar la regla
sudo iptables -D "$CHAIN" "$RULE_NUM"

echo "Regla $RULE_NUM eliminada de $CHAIN"