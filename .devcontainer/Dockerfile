FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Install Linux toolchain, eBPF libraries, and nftables
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        build-essential \
        clang-14 \
        llvm-14 \
        libbpf-dev \
        linux-tools-common \
        linux-tools-generic \
        bpftool \
        nftables \
        pkg-config \
        curl \
        jq \
    && update-alternatives --install /usr/bin/clang clang /usr/bin/clang-14 100 \
    && update-alternatives --install /usr/bin/llvm-strip llvm-strip /usr/bin/llvm-strip-14 100 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x LTS
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
