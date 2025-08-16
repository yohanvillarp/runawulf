#!/bin/bash

translate_action() {
  case "$1" in
    ACCEPT) echo "Permitir" ;;
    DROP) echo "Denegar" ;;
    REJECT) echo "Rechazar" ;;
    *) echo "$1" ;;
  esac
}

translate_protocol() {
  case "$1" in
    tcp) echo "TCP" ;;
    udp) echo "UDP" ;;
    all) echo "Todos" ;;
    *) echo "$1" ;;
  esac
}

get_service_from_port() {
  local port=$1
  local proto=$2
  # intentando obtener el servicio
  service=$(grep -E "^[a-zA-Z0-9_-]+\s+$port" /etc/services | awk '{print $1}' | head -n1)
  echo "$service"
}

describe_rule() {
  local chain=$1 num=$2 target=$3 prot=$4 in_if=$5 out_if=$6 source=$7 destination=$8 options=$9

  if [[ "$in_if" == "*" ]]; then
    in_if="todas las interfaces"
  fi

  if [[ "$out_if" == "*" ]]; then
    out_if="todas las interfaces"
  fi


  local action=$(translate_action "$target")
  [[ -z "$prot" || "$prot" == "0" ]] && prot="all"  
  local protocol=$(translate_protocol "$prot")

  local port=""
  local service=""
  if [[ "$options" =~ --dport[[:space:]]+([0-9]+) ]]; then
    port=${BASH_REMATCH[1]}
  elif [[ "$options" =~ dpt:([0-9]+) ]]; then
    port=${BASH_REMATCH[1]}
  fi

  if [[ -n "$port" ]]; then
    service=$(get_service_from_port "$port" "${prot,,}")  # Convertir a minúscula
  fi

  # Tipo según si se resolvió servicio o solo puerto
  local type="Puerto"
  [[ -n "$service" ]] && type="Servicio"

  # Normalizar interfaces y direcciones
  [[ "$chain" == "INPUT" ]] && [[ "$source" == "0.0.0.0/0" ]] && source="cualquier IP"
  [[ "$chain" == "OUTPUT" ]] && [[ "$destination" == "0.0.0.0/0" ]] && destination="cualquier IP"

  # Estado activo siempre true
  local active=true

  # Determinar el destino según la cadena
  local to=""
  if [[ "$chain" == "INPUT" ]]; then
    to="$in_if"   # interfaz local
  else
    to="$destination" 
    source="$out_if"
  fi

  # Generar JSON de la regla
  echo "{\"num\":\"$num\",\"action\":\"$action\",\"direction\":\"$( [[ $chain == INPUT ]] && echo Entrada || echo Salida )\",\"from\":\"$source\",\"to\":\"$to\",\"port\":${port:-null},\"service\":\"${service:-}\" ,\"protocol\":\"$protocol\",\"active\":$active}"
}

chains=("INPUT" "OUTPUT")
output="{"
first_chain=true

for chain in "${chains[@]}"; do
  [[ "$first_chain" == false ]] && output+=","
  output+="\"$chain\":["

  rules=$(sudo iptables -L "$chain" --line-numbers -v -n | tail -n +3 | grep -v '^$')
  first_rule=true

  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    num=$(echo "$line" | awk '{print $1}')
    if ! [[ "$num" =~ ^[0-9]+$ ]]; then
      continue
    fi

    target=$(echo "$line" | awk '{print $4}')
    prot=$(echo "$line" | awk '{print $5}')
    in_if=$(echo "$line" | awk '{print $7}')
    out_if=$(echo "$line" | awk '{print $8}')
    source=$(echo "$line" | awk '{print $9}')
    destination=$(echo "$line" | awk '{print $10}')
    options=$(echo "$line" | cut -d ' ' -f 11-)

    case "$prot" in
      0) prot="all" ;;
      6) prot="tcp" ;;
      17) prot="udp" ;;
    esac


    rule_json=$(describe_rule "$chain" "$num" "$target" "$prot" "$in_if" "$out_if" "$source" "$destination" "$options")

    [[ "$first_rule" == false ]] && output+=","
    output+="$rule_json"
    first_rule=false
  done <<< "$rules"

  output+="]"
  first_chain=false
done

output+="}"

echo "$output"
