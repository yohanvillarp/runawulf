# Rule 04: TypeScript & Code Standards

## Context
Quality, type-safety, and maintainability across all workspaces.

## Rules
1. **Language:** Write all code, type names, variables, JSDoc docstrings, markdown docs, and git commit messages in **English**.
2. **Strict Typing:** No `any`. Use `unknown` with Zod parsing where incoming runtime data is untrusted.
3. **Contracts Package First:** Shared interfaces (`Readable`, `Actionable`, `Observable`, `Configurable`), IPC envelopes, and event/command types belong in `@runawulf/contracts`.
4. **Native ESM:** Use ECMAScript Modules (`"type": "module"`). Local file imports must include `.js` extension (e.g., `import { foo } from './foo.js'`).
5. **No Shell Injections:** Always pass arguments to child processes as typed string arrays, never concatenated shell strings.
