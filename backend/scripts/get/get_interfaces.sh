#!/bin/bash

# Nombres de las interfaces
ip -o link show | awk -F': ' '{print $2}'
