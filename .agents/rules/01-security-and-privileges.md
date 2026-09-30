# Rule 01: Security & Privilege Separation

## Context
Runawulf manages Linux kernel-level operations (firewall rules, telemetry, system services). Any vulnerability can compromise the entire host.

## Rules
1. **Never run `runawulfd` as root:** The web daemon must execute strictly as system user `runawulf` with zero Linux capabilities.
2. **Never execute shell strings:** `exec()` is strictly forbidden across the codebase. Always use `execFile(binaryPath, argsArray, { timeout })`.
3. **Helper Zero-Trust Invariant:** The helper process (`apps/helper`) must never assume an incoming IPC request is authorized simply because the daemon sent it. The helper enforces `/etc/runawulf/privileged-policy.yaml` owned by `root:root (0644)`.
4. **Kernel-Space IPC Authentication:** The helper must inspect `SO_PEERCRED` on client sockets and verify `UID === runawulf`.
5. **Exclusive nftables Namespace:** All firewall operations must target `table inet runawulf`. Never flush or mutate foreign tables (Docker, UFW, Kubernetes).
6. **Watchdog in Root:** Firewall candidate rollbacks (30-second timer) must run inside the root helper, guaranteeing automatic rollback even if the web daemon crashes.
