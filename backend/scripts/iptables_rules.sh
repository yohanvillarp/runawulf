#!/bin/bash

# Argumentos
direction=$1                        # INPUT, OUTPUT, FORWARD
portOrService=$2                   # Puede ser número de puerto o nombre de servicio
ipOrigenOrInterfaz=$3             # IP o interfaz de origen
ipDestinoOrInterfaz=$4            # IP o interfaz de destino
protocol=$5                       # TCP, UDP, auto, ICMP
action=$6                          # ACCEPT, DROP, REJECT, etc.

# Convertir dirección (entrada/salida/reenviar) a INPUT/OUTPUT/FORWARD
case "$direction" in
  entrada) direction="INPUT" ;;
  salida) direction="OUTPUT" ;;
esac

# Convertir acción (permitir/bloquear/rechazar) a ACCEPT/DROP/REJECT
case "$action" in
  permitir) action="ACCEPT" ;;
  denegar) action="DROP" ;;
  rechazar) action="REJECT" ;;
esac

# Convertir extras
case "$ipOrigenOrInterfaz" in
  "todas las interfaces") ipOrigenOrInterfaz="" ;;
esac

case "$ipDestinoOrInterfaz" in
  "todas las interfaces") ipDestinoOrInterfaz="" ;;
esac


# Inicialización
regla="iptables -A $direction"
port=""
ruleOptions=""

# Obtener puerto
if [[ "$portOrService" =~ ^[0-9]+$ ]]; then
  # si es un puerto
  port=$portOrService
  if [ "$port" == 0 ]; then
    port=""
  fi
else
  #si es el nombre de un servicio
  port=$(getent services "$portOrService" | awk '{print $2}' | cut -d/ -f1)
fi

# Obtener protocolo
if [ "$protocol" == "auto" && "$port" != "" ]; then
  protocol=$(getent services "$portOrService" | awk '{print $2}' | cut -d/ -f2)
  protocol=${protocol:-tcp}
fi

if [ "$port" != "" ]; then
  # Agregar protocolo
  regla+=" -p $protocol"
fi

# Agregar IPs o interfaces según dirección
if [ "$direction" == "INPUT" ]; then
  # ipOrigenOrInterfaz es IP remota
  # ipDestinoOrInterfaz es interfaz local
  [[ -n "$ipOrigenOrInterfaz" ]] && ruleOptions+=" -s $ipOrigenOrInterfaz"
  [[ -n "$ipDestinoOrInterfaz" ]] && ruleOptions+=" -i $ipDestinoOrInterfaz"

elif [ "$direction" == "OUTPUT" ]; then
  # ipOrigenOrInterfaz es interfaz local
  # ipDestinoOrInterfaz es IP remota
  [[ -n "$ipOrigenOrInterfaz" ]] && ruleOptions+=" -o $ipOrigenOrInterfaz"
  [[ -n "$ipDestinoOrInterfaz" ]] && ruleOptions+=" -d $ipDestinoOrInterfaz"

elif [ "$direction" == "FORWARD" ]; then
  # Ambos pueden ser IPs (o más adelante manejar interfaces)
  [[ -n "$ipOrigenOrInterfaz" ]] && ruleOptions+=" -s $ipOrigenOrInterfaz"
  [[ -n "$ipDestinoOrInterfaz" ]] && ruleOptions+=" -d $ipDestinoOrInterfaz"
fi

# Agregar puerto
[[ -n "$port" ]] && ruleOptions+=" --dport $port"

# Acción
regla+=" $ruleOptions -j $action"

# Mostrar regla construida
echo "$regla"
#ejecutar regla
#eval "$regla"