#!/bin/bash

# Uso: ./move_rule.sh INPUT 2 4
CHAIN=$1          # INPUT o OUTPUT
CURRENT_NUM=$2    # Número actual de la regla
NEW_NUM=$3        # Nuevo número de la regla

# Validaciones básicas
if [[ -z "$CHAIN" || -z "$CURRENT_NUM" || -z "$NEW_NUM" ]]; then
  echo "Uso: $0 <CHAIN> <CURRENT_NUM> <NEW_NUM>"
  exit 1
fi

# Guardar la regla original
RULE=$(sudo iptables -L $CHAIN --line-numbers -v -n | awk -v num=$CURRENT_NUM '$1==num {print; exit}')

if [[ -z "$RULE" ]]; then
  echo "No se encontró la regla $CURRENT_NUM en la cadena $CHAIN"
  exit 1
fi

# Traducir la regla a parámetros iptables
TARGET=$(echo "$RULE" | awk '{print $4}')
PROT=$(echo "$RULE" | awk '{print $5}')
IN_IF=$(echo "$RULE" | awk '{print $7}')
OUT_IF=$(echo "$RULE" | awk '{print $8}')
SOURCE=$(echo "$RULE" | awk '{print $9}')
DEST=$(echo "$RULE" | awk '{print $10}')
OPTIONS=$(echo "$RULE" | cut -d ' ' -f 11-)

# Eliminar la regla original
sudo iptables -D $CHAIN $CURRENT_NUM

# Insertar en la nueva posición
CMD="sudo iptables -I $CHAIN $NEW_NUM -p $PROT -s $SOURCE -d $DEST -j $TARGET"

# Añadir puerto si existe
if [[ "$OPTIONS" =~ dpt:([0-9]+) ]]; then
  PORT=${BASH_REMATCH[1]}
  CMD="$CMD --dport $PORT"
fi

echo "$CMD"
eval $CMD
