# Runawulf — Infrastructure, Tooling & Deployment Guide

> **Technical Reference for Build Tooling, Sandboxing, Packaging, and Automation**  
> **Repository:** `runawulf`  
> **Target OS:** Ubuntu 22.04 LTS (Jammy) • Linux Kernel 5.15+

---

## 1. Overview

Runawulf coordinates kernel-level eBPF instrumentation, declarative firewall enforcement (`table inet runawulf`), unprivileged Web Gateways, and isolated cognitive AI advisory agents.

This document details how the developer tooling and deployment systems operate.

---

## 2. Root Makefile Reference

The root `Makefile` orchestrates compilation across both the C/eBPF toolchain and the Node.js npm workspaces.

| Target | Description | Dependencies |
| :--- | :--- | :--- |
| `make help` | Displays list of targets with colored descriptions. | `awk` |
| `make install-deps` | Installs npm dependencies across all workspaces. | `npm` |
| `make build` | Runs TypeScript project references build for all packages and Vite build for web. | `npm` |
| `make bpf` | Compiles `bpf/src/*.bpf.c` using `clang-14` and `llvm-strip`. | `clang-14`, `llvm-14`, `libbpf` |
| `make bpf-clean` | Cleans compiled `.bpf.o` objects. | `make` |
| `make lint` | Executes ESLint, file-length guardrails (`scripts/check-file-lengths.js`), and YAML syntax check. | `node` |
| `make package-deb` | Builds native `.deb` package via `nfpm`. | `nfpm` |
| `make package-rpm` | Builds native `.rpm` package via `nfpm`. | `nfpm` |
| `make install` | Deploys systemd units, default configs, and directories to `/etc` and `/var` (requires root). | `install` |
| `make uninstall` | Stops services and removes systemd units. | `systemctl` |
| `make dev-mock` | Starts the cross-platform IPC socket and eBPF simulator. | `node` |

---

## 3. Kernel Sandbox Environments

Testing eBPF and nftables requires a real Linux kernel.

### A. Vagrant (`test/vagrant/Vagrantfile`)
* **Base OS:** Ubuntu 22.04 LTS.
* **Provider:** VirtualBox or Libvirt (KVM).
* **Port Forwards:** 4000 (Control Plane) and 9090 (Prometheus).
* **Workflow:**
  ```bash
  vagrant up
  vagrant ssh
  cd /home/vagrant/runawulf
  make bpf
  npm run build
  sudo make install
  ```

### B. Multipass (`test/multipass/launch.sh`)
* Fast, lightweight microVM managed by Canonical's Multipass:
  ```bash
  bash test/multipass/launch.sh
  multipass shell runawulf-lab
  ```

---

## 4. Native Linux Packaging with nFPM

Packages are defined declaratively in `packaging/nfpm.yaml`.

* **Building:**
  ```bash
  make package-deb
  # Generates dist/runawulf_2.0.0-alpha.1_amd64.deb
  ```
* **Post-Installation Actions (`packaging/scripts/postinst`):**
  1. Creates unprivileged system user `runawulf` (Invariant **I1**).
  2. Creates `/etc/runawulf` (`0750 root:runawulf`) and `/var/lib/runawulf`.
  3. Generates `/etc/runawulf/audit.key` with strict `0400 root:root` permissions (Invariant **I6**).
  4. Initializes `table inet runawulf` in nftables (Invariant **I4**).
  5. Activates `runawulf-helper.socket` in systemd.

---

## 5. Fleet Deployment with Ansible

Located under `deploy/ansible/`:

```text
deploy/ansible/
├── ansible.cfg
├── inventory/hosts.ini
├── site.yml
└── roles/runawulf_node/
    ├── defaults/main.yml
    ├── handlers/main.yml
    ├── tasks/main.yml
    └── templates/runawulf.yaml.j2
```

### Running the Playbook:
```bash
cd deploy/ansible
ansible-playbook -i inventory/hosts.ini site.yml
```

---

## 6. Hardening & Observability

* **Kernel Sysctl Hardening (`config/sysctl/99-runawulf.conf`):**  
  Hardens the eBPF JIT compiler (`net.core.bpf_jit_harden = 2`) and disables unprivileged eBPF (`kernel.unprivileged_bpf_disabled = 1`).
* **AppArmor Profile (`security/apparmor/usr.sbin.runawulfd`):**  
  Enforces privilege escalation containment (Invariant **I10**).
* **Grafana Dashboard (`dashboards/grafana-runawulf-overview.json`):**  
  Visualizes eBPF XDP packet rates, RingBuffer overflows (`TelemetryDegraded`), and active nftables firewall rules.
