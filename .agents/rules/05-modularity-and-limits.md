# Rule 05: Modularity, File Length Limits & Git Discipline

## Context
Maintainability, architectural clarity, and preventing monolithic "God Objects" across all packages and apps in the Runawulf monorepo.

## 1. Strict File Length Limits
Every AI agent and contributor modifying this codebase must adhere to the following file size ceilings:
* **React / UI Components (`.tsx`):** **Maximum 250 lines**.
* **TypeScript Logic Modules (`.ts`):** **Maximum 350 lines**.
* **Zero Exceptions for New Files:** New code must be designed modularly from inception.
* **Proactive Decomposition:** If editing an existing file brings it close to or over the limit, the agent must proactively decompose it into focused sub-modules before completing the task.

## 2. Decomposition Patterns
* **Frontend (`apps/web`):**
  * Extract view sub-panels into standalone widgets or features.
  * Move complex UI state, timers, and effects into dedicated custom hooks (`use*.ts`).
  * Relocate extensive static data, rune tables, SVG vector paths, and translations into `shared/lib/` or `assets/`.
* **Backend (`apps/daemon`, `apps/helper`, `apps/sensor`, `apps/ai`):**
  * Apply the **Single Responsibility Principle (SRP)**.
  * Separate I/O adapters from core domain logic.
  * Decouple bus event handlers into atomic listener classes.

## 3. Git Discipline & Atomic Commits
* **Single Logical Unit:** Each commit must encapsulate exactly one logical change. Never mix formatting, documentation, and feature code in a single commit.
* **Conventional Commits:** Use standard English prefixes (`feat:`, `fix:`, `sec:`, `refactor:`, `docs:`, `chore:`, `test:`).
* **Enterprise Branching:** Work occurs in `feature/*`, `fix/*`, or `sec/*` branches derived from `develop`. Direct pushes to `main` or `develop` are prohibited.
* **Pre-commit Verification:** Always ensure `npm run lint:lengths` and `npm run typecheck` pass with zero errors.
