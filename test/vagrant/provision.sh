#!/usr/bin/env bash
# ==============================================================================
# Runawulf — Ubuntu 22.04 LTS Vagrant / VM Provisioner
# Prepares a clean Linux environment with eBPF CO-RE, nftables, and Node 20
# ==============================================================================
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo "==> [1/6] Updating apt repositories and kernel toolchain..."
apt-get update -y
apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  gnupg \
  build-essential \
  clang-14 \
  llvm-14 \
  libbpf-dev \
  linux-tools-common \
  linux-tools-generic \
  linux-tools-"$(uname -r)" \
  bpftool \
  nftables \
  jq \
  git \
  pkg-config

# Ensure clang and llvm default to version 14
update-alternatives --install /usr/bin/clang clang /usr/bin/clang-14 100 || true
update-alternatives --install /usr/bin/llvm-strip llvm-strip /usr/bin/llvm-strip-14 100 || true

echo "==> [2/6] Installing Node.js 20.x LTS runtime..."
if ! command -v node &> /dev/null; then
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
  apt-get update -y
  apt-get install -y nodejs
fi

echo "==> [3/6] Setting up system user and security permissions..."
if ! id -u runawulf &>/dev/null; then
  useradd --system --no-create-home --shell /usr/sbin/nologin runawulf
fi

# Ensure runawulf directories exist with invariant security permissions
mkdir -p /etc/runawulf
mkdir -p /var/lib/runawulf
mkdir -p /var/log/runawulf
chown -R root:runawulf /etc/runawulf
chmod 0750 /etc/runawulf
chown -R runawulf:runawulf /var/lib/runawulf
chmod 0750 /var/lib/runawulf

# Generate cryptographic audit HMAC key if not present (Invariant I6: 0400 root:root)
if [ ! -f /etc/runawulf/audit.key ]; then
  openssl rand -hex 32 > /etc/runawulf/audit.key
  chown root:root /etc/runawulf/audit.key
  chmod 0400 /etc/runawulf/audit.key
fi

echo "==> [4/6] Initializing table inet runawulf in nftables (Invariant I4)..."
nft add table inet runawulf 2>/dev/null || true

echo "==> [5/6] Verifying BPF filesystem and kernel capabilities..."
if ! mountpoint -q /sys/fs/bpf; then
  mount -t bpf bpf /sys/fs/bpf || true
fi

echo "==> [6/6] Node version: $(node -v) | npm version: $(npm -v) | bpftool: $(bpftool version | head -n1)"
echo "==> VM provisioning complete! Runawulf sandbox environment ready."
