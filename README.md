# Runawulf

> **A lightweight, event-driven local control plane for Linux security, telemetry, and automated operations.**

---

## 1. Overview

Runawulf is a secure, single-host control plane for Ubuntu Linux. It coordinates real-time telemetry, intrusion detection, and declarative firewall enforcement under an automated event-driven model:

$$\text{OBSERVE} \longrightarrow \text{EVENT} \longrightarrow \text{DECIDE} \longrightarrow \text{ACTION} \longrightarrow \text{VERIFY} \longrightarrow \text{AUDIT}$$

Unlike interactive administration tools (such as Cockpit or Webmin), Runawulf focuses on **autonomous reaction, strict privilege separation, and tamper-evident auditability**.

---

## 2. Core Architecture

The repository is organized as an **npm workspaces monorepo**:

```text
runawulf/
├── apps/
│   ├── daemon/                    # [runawulfd] Unprivileged web control plane (Fastify + EventBus)
│   ├── helper/                    # [runawulf-helper] Privileged system worker (Unix Socket + nftables)
│   ├── cli/                       # [runawulfctl] Operational CLI for terminal management
│   └── web/                       # Single Page Application structured under Feature-Sliced Design (FSD)
│
├── packages/
│   ├── contracts/                 # Shared Zod schemas, IPC protocol types, and Capability interfaces
│   └── tsconfig/                  # Shared base TypeScript configurations
│
├── config/                        # Reference configuration templates (YAML)
├── systemd/                       # Systemd socket and service units
└── docs/                          # Architectural specifications and design documentation
```

---

## 3. Security Invariants

1. **Unprivileged Web Gateway (`runawulfd`):** Runs as an unprivileged system user (`runawulf`) without Linux capabilities.
2. **Restricted Privileged Worker (`runawulf-helper`):** Activated by `systemd.socket` (`runawulf-helper.socket`), verifies client identity in kernel-space via `SO_PEERCRED`, and strictly checks mutations against `/etc/runawulf/privileged-policy.yaml`.
3. **No Arbitrary Execution:** Eliminates shell injection by design. Operations are strictly typed domain intents, never raw shell strings.
4. **Autonomous Rollback Watchdog:** Firewall changes are verified through an independent watchdog running inside the root helper. If connectivity fails or the daemon crashes, changes revert automatically.
5. **Tamper-Evident Audit Logging:** Events are logged to an append-only SQLite database using an HMAC chain signed with a key accessible only by the root helper, with periodic anchoring to `journald`.

---

## 4. Workspaces & Packages

| Path | Name | Description |
| :--- | :--- | :--- |
| `packages/contracts` | `@runawulf/contracts` | Type definitions, Zod schemas, IPC envelopes, capabilities. |
| `packages/tsconfig` | `@runawulf/tsconfig` | Reusable `tsconfig.json` bases across the workspace. |
| `apps/daemon` | `@runawulf/daemon` | Core business logic, Fastify HTTP/WS server, Policy Engine, SQLite. |
| `apps/helper` | `@runawulf/helper` | Socket-activated IPC worker performing `nftables` and `systemd` actions. |
| `apps/cli` | `@runawulf/cli` | Command-line utility for initial setup, password resets, and diagnostics. |
| `apps/web` | `@runawulf/web` | React 19 frontend implementing Feature-Sliced Design (FSD). |

---

## 5. Development Prerequisites

* **Operating System:** Ubuntu 22.04 LTS or higher (for Linux system integration).
* **Node.js:** `>= 20.0.0` (LTS recommended).
* **Package Manager:** `npm >= 9.0.0` (native workspaces).

---

## 6. License

This project is licensed under the [MIT License](LICENSE).
