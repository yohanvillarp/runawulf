#!/usr/bin/env bash
# Requisitos:
# sudo apt update && sudo apt install -y curl lsb-release

# --- CPU usage (%) ---
cpuUsage=$(
  LC_ALL=C top -bn1 \
  | awk -F',' '/Cpu\(s\)/ {
      idle=0;
      for(i=1;i<=NF;i++){
        if ($i ~ / id/){
          gsub("[^0-9.]", "", $i);
          idle=$i;
        }
      }
      if (idle == 0) {print 0} else {printf "%.0f", 100-idle}
    }'
)
[[ -z "$cpuUsage" ]] && cpuUsage=0

# --- RAM (GB con 1 decimal) ---
ramUsed=$(free -m | awk '/Mem:/ {printf "%.1f", $3/1024}' | tr ',' '.')
ramTotal=$(free -m | awk '/Mem:/ {printf "%.1f", $2/1024}' | tr ',' '.')


# --- Disco (GB enteros, sumando todos menos tmpfs/devtmpfs) ---
read -r diskUsed diskTotal < <(
  LC_ALL=C df -B1 -x tmpfs -x devtmpfs --total \
  | awk '/total/ {u=int($3/1024/1024/1024); t=int($2/1024/1024/1024); printf "%d %d", u, t}'
)

# --- IP privada ---
ipPrivada=$(hostname -I 2>/dev/null | awk '{print $1}')
[[ -z "$ipPrivada" ]] && ipPrivada=$(ip -o -4 addr show 2>/dev/null | awk '!/ lo /{print $4}' | cut -d/ -f1 | head -n1)
[[ -z "$ipPrivada" ]] && ipPrivada="desconocida"

# --- IP pública ---
ipPublica=$(curl -s --max-time 3 https://ifconfig.me 2>/dev/null)
[[ -z "$ipPublica" ]] && ipPublica=$(curl -s --max-time 3 https://api.ipify.org 2>/dev/null)
[[ -z "$ipPublica" ]] && ipPublica="desconocida"

# --- Hostname ---
host=$(hostname -s 2>/dev/null)
[[ -z "$host" ]] && host=$(hostname 2>/dev/null)

# --- Sistema operativo ---
if [[ -r /etc/os-release ]]; then
  . /etc/os-release
  os="$PRETTY_NAME"
elif command -v lsb_release >/dev/null 2>&1; then
  os=$(lsb_release -d | awk -F'\t' '{print $2}')
else
  os=$(uname -sr)
fi

# --- Uptime (en español) ---
upt=$(uptime -p 2>/dev/null | sed 's/^up //')
upt=${upt//years/años}
upt=${upt//year/año}
upt=${upt//weeks/semanas}
upt=${upt//week/semana}
upt=${upt//days/días}
upt=${upt//day/día}
upt=${upt//hours/horas}
upt=${upt//hour/hora}
upt=${upt//minutes/minutos}
upt=${upt//minute/minuto}
upt=${upt//seconds/segundos}
upt=${upt//second/segundo}

# --- Tráfico de red total (MB) ---
readBytes=$(awk 'NR>2 && $1 !~ /lo:/ {sum+=$2} END{print sum}' /proc/net/dev)
transBytes=$(awk 'NR>2 && $1 !~ /lo:/ {sum+=$10} END{print sum}' /proc/net/dev)
netReceivedMB=$(awk -v r=$readBytes 'BEGIN{printf "%.1f", r/1024/1024}' | tr ',' '.')
netSentMB=$(awk -v t=$transBytes 'BEGIN{printf "%.1f", t/1024/1024}' | tr ',' '.')

# --- Load Average ---
load1=$(awk '{print $1}' /proc/loadavg)
load5=$(awk '{print $2}' /proc/loadavg)
load15=$(awk '{print $3}' /proc/loadavg)

# --- Procesos totales ---
processes=$(ps -e --no-headers | wc -l)

# --- Top 5 procesos por CPU ---
topProcesses=$(ps -eo comm,%cpu,%mem --sort=-%cpu | head -n 6 | tail -n +2 \
  | awk '{printf "{\"name\":\"%s\",\"cpu\":%s,\"mem\":%s},",$1,$2,$3}' | sed 's/,$//')

# --- Servicios activos ---
services=$(systemctl list-units --type=service --state=running \
  | awk 'NR>1 {print $1}' | head -n 5 \
  | awk '{printf "\"%s\",",$1}' | sed 's/,$//')

# --- Latencia (ms promedio) ---
latency=$(ping -c 4 -q 8.8.8.8 2>/dev/null | awk -F'/' 'END{ if ($5!="") printf "%.1f", $5; else print "desconocida"}' | tr ',' '.')

# --- Usuarios conectados ---
users=$(who | wc -l)

# --- Escapar comillas ---
json_escape() { sed 's/\\/\\\\/g; s/"/\\"/g'; }
os_esc=$(printf '%s' "$os" | json_escape)
upt_esc=$(printf '%s' "$upt" | json_escape)
ipPub_esc=$(printf '%s' "$ipPublica" | json_escape)
ipPriv_esc=$(printf '%s' "$ipPrivada" | json_escape)
host_esc=$(printf '%s' "$host" | json_escape)

# --- JSON final ---
cat <<EOF
{
  "cpuUsado": $cpuUsage,
  "ramUsado": $ramUsed,
  "ramTotal": $ramTotal,
  "discoUsado": $diskUsed,
  "discoTotal": $diskTotal,
  "ipPublica": "$ipPub_esc",
  "ipPrivada": "$ipPriv_esc",
  "nombreMaquina": "$host_esc",
  "sistemaOperativo": "$os_esc",
  "tiempoPrendido": "$upt_esc",
  "datosRecibidosMB": $netReceivedMB,
  "datosEnviadosMB": $netSentMB,
  "cargaPromedio": {
    "1min": $load1,
    "5min": $load5,
    "15min": $load15
  },
  "numeroProcesos": $processes,
  "procesosMasUsados": [ $topProcesses ],
  "servicios": [ $services ],
  "latenciaMs": $latency,
  "usuariosConectados": $users
}
EOF
