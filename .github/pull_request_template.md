## 🐺 Runawulf Pull Request

### 1. Summary of Changes
<!-- Provide a concise description of what this PR introduces, fixes, or refactors. -->

### 2. Architectural Plane Affected
- [ ] **Data / Sensor Plane** (`apps/sensor`, `bpf/`, eBPF/XDP)
- [ ] **Control Plane** (`apps/daemon`, EventBus, PolicyEngine, CommandBus, SQLite)
- [ ] **Cognitive Plane** (`apps/ai`, CognitiveRuntime, Providers, ContextBuilder)
- [ ] **Privileged Control** (`apps/helper`, nftables, systemd adapter, HMAC)
- [ ] **Operational CLI** (`apps/cli`, `runawulfctl`)
- [ ] **Frontend Cockpit** (`apps/web`, React 19 SPA, Feature-Sliced Design)
- [ ] **Shared Contracts** (`packages/contracts`, capabilities, events, IPC)
- [ ] **Repository & Tooling** (Husky, CI/CD, documentation, rules)

### 3. The 10 Immutable Security Invariants Checklist
<!-- Every change MUST uphold these invariants. Check all that apply or certify no regression. -->
- [ ] **I1 (Unprivileged Web Gateway):** `apps/daemon` runs with ZERO Linux capabilities.
- [ ] **I2 (No Arbitrary Execution):** Zero shell strings; `execFile(binary, argsArray)` or typed IPC only.
- [ ] **I3 (Zero-Trust Privileged Helper):** Helper validates mutations against independent policy.
- [ ] **I4 (Exclusive nftables Scope):** Operates strictly within `table inet runawulf`.
- [ ] **I5 (Root-Owned Rollback Watchdog):** 30s rollback watchdog active in root space.
- [ ] **I6 (Cryptographic Audit Ledger):** Mutations signed with HMAC-SHA256 and anchored to journald.
- [ ] **I7 (Idempotent Automations):** Re-processing duplicated events is a NOOP.
- [ ] **I8 (Declarative Modules):** Extends system intentions, never arbitrary binaries.
- [ ] **I9 (Untrusted External Inputs):** Inputs validated with Zod schemas and buffer limits.
- [ ] **I10 (Privilege Escalation Containment):** Daemon or AI compromise does NOT grant host root.

### 4. Code Quality & Modularity Verification
- [ ] **Line Length Quality Gate:** No React component exceeds 250 lines; no TS logic exceeds 350 lines (`npm run lint:lengths` passes).
- [ ] **Strict Typing:** No `any` types; all external data parsed through Zod.
- [ ] **Cross-Platform:** Preserves LF line endings and builds cleanly on Linux & Windows.
- [ ] **English Language:** Code, types, comments, and commit messages are in English.
- [ ] **Tests & Build:** `npm run typecheck` and `npm test` pass with 0 errors.

### 5. Related Issues / RFCs
Closes #
