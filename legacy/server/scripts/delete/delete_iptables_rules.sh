#!/bin/bash

# códigos de salida
SUCCESS_CODE=0
GENERIC_ERROR_CODE=1
DUPLICATE_CODE=2

# Argumentos
CHAIN=$1       # INPUT, OUTPUT
RULE_NUM=$2    # Número de la regla

# echo "Cadena: $CHAIN"
# echo "Número de regla: $RULE_NUM"

case "$CHAIN" in
  entrada) CHAIN="INPUT" ;;
  salida) CHAIN="OUTPUT" ;;
esac

# Eliminar la regla
sudo iptables -D "$CHAIN" "$RULE_NUM"
echo "{\"code\": $SUCCESS_CODE, \"message\": \"Regla $RULE_NUM eliminada de $CHAIN.\"}"