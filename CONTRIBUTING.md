# Contributing to Runawulf

Thank you for your interest in contributing to **Runawulf**!  
Runawulf is a lightweight, local, event-driven control plane for Linux security, telemetry, and automated firewall enforcement.

> 🇪🇸 **¿Prefieres leer en español?** Consulta nuestra [Guía de Contribución en Español](./CONTRIBUTING.es.md).

---

## 1. Ground Rules & Code Standards

Before writing code, please familiarize yourself with our core architecture and constraints:
1. **The 10 Immutable Security Invariants:** Review [AGENTS.md](./AGENTS.md) carefully. Every pull request must strictly uphold Invariants I1 through I10.
2. **Language Convention:** All code, comments, TypeScript types, commit messages, and documentation must be written in **English**.
3. **Strict TypeScript:** No `any` types. All untrusted external inputs (network packets, logs, web payloads) must be parsed via Zod schemas.
4. **File Length Limits & Modularity:**
   * React UI components (`.tsx`): **Max 250 lines**.
   * TypeScript logic modules (`.ts`): **Max 350 lines**.
   * Files exceeding these limits must be refactored into smaller, single-responsibility units.
5. **Cross-Platform Parity:** Line endings are normalized to `LF` via `.gitattributes`. Workflows and scripts must execute seamlessly on both Linux and Windows.

---

## 2. Enterprise Git Workflow

We follow an Enterprise GitFlow branching model:

```text
main (Production / Stable Releases)
  ▲
  │ (Release PR & Tagged SemVer)
develop (Active Integration)
  ▲
  ├────── feature/v2-foundation
  ├────── feature/ebpf-tracing
  └────── fix/quarantine-timeout
```

* **`main`:** Protected production branch. Direct commits are forbidden.
* **`develop`:** Continuous integration branch. All features and bug fixes merge here via Pull Request.
* **Branch Naming:**
  * `feature/<scope>-<description>` (e.g., `feature/sensor-ringbuf`)
  * `fix/<scope>-<description>` (e.g., `fix/memory-leak-procfs`)
  * `sec/<invariant-or-id>` (e.g., `sec/i2-execfile-guard`)

---

## 3. Commit Message Convention

Commits must follow the **Conventional Commits** specification:

```text
<type>(<scope>): <short imperative description>

[optional body]
[optional footer(s)]
```

### Allowed Types:
* `feat`: A new feature or system capability.
* `fix`: A bug fix.
* `sec`: A security hardening measure or invariant fix.
* `refactor`: Code change that neither fixes a bug nor adds a feature.
* `docs`: Documentation, architecture plans, or guidelines.
* `chore`: Build tasks, package updates, configuration.
* `test`: Adding or correcting tests.
* `perf`: Performance improvements.

---

## 4. Development Setup

### Prerequisites
* Node.js $\ge$ 20.0.0
* npm $\ge$ 9.0.0
* Linux (Ubuntu 22.04 LTS recommended) or Windows 11 with PowerShell 7+

### Getting Started
```bash
# Clone the repository
git clone https://github.com/yohanvillarp/runawulf.git
cd runawulf

# Install dependencies and initialize Husky git hooks
npm install

# Verify file length limits & YAML syntax
npm run lint:lengths
npm run lint:yaml

# Run typecheck across all workspaces
npm run typecheck

# Build all packages and web UI
make build   # or npm run build

# Cross-platform development with Mock Simulator (Windows / macOS)
npm run dev:mock

# Full Linux Kernel sandbox (eBPF & nftables)
vagrant up   # or bash test/multipass/launch.sh

# Run test suite
npm test
```

---

## 5. Submitting a Pull Request

1. Create your branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-cool-feature
   ```
2. Commit your changes in small, atomic, modular commits.
3. Verify that `npm run lint:lengths` and `npm run typecheck` pass.
4. Push your branch and open a Pull Request against `develop`.
5. Complete the checklist in our [Pull Request Template](.github/pull_request_template.md).

Thank you for helping keep Linux hosts safe and deterministic!
