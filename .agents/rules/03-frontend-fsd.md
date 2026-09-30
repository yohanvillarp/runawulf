# Rule 03: Frontend Architecture (Feature-Sliced Design)

## Context
The web interface (`apps/web`) is structured under Feature-Sliced Design (FSD) using React 19, TypeScript, Vite, and Tailwind CSS v4.

## Layer Rules (Top to Bottom Dependency Direction Only)
1. **`app/`**: Root providers (`ThemeProvider`, `ModeProvider`), routing setup, global styles (`index.css`).
2. **`pages/`**: Route components assembling widgets and features for complete screen views (`DashboardPage`, `FirewallPage`, `IntrusionPage`).
3. **`widgets/`**: Complex, standalone UI compositions (`Header`, `RunicBackground`, `TelemetryGrid`, `ThreatFeed`).
4. **`features/`**: User interactions and specific use cases (`theme-switcher`, `mode-switcher`, `block-ip`, `unblock-ip`).
5. **`entities/`**: Domain concepts and data models (`theme`, `mode`, `system-metric`, `security-threat`, `firewall-set`).
6. **`shared/`**: Reusable UI primitives (`Button`, `Card`, `Badge`), API clients, utility helpers (`runes.ts`).

## Guidelines
* Never import from upper layers (e.g. an `entity` or `feature` must never import from a `widget` or `page`).
* Avoid hardcoded absolute URLs (`http://localhost:4000`). The SPA is served embedded by the daemon; use relative paths (`/api/v2/...` and `wss://${location.host}/ws`).
* Maintain dynamic theming with CSS custom properties (`var(--accent)`, `var(--bg-main)`, etc.) compatible with Tailwind v4 `@import "tailwindcss";`.
