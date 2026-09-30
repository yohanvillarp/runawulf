#!/bin/bash

# códigos de salida
SUCCESS_CODE=0
GENERIC_ERROR_CODE=1
DUPLICATE_CODE=2

# Argumentos
direction=$1                        # INPUT, OUTPUT, FORWARD
portOrService=$2                   # Puede ser número de puerto o nombre de servicio
ipOrigenOrInterfaz=$3             # IP o interfaz de origen
ipDestinoOrInterfaz=$4            # IP o interfaz de destino
protocol=$5                       # TCP, UDP, auto, todos
action=$6                          # ACCEPT, DROP, REJECT, etc.

# Convertir dirección (entrada/salida/reenviar) a INPUT/OUTPUT/FORWARD
case "$direction" in
  entrada) direction="INPUT" ;;
  salida) direction="OUTPUT" ;;
esac

# Convertir protocolo
case "$protocol" in
  todos) protocol="" ;;
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
if [[ "$protocol" == "auto" ]]; then
  protocol=$(getent services "$portOrService" | awk '{print $2}' | cut -d/ -f2)
  protocol=${protocol:-tcp}
fi

if [ -n "$protocol" ]; then
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

# Función para comprobar duplicados
check_duplicate() {
  local chain=$1
  local proto=$2
  local src=$3
  local dst=$4
  local dport=$5
  local action=$6

  local proto_opt=""
  [[ -n "$proto" ]] && proto_opt="-p $proto"

  if sudo iptables -C $chain $proto_opt ${src:+-s $src} ${dst:+-d $dst} ${dport:+--dport $dport} -j $action 2>/dev/null; then
    return 0
  else
    return 1
  fi
}


if check_duplicate "$direction" "$protocol" "$ipOrigenOrInterfaz" "$ipDestinoOrInterfaz" "$port" "$action"; then
  echo "{\"code\": $DUPLICATE_CODE, \"message\": \"La regla ya existe. Es una regla duplicada.\"}"
  exit $DUPLICATE_CODE
else
  eval "$regla"
  # Guardar la regla de netfilter
  sudo netfilter-persistent save
  echo "{\"code\": $SUCCESS_CODE, \"message\": \"La regla ha sido agregada exitosamente.\", \"rule\": \"$regla\"}"
  exit $SUCCESS_CODE
fi
