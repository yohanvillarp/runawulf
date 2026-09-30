# Runawulf — AI Agent Engineering Guide (AGENTS.md)

> **Canonical Instructions, Architecture Rules, and Security Invariants for AI Coding Assistants**  
> **Applies to:** Antigravity, Gemini, Claude, Copilot, and autonomous agent systems.  
> **Repository:** `runawulf` (Linux Local Control Plane)  
> **Target OS:** Ubuntu Server 24.04 LTS+  
> **Documentation Language:** English (mandatory for all code, comments, JSDoc, and commits)

---

## 1. Project Mission & Identity

Runawulf is **not** an interactive shell wrapper or another terminal replacement like Cockpit or Webmin.

**Runawulf is a lightweight, local, event-driven control plane for Linux that coordinates real-time telemetry, intrusion detection, and declarative firewall enforcement under an automated loop:**

$$\text{OBSERVE} \longrightarrow \text{EVENT} \longrightarrow \text{DECIDE} \longrightarrow \text{ACTION} \longrightarrow \text{VERIFY} \longrightarrow \text{AUDIT}$$

---

## 2. The 10 Immutable Security Invariants (MANDATORY)

Every AI agent modifying this codebase MUST uphold these ten invariants. Any code violating them is considered a critical security defect:

| # | Invariant | Operational Rule |
| :-: | :--- | :--- |
| **I1** | **Unprivileged Web Gateway** | `runawulfd` (`apps/daemon`) runs under system user `runawulf` with **ZERO** Linux capabilities and **NO** root privileges. |
| **I2** | **No Arbitrary Command Execution** | **NEVER** write `exec(string)` or shell-interpolated commands. Use `execFile(binary, argsArray)` with typed schemas or closed IPC methods. |
| **I3** | **Zero-Trust Privileged Helper** | `runawulf-helper` (`apps/helper`) **never** trusts the daemon. It strictly enforces its own root-owned policy (`/etc/runawulf/privileged-policy.yaml`, mode `0644`). |
| **I4** | **Exclusive nftables Scope** | Runawulf operates **strictly** within `table inet runawulf`. Never flush or modify rules created by Docker, UFW, Kubernetes, or CrowdSec. |
| **I5** | **Root-Owned Rollback Watchdog** | The 30-second rollback timer (`PREPARE -> APPLY -> COMMIT / ROLLBACK`) runs inside the helper process in root space, not in the web daemon. |
| **I6** | **Cryptographic Audit Ledger** | Every mutation (including rejected ones) is logged with an HMAC-SHA256 signature using `/etc/runawulf/audit.key` (inaccessible to the daemon) and anchored to `journald`. |
| **I7** | **Idempotent Automations** | Re-processing a duplicated security alert must be a `NOOP` in the Command Bus and nftables sets. |
| **I8** | **Strictly Declarative Modules** | Extensions (.rwmod) declare intentions (`kind: systemd-service`, `kind: http-healthcheck`), never arbitrary scripts or binaries. |
| **I9** | **Untrusted External Inputs** | Suricata EVE logs, HTTP payloads, and WebSocket frames must be validated with Zod schemas and buffer size limits before processing. |
| **I10**| **Privilege Escalation Containment** | A complete compromise of `apps/web` or `apps/daemon` must **never** yield root access on the host. |

---

## 3. Monorepo Organization (npm Workspaces)

The codebase is organized as an npm workspaces monorepo:

```text
runawulf/
├── apps/
│   ├── daemon/                    # [@runawulf/daemon] Fastify web control plane (unprivileged)
│   ├── helper/                    # [@runawulf/helper] Systemd-activated IPC worker (root-restricted)
│   ├── cli/                       # [@runawulfctl] Operational CLI utility
│   └── web/                       # [@runawulf/web] React 19 SPA (Feature-Sliced Design)
│
├── packages/
│   ├── contracts/                 # [@runawulf/contracts] Shared Zod schemas, IPC envelopes, capabilities
│   └── tsconfig/                  # [@runawulf/tsconfig] Base TypeScript configs
│
├── config/                        # Reference YAML configuration templates
├── systemd/                       # Linux systemd service and socket unit files
└── docs/                          # Architecture specifications and technical documentation
```

### Dependency Rules:
* `apps/helper` must depend **only** on `@runawulf/contracts` and minimal system libraries. Never import Fastify, React, or heavy web dependencies into the helper.
* `apps/daemon` depends on `@runawulf/contracts`, Fastify, better-sqlite3, and pino.
* `apps/web` depends on React 19, Vite, and Tailwind CSS v4.

---

## 4. Architectural Patterns by Layer

### A. Backend (`apps/daemon` & `apps/helper`)
* **Hexagonal / Clean Architecture:** Domain logic and the Core Engine (`EventBus`, `CommandBus`, `PolicyEngine`) must have zero direct dependencies on HTTP frameworks or database drivers.
* **Granular Capabilities:** Use atomic interfaces (`Readable<T>`, `Observable<T>`, `Actionable<T>`, `Configurable<T>`) instead of monolithic universal service classes.
* **IPC Isolation:** Communication between daemon and helper occurs exclusively over a Unix Domain Socket managed by systemd (`runawulf-helper.socket`), authenticated in kernel space via `SO_PEERCRED` (`UID === runawulf`).

### B. Frontend (`apps/web`)
* **Feature-Sliced Design (FSD):** Strictly maintain the 6 standard layers:
  `app/` $\longrightarrow$ `pages/` $\longrightarrow$ `widgets/` $\longrightarrow$ `features/` $\longrightarrow$ `entities/` $\longrightarrow$ `shared/`
* **Tailwind CSS v4:** Use modern `@import "tailwindcss";` and CSS custom properties for dynamic theming.
* **Relative URLs:** The SPA is embedded and served directly by the daemon on port 4000. Never hardcode server IPs or ports in the frontend.

---

## 5. Coding & Language Conventions

1. **Language:** Write all code, type names, variable names, docstrings (JSDoc), markdown documentation, and git commit messages in **English**.
2. **TypeScript:** Strict mode enabled. No `any` types; use `unknown` with Zod parsing.
3. **ESM:** Use native ECMAScript modules with explicit `.js` extensions in local import paths where required.
4. **Audit Trail:** Whenever introducing a new system mutation, ensure it dispatches through `CommandBus` and records an HMAC entry in `audit.db`.
