#!/usr/bin/env bash
# ==============================================================================
# Runawulf — Multipass MicroVM Sandbox Launcher
# Launches a lightweight Ubuntu Server 24.04 LTS+ instance and mounts the workspace
# ==============================================================================
set -euo pipefail

VM_NAME="runawulf-lab"
CPUS="2"
MEM="2G"
DISK="15G"

if ! command -v multipass &>/dev/null; then
  echo "ERROR: multipass CLI is not installed. Visit: https://multipass.run/"
  exit 1
fi

echo "==> Checking if instance '$VM_NAME' already exists..."
if multipass list | grep -q "$VM_NAME"; then
  echo "==> Instance '$VM_NAME' is already running."
else
  echo "==> Launching Ubuntu Server 24.04 LTS+ microVM '$VM_NAME'..."
  multipass launch 24.04 \
    --name "$VM_NAME" \
    --cpus "$CPUS" \
    --memory "$MEM" \
    --disk "$DISK"

  echo "==> Mounting repository root to VM at /home/ubuntu/runawulf..."
  REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  multipass mount "$REPO_ROOT" "$VM_NAME":/home/ubuntu/runawulf

  echo "==> Running provisioner inside the VM..."
  multipass exec "$VM_NAME" -- sudo bash /home/ubuntu/runawulf/test/vagrant/provision.sh
fi

IP=$(multipass info "$VM_NAME" | grep IPv4 | awk '{print $2}')
echo ""
echo "----------------------------------------------------------------------"
echo "🐺 Runawulf Multipass VM ready at IP: $IP"
echo "Shell access:"
echo "  multipass shell $VM_NAME"
echo "----------------------------------------------------------------------"
