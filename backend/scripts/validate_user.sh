#!/bin/bash
USER=$1
PASS=$2

echo "$PASS" | sudo -S -u "$USER" -k whoami 2>/dev/null | grep -q "$USER"

if [ $? -eq 0 ]; then
  echo "VALID"
else
  echo "INVALID"
fi
