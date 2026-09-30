# Runawulf — Gemini Agent Guide

> **This document mirrors the canonical engineering guidelines defined in [AGENTS.md](./AGENTS.md).**  
> All Gemini and Antigravity models must strictly comply with the architecture, security invariants, and directory rules specified in [AGENTS.md](./AGENTS.md).

See [AGENTS.md](./AGENTS.md) for:
1. Project mission & event loop (`OBSERVE -> EVENT -> DECIDE -> ACTION -> VERIFY -> AUDIT`).
2. The 10 immutable security invariants (unprivileged daemon, zero-trust helper, `table inet runawulf`, watchdog rollback in root, HMAC audit).
3. Monorepo organization (`npm workspaces`).
4. Hexagonal architecture for backend & Feature-Sliced Design (FSD) for frontend.
5. Strict TypeScript and English language conventions.
