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

describe_rule() {
  local chain=$1 num=$2 target=$3 prot=$4 in_if=$5 out_if=$6 source=$7 destination=$8 options=$9

  local action=$(translate_action "$target")
  local protocol=$(translate_protocol "$prot")

  local port=""
  if [[ "$options" =~ --dport[[:space:]]+([0-9]+) ]]; then
    port=${BASH_REMATCH[1]}
  elif [[ "$options" =~ dpt:([a-zA-Z0-9_-]+) ]]; then
    port=${BASH_REMATCH[1]}
  fi

  if [[ "$chain" == "INPUT" ]]; then
    [[ "$source" == "anywhere" ]] && source="cualquier IP"
    [[ "$in_if" == "any" ]] && in_if="todas las interfaces"
    description="$action el tráfico de entrada desde la IP $source hacia la interfaz $in_if"
  elif [[ "$chain" == "OUTPUT" ]]; then
    [[ "$out_if" == "any" ]] && out_if="todas las interfaces"
    [[ "$destination" == "anywhere" ]] && destination="cualquier IP"
    description="$action el tráfico de salida desde la interfaz $out_if hacia la IP $destination"
  else
    description="$action regla en cadena $chain"
  fi

  [[ -n "$port" ]] && description+=" mediante el puerto/servicio $port"
  [[ "$protocol" != "Todos" && -n "$protocol" ]] && description+=" utilizando el protocolo $protocol"
  description+="."

  echo "$num|$description"
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

    desc_line=$(describe_rule "$chain" "$num" "$target" "$prot" "$in_if" "$out_if" "$source" "$destination" "$options")

    num_rule="${desc_line%%|*}"
    description="${desc_line#*|}"

    # Escapar comillas dobles para JSON
    description=$(echo "$description" | sed 's/"/\\"/g')

    if [[ "$first_rule" == false ]]; then
      output+=","
    fi
    output+="{\"num\":$num_rule,\"description\":\"$description\"}"
    first_rule=false
  done <<< "$rules"

  output+="]"
  first_chain=false
done

output+="}"

echo "$output"
