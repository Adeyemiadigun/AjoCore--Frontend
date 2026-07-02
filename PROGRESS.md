# AjoCore Frontend — Fix Progress Tracker

> Based on audit findings from July 2, 2026

---

## P0 — Blocking

| #   | Fix                                              | Status  | Assigned | Notes                                    |
| --- | ------------------------------------------------ | ------- | -------- | ---------------------------------------- |
| 1   | Fix `useMembers.ts` import (`api` → `apiClient`) | ✅ Done | —        | `src/hooks/useMembers.ts`                |
| 2   | Remove `ignoreDeprecations: "6.0"` from tsconfig | ✅ Done | —        | Both tsconfig.json + tsconfig.app.json   |
| 3   | Create OG image asset                            | ✅ Done | —        | Created `public/og-image.svg` (1200×630) |

## P1 — High Priority

| #   | Fix                                              | Status  | Assigned | Notes                                             |
| --- | ------------------------------------------------ | ------- | -------- | ------------------------------------------------- |
| 4   | GA4 + GTM analytics with conversion events       | ✅ Done | —        | `src/hooks/useAnalytics.ts` + GTM in `index.html` |
| 5   | Add `&display=swap` to Google Fonts URL          | ✅ Done | —        | Already present in `index.html`                   |
| 6   | Modal: add `role="dialog"` + `aria-modal="true"` | ✅ Done | —        | `src/components/ui/Modal.tsx`                     |
| 7   | Input: link errors via `aria-describedby`        | ✅ Done | —        | `src/components/ui/Input.tsx`                     |

## P2 — Medium Priority

| #   | Fix                                        | Status  | Assigned | Notes                                        |
| --- | ------------------------------------------ | ------- | -------- | -------------------------------------------- |
| 8   | Add Content Security Policy (CSP) meta tag | ✅ Done | —        | `index.html`                                 |
| 9   | Vary landing section intro patterns        | ✅ Done | —        | Each section now uses distinct lead-in style |
| 10  | Break up identical benefit-card grid       | ✅ Done | —        | `BenefitsSection.tsx` — alternating layouts  |
| 11  | Network offline detection banner           | ✅ Done | —        | `App.tsx` — `OfflineBanner` component        |
| 12  | Expand sitemap.xml to all landing sections | ✅ Done | —        | 6 URLs including hash anchors                |

## P3 — Polish

| #   | Fix                                   | Status  | Assigned | Notes                                          |
| --- | ------------------------------------- | ------- | -------- | ---------------------------------------------- |
| 13  | Convert color tokens to OKLCH         | ✅ Done | —        | `src/index.css` hex → OKLCH                    |
| 14  | Add `text-wrap: balance` to all h1-h3 | ✅ Done | —        | `index.css`                                    |
| 15  | Set up E2E tests (Playwright)         | ✅ Done | —        | `playwright.config.ts` + `e2e/*.spec.ts`       |
| 16  | Bundle analysis + Prettier + Husky    | ✅ Done | —        | Prettier/Husky/lint-staged + `npm run analyze` |

---

## Key

| Icon           | Meaning                |
| -------------- | ---------------------- |
| 🔴 Open        | Not started            |
| 🟡 In Progress | Being worked on        |
| 🟢 Done        | Completed              |
| ✅ Verified    | Completed and verified |
