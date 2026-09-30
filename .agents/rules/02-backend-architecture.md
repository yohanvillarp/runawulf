# Rule 02: Backend Architecture & Domain Loop

## Context
The backend coordinates observation, decision, action, verification, and audit.

## Rules
1. **The Operational Loop:**
   `OBSERVE -> EVENT -> DECIDE (Policy Engine) -> ACTION (Command Bus) -> VERIFY -> AUDIT`
2. **Event vs Command Separation:**
   * **Events** represent immutable facts that already happened (`SecurityThreatDetected`, `MetricsSnapshot`).
   * **Commands** represent authorized intent to mutate system state (`BlockIpCommand`, `RestartUnitCommand`).
3. **Command Bus Enforcement:** All mutations (from UI, policy engine, API, or CLI) must dispatch through the `CommandBus`. Direct adapter calls are prohibited.
4. **Dual SQLite Persistence:**
   * `state.db`: Mutable runtime data (users, active sessions, policies, module metadata).
   * `audit.db`: Append-only cryptographic ledger using HMAC-SHA256 signatures and periodic `journald` anchoring.
5. **Telemetry Without Subprocesses:** Telemetry (Raido) reads `/proc` (`stat`, `meminfo`, `net/dev`, `loadavg`) directly in memory. Avoid spawning child processes on 1-second loops.
