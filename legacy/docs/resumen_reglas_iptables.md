# Traducción Simplificada de Comandos iptables al Español

Este documento resume los comandos, acciones y parámetros de iptables con su equivalente en español para facilitar la creación de reglas de firewall.

---

## 🎯 ACCIONES (Jump)

| Español     | iptables (`-j`) | Descripción                                                                 |
|-------------|------------------|-----------------------------------------------------------------------------|
| Permitir    | ACCEPT           | Acepta el paquete y permite el tráfico.                                     |
| Denegar     | DROP             | Descarta el paquete sin avisar al origen.                                   |
| Rechazar    | REJECT           | Descarta el paquete y envía una notificación de rechazo.                    |
| Limitar     | ACCEPT + limit   | Acepta el tráfico pero con una frecuencia limitada (previene abusos).       |

---

## 🔁 DIRECCIÓN DE LA REGLA (Cadena)

| Español     | Cadena (`CHAIN`) | Uso común                                                                 |
|-------------|------------------|---------------------------------------------------------------------------|
| Entrada     | INPUT            | Filtra paquetes **entrantes** al sistema.                                 |
| Salida      | OUTPUT           | Filtra paquetes **salientes** desde el sistema.                           |
| Reenvío     | FORWARD          | Filtra paquetes que **pasan a través del sistema** (como un router).      |

---

## 🌐 PROTOCOLOS

| Español     | iptables (`-p`)  | Uso común                              |
|-------------|------------------|----------------------------------------|
| TCP         | tcp              | Protocolos orientados a conexión (HTTP, SSH, etc.) |
| UDP         | udp              | Protocolos sin conexión (DNS, VoIP, etc.)          |
| ICMP        | icmp             | Usado para pings, errores de red, etc.             |

---

## 🧭 PARÁMETROS DE DIRECCIÓN

| Español                    | iptables         | Ejemplo                        |
|----------------------------|------------------|--------------------------------|
| IP de origen               | `-s`             | `-s 192.168.0.10`              |
| IP de destino              | `-d`             | `-d 8.8.8.8`                   |
| Interfaz de entrada        | `-i`             | `-i eth0`                      |
| Interfaz de salida         | `-o`             | `-o wlan0`                     |

---

## 📦 PUERTOS (solo TCP/UDP)

| Español         | iptables         | Ejemplo                 |
|------------------|------------------|--------------------------|
| Puerto de destino | `--dport`       | `--dport 80`            |
| Puerto de origen  | `--sport`       | `--sport 443`           |

---

## ⚙️ OTROS PARÁMETROS

| Español                        | iptables                     | Descripción                                       |
|--------------------------------|------------------------------|---------------------------------------------------|
| Limitar frecuencia             | `-m limit --limit 5/min`     | Permite un número limitado de paquetes por tiempo |
| Estado de conexión             | `-m state --state ESTABLISHED` | Para conexiones ya establecidas                  |
| Comentario descriptivo         | `-m comment --comment "X"`   | Agrega una nota a la regla                        |

---

iptables [CHAIN] [DIRECCIÓN] [PROTOCOLO] [OPCIONES] -j [ACCIÓN]
