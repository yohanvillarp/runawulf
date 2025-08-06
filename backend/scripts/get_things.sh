#!/bin/bash

# argumentos
search=$1

#if search=interfaces
# devuelve todas las interfaces de red
if [ "$search" == "interfaces" ]; then
    echo "$(ip -o link show | awk -F': ' '{print $2}')"
fi