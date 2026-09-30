#!/bin/bash

LOGFILE="/var/log/suricata/eve.json"

tail -f "$LOGFILE" | stdbuf -oL jq -c '
  try . catch empty |
  if .event_type=="alert" then
    {tipo: "alert", timestamp: .timestamp, src_ip: .src_ip, dest_ip: .dest_ip, proto: .proto, alerta: .alert.signature}
  elif .event_type=="http" then
    {tipo: "http", timestamp: .timestamp, src_ip: .src_ip, dest_ip: .dest_ip, url: .http.url, status: .http.status}
  elif .event_type=="dns" then
    {tipo: "dns", timestamp: .timestamp, src_ip: .src_ip, dest_ip: .dest_ip, query: .dns.rrname, type: .dns.type}
  else
    empty
  end
'