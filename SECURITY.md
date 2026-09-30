# Security Policy & Vulnerability Disclosure

## 1. Supported Versions

Security fixes are actively maintained for the following versions of Runawulf:

| Version | Supported | Minimum OS Baseline |
| :--- | :---: | :--- |
| **2.0.x (alpha/current)** | ✅ | Ubuntu 22.04 LTS+ (Kernel $\ge$ 5.15, systemd $\ge$ 249) |
| < 2.0.0 (legacy) | ❌ | End of Life (Archived in `legacy/`) |

---

## 2. Reporting a Vulnerability

We take the security of Runawulf extremely seriously. Because Runawulf interacts directly with host firewall rules (`nftables`), Linux system services, and kernel telemetry, maintaining our security boundaries is paramount.

### Responsible Disclosure Process
* **DO NOT** file public GitHub issues for security vulnerabilities.
* Please submit a confidential security report using our [GitHub Security Advisory](../../security/advisories/new) or use the template at `.github/ISSUE_TEMPLATE/security_report.yml`.
* Alternatively, contact the security team directly at: `security@runawulf.org`.
* Please include:
  1. A clear description of the vulnerability and attack vector.
  2. Proof of Concept (PoC) steps or exploit script.
  3. The specific Immutable Security Invariant (I1–I10) that is bypassed or degraded.

### Response Timeline
* **Initial Acknowledgment:** Within 24 hours.
* **Triage & Impact Assessment:** Within 72 hours.
* **Remediation & Patch Release:** Priority release tagged under `sec/*` branch and SemVer patch.

---

## 3. The 10 Immutable Security Invariants

All security assessments and threat evaluations in Runawulf are measured against these invariants:

1. **I1 (Unprivileged Web Gateway):** `runawulfd` (`apps/daemon`) runs under system user `runawulf` with **ZERO** Linux capabilities and **NO** root privileges.
2. **I2 (No Arbitrary Execution):** **NEVER** write `exec(string)`. Child processes must strictly use `execFile(binary, argsArray)` with typed schemas or closed IPC methods.
3. **I3 (Zero-Trust Privileged Helper):** `runawulf-helper` (`apps/helper`) never trusts the daemon. It strictly enforces its own root-owned policy (`/etc/runawulf/privileged-policy.yaml`, mode `0644`).
4. **I4 (Exclusive nftables Scope):** Runawulf operates strictly within `table inet runawulf`. Never flush or modify rules created by Docker, UFW, Kubernetes, or CrowdSec.
5. **I5 (Root-Owned Rollback Watchdog):** The 30-second rollback timer (`PREPARE -> APPLY -> COMMIT / ROLLBACK`) runs inside the helper process in root space.
6. **I6 (Cryptographic Audit Ledger):** Every mutation is logged with an HMAC-SHA256 signature using `/etc/runawulf/audit.key` (inaccessible to the daemon) and anchored to `journald`.
7. **I7 (Idempotent Automations):** Re-processing a duplicated security alert must be a NOOP in the Command Bus and nftables sets.
8. **I8 (Declarative Modules):** Extensions (.rwmod) declare intentions (`kind: systemd-service`, `kind: http-healthcheck`), never arbitrary scripts.
9. **I9 (Untrusted External Inputs):** Suricata EVE logs, HTTP payloads, and WebSocket frames must be validated with Zod schemas and buffer limits.
10. **I10 (Privilege Escalation Containment):** A complete compromise of `apps/web`, `apps/daemon`, or `apps/ai` must **never** yield root access on the host.

---

## 4. Threat Boundaries

* **Web UI / Browser:** Untrusted. Runs in user context.
* **Daemon (`runawulfd`):** Semi-trusted. User `runawulf`, no root, no capabilities.
* **Cognitive Plane (`runawulf-ai`):** Isolated. User `runawulf-ai`, no socket to helper, no write access to `state.db`. Advisory only.
* **Sensor Plane (`runawulf-sensor`):** Scoped capabilities (`CAP_BPF`, `CAP_NET_ADMIN` / `CAP_PERFMON`). No `CAP_SYS_ADMIN`. Observational only.
* **Helper (`runawulf-helper`):** Minimal Trusted Computing Base (TCB). User `root`, locked policy, socket authenticated via `SO_PEERCRED`.
