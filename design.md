# AjoCore Frontend — Design System

> **Stack**: React 19 + Vite 6 + TypeScript 5.8 + Tailwind CSS v4  
> **Routing**: React Router 7 (SPA)  
> **State**: React Context (auth) + TanStack Query v5 (server)  
> **HTTP**: Axios (JWT interceptors, auto-refresh)  
> **Icons**: @phosphor-icons/react  
> **Animation**: motion (framer-motion v12)  
> **Charts**: Recharts (planned)  
> **Forms**: react-hook-form + zod (planned)

---

## 1. Design Tokens

Defined in `src/index.css` via `@theme`. All tokens prefixed `--color-nomba-*`.

### 1.1 Colors

| Token                          | Light     | Dark      | Usage           |
| ------------------------------ | --------- | --------- | --------------- |
| `--color-nomba-yellow`         | `#FFCC00` | `#FFCC00` | Primary accent  |
| `--color-nomba-yellow-dark`    | `#E6B800` | `#E6B800` | Hover states    |
| `--color-nomba-yellow-light`   | `#FFE066` | `#FFE066` | Muted bg        |
| `--color-nomba-bg`             | `#F5F5F5` | `#0F172A` | Page background |
| `--color-nomba-surface`        | `#FFFFFF` | `#1E293B` | Card/surface    |
| `--color-nomba-text`           | `#121212` | `#F8FAFC` | Primary text    |
| `--color-nomba-text-secondary` | `#5B6770` | `#94A3B8` | Secondary text  |
| `--color-nomba-border`         | `#E5E7EB` | `#334155` | Borders         |
| `--color-nomba-success`        | `#059669` | `#059669` | Success         |
| `--color-nomba-error`          | `#DC2626` | `#DC2626` | Error           |
| `--color-nomba-warning`        | `#D97706` | `#D97706` | Warning         |
| `--color-nomba-info`           | `#2563EB` | `#2563EB` | Info            |
| `--color-admin-accent`         | `#7C3AED` | `#7C3AED` | Admin role      |

### 1.2 Typography

| Role    | Font              | Fallback                               |
| ------- | ----------------- | -------------------------------------- |
| Display | Plus Jakarta Sans | `ui-sans-serif, system-ui, sans-serif` |
| Body    | Inter             | `ui-sans-serif, system-ui, sans-serif` |
| Mono    | JetBrains Mono    | `ui-monospace, monospace`              |

**Scale**: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60

**Rules**:

- h1-h3 use `text-wrap: balance` for even line lengths
- Body prose capped at 65–75ch via `max-width`
- Display headings: letter-spacing ≥ -0.04em, clamp ceiling ≤ 6rem

### 1.3 Spacing

4px base: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80`

### 1.4 Border Radius

| Token         | Value | Usage                    |
| ------------- | ----- | ------------------------ |
| `--radius-sm` | 6px   | Badges, small elements   |
| `--radius-md` | 10px  | Buttons, inputs, cards   |
| `--radius-lg` | 12px  | Larger cards             |
| `--radius-xl` | 16px  | Modals, large containers |

### 1.5 Shadows

| Token                 | Light                                                                   | Dark                                                                    |
| --------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `--shadow-card`       | `0 1px 3px rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.06)`         | `0 1px 3px rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.4)`           |
| `--shadow-card-hover` | `0 4px 12px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.08)`        | `0 4px 12px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.5)`          |
| `--shadow-dropdown`   | `0 10px 25px -5px rgb(0 0 0 / 0.08), 0 4px 10px -6px rgb(0 0 0 / 0.04)` | `0 10px 25px -5px rgb(0 0 0 / 0.12), 0 4px 10px -6px rgb(0 0 0 / 0.08)` |
| `--shadow-modal`      | `0 20px 50px -12px rgb(0 0 0 / 0.15)`                                   | `0 20px 50px -12px rgb(0 0 0 / 0.25)`                                   |

### 1.6 Z-Index Scale

| Token             | Value |
| ----------------- | ----- |
| `--z-sticky`      | 20    |
| `--z-nav-overlay` | 30    |
| `--z-modal`       | 40    |
| `--z-toast`       | 50    |
| `--z-tooltip`     | 60    |

---

## 2. Route Architecture

```
/                    Landing page (redirects to /dashboard if authenticated)
/login               Public auth
/register            Public registration
/dashboard           Protected — role-based redirect
  /                  Trader dashboard (default)
  /cycles            Trader: my saving cycles
  /groups            Trader: my groups
  /profile           Trader: profile & payout info
  /members           CoopAdmin: member management
  /users             SystemAdmin: user overview
  /settings          SystemAdmin: platform settings
*                    404 page
```

**Guards**:

- `ProtectedRoute` — redirects to `/login` if unauthenticated
- `ProtectedRoute` with `roles` prop — redirects to `/dashboard` if wrong role

---

## 3. Component Architecture

### 3.1 UI Primitives (`src/components/ui/`)

| Component       | Props                     | Notes                                          |
| --------------- | ------------------------- | ---------------------------------------------- |
| `Button`        | variant, size, loading    | primary/secondary/outline/ghost/danger         |
| `Input`         | label, error, id          | Forwards ref, supports react-hook-form         |
| `Card`          | hover                     | Composable: CardContent, CardHeader, CardTitle |
| `Badge`         | variant                   | default/success/warning/error/info/admin       |
| `Modal`         | open, onClose, title      | Focus trap, Escape close, scroll lock          |
| `Table<T>`      | columns, data, onRowClick | Generic, typed                                 |
| `ProgressBar`   | value, max, size          | Animated width                                 |
| `ErrorBoundary` | children                  | Class-based, catches render errors             |

### 3.2 Layout (`src/components/layout/`)

| Component        | Role                                       |
| ---------------- | ------------------------------------------ |
| `AppLayout`      | Sidebar + Topbar + `<Outlet />`            |
| `Sidebar`        | Role-aware nav (trader/admin/system links) |
| `Topbar`         | Mobile hamburger + breadcrumb area         |
| `ProtectedRoute` | Auth + role guard wrapper                  |

### 3.3 Shared (`src/components/`)

| Component                          | Purpose                                   |
| ---------------------------------- | ----------------------------------------- |
| `AnimatedSection`                  | Scroll-reveal with reduced-motion respect |
| `StaggerContainer` / `StaggerItem` | Staggered children animations             |

### 3.4 Pages

| Page                  | File                                      | Role        |
| --------------------- | ----------------------------------------- | ----------- |
| Landing (11 sections) | `src/pages/landing/`                      | Public      |
| Login                 | `src/pages/auth/LoginPage.tsx`            | Public      |
| Register              | `src/pages/auth/RegisterPage.tsx`         | Public      |
| Trader Dashboard      | `src/pages/trader/DashboardPage.tsx`      | Trader      |
| Cycles                | `src/pages/trader/CyclesPage.tsx`         | Trader      |
| Groups                | `src/pages/trader/GroupsPage.tsx`         | Trader      |
| Profile               | `src/pages/trader/ProfilePage.tsx`        | All         |
| Admin Dashboard       | `src/pages/admin/DashboardPage.tsx`       | CoopAdmin   |
| Group Management      | `src/pages/admin/GroupManagementPage.tsx` | CoopAdmin   |
| Members               | `src/pages/admin/MembersPage.tsx`         | CoopAdmin   |
| System Overview       | `src/pages/admin/SystemOverviewPage.tsx`  | SystemAdmin |
| 404                   | `src/pages/NotFoundPage.tsx`              | All         |

---

## 4. Data Flow

### 4.1 Auth

```
Login/Register → API response → localStorage (token, refreshToken, user)
                             → AuthContext state update
                             → Axios interceptor reads token for all requests
401 response → interceptor attempts refresh token
             → if OK: retry original request
             → if fail: clear storage, redirect /login
```

### 4.2 Server State

- All API data via TanStack Query
- `staleTime: 30_000` (30s) for lists
- `retry: 1`
- `refetchOnWindowFocus: false`
- Mutation pattern: `useMutation → invalidateQueries` on success

### 4.3 API Layer

```
src/api/
  client.ts       Axios instance + JWT interceptor + refresh queue
  endpoints.ts    Typed API functions (auth, balances, cycles, groups, banks)
```

---

## 5. Accessibility Standards

- Skip-to-content link on dashboard layout
- `aria-label` on all icon-only buttons
- `focus-visible` ring on all interactive elements (nomba-yellow)
- `prefers-reduced-motion` respected for all animations
- `<dialog>` role + `aria-modal` on Modal (fix required)
- `aria-describedby` linking input errors (fix required)

---

## 6. Performance Targets

| Metric           | Target                         |
| ---------------- | ------------------------------ |
| LCP              | < 2.5s                         |
| INP              | < 200ms                        |
| CLS              | < 0.1                          |
| First load JS    | < 150KB (code-split per route) |
| Lighthouse score | > 90                           |

---

## 7. Design Principles

1. **Trust-first fintech** — clean lines, whitespace, data hierarchy
2. **Yellow accent on restrained neutrals** — nomba-yellow (#FFCC00) as single accent
3. **Dark mode native** — CSS custom properties swap via prefers-color-scheme
4. **No component library** — hand-built primitives with Tailwind for small bundle
5. **Mobile first** — sidebar collapses to overlay, grids stack at <768px

---

## 8. Audit-Derived Fixes

Referenced from `AjoCore_Frontend_Audit_Report.md`. These are the designed fixes:

### P0 — Blocking

- [ ] `src/hooks/useMembers.ts`: `{ api }` → `{ apiClient }`
- [ ] `tsconfig.json` + `tsconfig.app.json`: remove `ignoreDeprecations: "6.0"`
- [ ] Create `/public/og-image.png` (referenced in OG meta)

### P1 — High Priority

- [ ] GA4 + GTM analytics with conversion events
- [ ] Google Fonts URL: add `&display=swap`
- [ ] Modal: add `role="dialog"` + `aria-modal="true"`
- [ ] Input: link errors via `aria-describedby`

### P2 — Medium

- [ ] CSP meta tag
- [ ] Vary landing section intro patterns (remove uniform eyebrow kickers)
- [ ] Break up identical benefit-card grid
- [ ] Network offline detection banner
- [ ] Expand sitemap.xml to all landing sections

### P3 — Polish

- [ ] Convert colors to OKLCH
- [ ] Add `text-wrap: balance` to all h1-h3
- [ ] Set up E2E tests (Playwright)
- [ ] Bundle analysis + Prettier + Husky

---

## 9. Glossary

| Term             | Meaning                                      |
| ---------------- | -------------------------------------------- |
| Ajo / Esusu      | Nigerian traditional thrift/rotating savings |
| Nomba            | Nigerian payment processor                   |
| Trader           | Individual saver                             |
| CooperativeAdmin | Group savings admin                          |
| SystemAdmin      | Platform super-admin                         |
| Cycle            | Structured savings period with goal          |
| Liquidation      | Early withdrawal (with penalty)              |
