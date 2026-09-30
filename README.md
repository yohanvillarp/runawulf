# Runawulf

> **A lightweight, event-driven local control plane for Linux security, telemetry, and automated operations.**

[![Runawulf CI Pipeline](https://github.com/yohanvillarp/runawulf/actions/workflows/ci.yml/badge.svg)](https://github.com/yohanvillarp/runawulf/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Target OS](https://img.shields.io/badge/Target_OS-Ubuntu_22.04_LTS+-orange.svg)](https://ubuntu.com/)
[![Kernel](https://img.shields.io/badge/Kernel-5.15+_eBPF_CO--RE-purple.svg)](https://ebpf.io/)

---

## 1. Overview & Mission

Runawulf is a lightweight, local, event-driven control plane for Linux that coordinates real-time kernel telemetry, intrusion detection, and declarative firewall enforcement under an automated loop:

$$\text{OBSERVE} \longrightarrow \text{EVENT} \longrightarrow \text{DECIDE} \longrightarrow \text{ACTION} \longrightarrow \text{VERIFY} \longrightarrow \text{AUDIT}$$

Unlike interactive admin panels (such as Cockpit or Webmin), Runawulf is designed for **autonomous self-defense, strict privilege isolation, and tamper-evident auditability**.

---

## 2. Tri-Plane Architecture

Runawulf enforces clean separation across three distinct operational planes:

```text
┌─────────────────────────────────────────────────────────────┐
│                       COCKPIT SPA                           │
│           React 19 + Vite (Feature-Sliced Design)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / WebSocket (Port 4000)
┌──────────────────────────────▼──────────────────────────────┐
│                    CONTROL PLANE (runawulfd)                │
│    Unprivileged Web Gateway (Fastify, EventBus, state.db)   │
└──────────────┬───────────────────────────────┬──────────────┘
               │ Unix Domain Socket            │ HTTP / IPC
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│       PRIVILEGED HELPER     │ │      COGNITIVE PLANE        │
│       (runawulf-helper)     │ │        (runawulf-ai)        │
│   Socket-activated Worker   │ │   Advisory AI Mitigations   │
│   Root Watchdog & Rollback  │ │   Deterministic Guardrails  │
│   HMAC Audit Ledger Key     │ └─────────────────────────────┘
│   Exclusive inet runawulf   │
└──────────────┬──────────────┘
               │ Kernel Space (RingBuffer / eBPF Maps)
┌──────────────▼──────────────────────────────────────────────┐
│               DATA & SENSOR PLANE (runawulf-sensor)         │
│   Kernel Probes: rw_exec_trace, rw_connect_trace, rw_xdp    │
│   eBPF CO-RE • BTF Relocations • Zero Privilege Escalation  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. The 10 Immutable Security Invariants

| # | Invariant | Operational Rule |
| :-: | :--- | :--- |
| **I1** | **Unprivileged Web Gateway** | `runawulfd` runs under user `runawulf` with **ZERO** capabilities and no root privileges. |
| **I2** | **No Arbitrary Command Execution** | No shell interpolation or `exec()`. Closed-form, strictly typed IPC schemas only. |
| **I3** | **Zero-Trust Privileged Helper** | Helper strictly validates daemon operations against root-owned `/etc/runawulf/privileged-policy.yaml`. |
| **I4** | **Exclusive nftables Scope** | Operates strictly within `table inet runawulf`. Never touches Docker, UFW, or Kubernetes tables. |
| **I5** | **Root-Owned Rollback Watchdog** | 30-second watchdog timer runs inside the root helper; automatically reverts uncommitted mutations. |
| **I6** | **Cryptographic Audit Ledger** | Every mutation is signed via HMAC-SHA256 with `/etc/runawulf/audit.key` (mode `0400 root:root`). |
| **I7** | **Idempotent Automations** | Re-processing duplicate security alerts is guaranteed to be a `NOOP`. |
| **I8** | **Strictly Declarative Modules** | Modules declare intentions (`kind: systemd-service`), never arbitrary scripts or binaries. |
| **I9** | **Untrusted External Inputs** | All external inputs validated with Zod schemas and strict buffer limits before processing. |
| **I10**| **Privilege Escalation Containment**| Complete compromise of Web or Daemon never yields root access on the host. |

---

## 4. Workspaces Monorepo

```text
runawulf/
├── apps/
│   ├── daemon/                    # [@runawulf/daemon] Fastify web control plane (unprivileged)
│   ├── helper/                    # [@runawulf/helper] Systemd-activated IPC worker (root-restricted)
│   ├── sensor/                    # [@runawulf/sensor] eBPF RingBuffer consumer & telemetry exporter
│   ├── ai/                        # [@runawulf/ai] Cognitive runtime with semantic guardrails
│   ├── cli/                       # [@runawulf/cli] Operational CLI utility
│   └── web/                       # [@runawulf/web] React 19 cockpit SPA (Feature-Sliced Design)
│
├── packages/
│   ├── contracts/                 # [@runawulf/contracts] Shared Zod schemas, IPC envelopes, capabilities
│   └── tsconfig/                  # [@runawulf/tsconfig] Reusable TypeScript configurations
│
├── bpf/                           # Kernel eBPF C programs (CO-RE, BTF, XDP)
├── config/                        # Reference YAML configurations and sysctl hardening
├── deploy/                        # Ansible playbooks and cloud-init blueprints
├── packaging/                     # Native Linux package definitions (nFPM .deb & .rpm)
├── systemd/                       # Systemd service and socket units
└── test/                          # Vagrant & Multipass VM test sandboxes
```

---

## 5. Developer Quickstart

### Prerequisites
* **Linux (Production / e2e):** Ubuntu 22.04 LTS+, Kernel 5.15+, `clang-14`, `llvm-14`, `libbpf-dev`, `nftables`.
* **Cross-Platform (Dev):** Windows, macOS, or Linux with Node.js `>= 20.0.0` and `npm >= 9.0.0`.

### Common Commands (Makefile)

```bash
# Display help and available commands
make help

# Build all TypeScript packages and the Web Cockpit
make build

# Compile kernel eBPF probes into CO-RE objects
make bpf

# Run linters, YAML syntax guard, and file-length limits
make lint

# Run unit and contract test suites
make test
```

### Local Development Without a Linux Kernel (`dev-mock`)
If developing on Windows or macOS, run the built-in IPC & eBPF simulator:
```bash
npm run dev:mock
# Simulates /run/runawulf/helper.sock and streams synthetic kernel security alerts
```

### Full Kernel Sandbox (Vagrant & Multipass)
To test live eBPF probes and `nftables` in an isolated Ubuntu 22.04 LTS virtual machine:
```bash
# Option A: Vagrant (VirtualBox / Libvirt)
vagrant up
vagrant ssh

# Option B: Canonical Multipass
bash test/multipass/launch.sh
```

---

## 6. Distribution & Deployment

* **Debian/Ubuntu Package (`.deb`):**
  ```bash
  make package-deb
  sudo dpkg -i dist/runawulf_2.0.0-alpha.1_amd64.deb
  ```
* **Fleet Deployment with Ansible:**
  ```bash
  cd deploy/ansible
  ansible-playbook -i inventory/hosts.ini site.yml
  ```
* **Cloud-Init Blueprint:** Use [`deploy/cloud-init/runawulf-bootstrap.yaml`](deploy/cloud-init/runawulf-bootstrap.yaml) to provision nodes on AWS, Hetzner, or Proxmox on first boot.

---

## 7. Documentation & Governance

* [Architecture Specifications](docs/PLAN_ESTRUCTURA_PROYECTO.md)
* [Infrastructure & Deployment Guide](docs/infrastructure_and_deployment.md)
* [Contributing Guide (English)](CONTRIBUTING.md) | [Guía de Contribución (Español)](CONTRIBUTING.es.md)
* [Security Policy & Invariants](SECURITY.md)
* [Code of Conduct](CODE_OF_CONDUCT.md)

---

## 8. License

This project is licensed under the [MIT License](LICENSE).
