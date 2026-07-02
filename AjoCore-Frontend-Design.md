# AjoCore Frontend Design Spec

> **Project**: AjoCore — Cooperative savings & thrift (Ajo/Esusu) platform  
> **Stack**: React + Vite (SPA)  
> **Design Language**: Nomba-inspired (fintech, clean, bold yellow accent)  
> **Date**: 2026-07-01

---

## 1. Tech Stack

| Concern   | Choice                                            |
| --------- | ------------------------------------------------- |
| Framework | React 18+ with Vite                               |
| Routing   | React Router v6                                   |
| State     | React Context (auth) + React Query (server state) |
| HTTP      | Axios (interceptors for JWT, refresh)             |
| CSS       | Tailwind CSS v3 + custom design tokens            |
| Icons     | Lucide React                                      |
| Forms     | React Hook Form + Zod                             |
| Charts    | Recharts (dashboard metrics)                      |
| Build     | Vite                                              |

**No SSR.** This is a client-side SPA. Backend is .NET 10 at a separate origin.

---

## 2. Design System — Nomba-Inspired

### 2.1 Brand Personality

- **Trust-first** — clean lines, generous whitespace, no clutter
- **Energetic** — bold yellow (#FFCC00) accent on restrained dark/light backgrounds
- **Professional fintech** — structured grids, clear hierarchy, data-forward

### 2.2 Color Palette

```
  Primary Yellow       #FFCC00        --ajo-yellow
  Yellow Hover         #E6B800        --ajo-yellow-hover
  Yellow Muted         rgba(255,204,0,0.12)

  Near Black           #121212        --ajo-black
  Dark Surface         #1A1A1A        --ajo-surface-dark
  Dark Card            #242424        --ajo-card-dark
  Dark Border          #2E2E2E        --ajo-border-dark

  White                #FFFFFF        --ajo-white
  Off-White            #F5F5F5        --ajo-off-white
  Light Surface        #FAFAFA        --ajo-surface-light
  Light Border         #E5E5E5        --ajo-border-light

  Success Green        #10B981        --ajo-success
  Error Red            #EF4444        --ajo-error
  Warning Orange       #F59E0B        --ajo-warning
  Info Blue            #3B82F6        --ajo-info
```

### 2.3 Typography

| Usage              | Font                      | Weight           |
| ------------------ | ------------------------- | ---------------- |
| Display / Headings | Inter (700, 800)          | Bold, ExtraBold  |
| Body               | Inter (400, 500)          | Regular, Medium  |
| Mono / Amounts     | JetBrains Mono (500, 600) | Medium, SemiBold |

Scale: `12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60`

### 2.4 Spacing

4px base unit → `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80`

### 2.5 Shadows

- Card: `0 1px 3px rgba(0,0,0,0.08)` (light), `0 1px 3px rgba(0,0,0,0.24)` (dark)
- Elevated: `0 4px 12px rgba(0,0,0,0.1)` (light), `0 4px 12px rgba(0,0,0,0.32)` (dark)
- Modal: `0 20px 60px rgba(0,0,0,0.15)` (light), `0 20px 60px rgba(0,0,0,0.5)` (dark)

### 2.6 Border Radius

- Buttons / inputs: `8px`
- Cards: `12px`
- Modals: `16px`
- Pills / badges: `9999px`

---

## 3. Route Architecture

### 3.1 Route Tree

```
/login                          Public — Login form
/register                       Public — Register (role picker: Trader | CoopAdmin)
/verify-email                   Public — Verify email token
/forgot-password                Public — Request reset
/reset-password                 Public — Set new password

/trader/dashboard               Trader — Overview, active cycles, balances, next due
/trader/cycles                  Trader — Browse cycles, join group cycles
/trader/cycles/personal         Trader — My personal (individual) cycles
/trader/cycles/create           Trader — Create personal saving cycle
/trader/cycles/:id              Trader — Cycle detail (type-specific: personal/rosca/asca)
/trader/payouts                 Trader — Payout history & upcoming
/trader/profile                 Trader — Personal info, update BVN/KYC
/trader/bank-account            Trader — Link payout bank account

/admin/dashboard                Admin — Groups, cycles, member metrics
/admin/groups                   Admin — All coop groups list
/admin/groups/:id               Admin — Group detail (members, pending requests, cycles)
/admin/groups/:id/requests      Admin — Pending join requests (approve/reject)
/admin/groups/:id/create-cycle  Admin — Create new saving cycle for group
/admin/cycles/:id               Admin — Cycle mgmt (approve/reorder/reject members)
/admin/cycles/:id/start         Admin — Start cycle
/admin/cycles/:id/reorder       Admin — Reorder payout slots before start
/admin/balances                 Admin — Group/cycle balance views
/admin/reports                  Admin — Reports & export
```

### 3.2 Layout Hierarchy

```
<App>
  <PublicLayout>         — no sidebar, centered content (auth pages)
    <AuthPage />
  </PublicLayout>

  <DashboardLayout>      — sidebar + topbar + main content area
    <Sidebar />           — role-aware nav items
    <Topbar />            — user avatar, notifications, logout
    <main>                — <Outlet /> from React Router
  </DashboardLayout>
</App>
```

### 3.3 Guards

- `PublicRoute` — redirect to role-specific dashboard if already authenticated
- `ProtectedRoute` — redirect to `/login` if not authenticated
- `RoleRoute` — route guard that matches role (Trader → `/trader/*`, CooperativeAdmin → `/admin/*`, SystemAdmin → `/admin/system/*`)

---

## 4. Component Tree

### 4.1 Shared / Primitives

```
/ui
  Button            — solid (yellow), outline, ghost, destructive, loading state
  Input             — text, email, password, with label + error
  Select            — styled select with chevron
  Badge             — status badges (Active, Pending, Defaulted, Completed)
  Card              — container with shadow, padding
  Modal             — centered overlay with backdrop
  Table             — responsive data table
  EmptyState        — icon + message + optional CTA
  StatCard          — metric card (label, value, trend)
  Avatar            — initials + photo fallback
  Spinner           — loading indicator
  Toast / Snackbar  — success/error notifications
  Amount            — formatted NGN currency display
  StatusDot         — colored dot for cycle/member status
  ConfirmDialog     — destructive action confirmation
```

### 4.2 Feature Components

```
/auth
  LoginForm
  RegisterForm        — role selector step
  ConfirmEmailCard
  ForgotPasswordForm
  ResetPasswordForm

/layout
  Sidebar             — collapsible, role-aware nav items
  Topbar              — breadcrumb + user menu + notification bell
  MobileNav           — bottom nav for mobile

/trader
  DashboardOverview   — stats: balance, active cycles, next due
  CycleCard           — cycle summary card (name, type, status, next payment)
  CycleList           — list/grid of CycleCards
  CycleDetail         — full cycle info + tabs (Contributions / Payouts / Members)
  ContributionForm    — select amount → initiate Nomba payment
  ContributionHistory — paginated table of contributions
  PayoutTimeline      — upcoming & past payouts with status
  ProfileForm         — edit name, email, phone
  BankAccountForm     — link bank account (bank matching via API)
  KYCUpload           — BVN verification

/trader
  CreatePersonalCycleForm — create individual saving cycle (name, type, amount, interval, end date)
  PersonalCycleList       — list of personal cycles with liquidation option
  LiquidateEarlyModal     — confirm early liquidation with 5% penalty notice

/admin
  AdminOverview       — stats: total groups, cycles, members, collections
  GroupCard           — group summary
  GroupList           — searchable, filterable
  GroupDetail         — tabs: Members / Cycles / Settings / Pending Requests
  RequestList         — pending join requests with approve/reject buttons
  MemberTable         — member list with actions (add via invite link, remove, status)
  AddMemberForm       — batch add members (name, email, phone, DOB, payout bank)
  CycleForm           — create cycle (type, amount, interval, duration)
  CycleDetailAdmin    — manage cycle: approve/reorder/reject members, start cycle, approve payouts
  MemberReorderForm   — drag-to-reorder payout slots before cycle starts
  ApproveMemberCard   — approve/reject individual cycle join requests
  PayoutApprovalCard  — approve/reject pending payout
  ReportsView         — date range filter, charts, export CSV
```

---

## 5. State Management & Data Flow

### 5.1 Auth State (React Context)

- Context holds: `user`, `token`, `refreshToken`, `isAuthenticated`, `role`
- On login: store tokens in `localStorage` (or httpOnly cookie if preferred)
- Axios interceptor attaches `Authorization: Bearer <token>` header
- 401 response → interceptor attempts refresh → if refresh fails → redirect to `/login`

### 5.2 Server State (React Query)

- All API data fetched/mutated via React Query
- Stale time defaults: lists `30s`, detail `60s`, metrics `120s`
- Mutations: `useMutation` → on success → `queryClient.invalidateQueries`
- Cache keys follow pattern: `['groups']`, `['groups', id]`, `['cycles']`, `['cycles', id, 'contributions']`

### 5.3 API Layer

```
/src/api
  client.ts         — Axios instance with base URL, interceptors, refresh
  auth.ts           — login, adminLogin, register, verifyEmail, forgotPassword, resetPassword, refreshToken, updateBvn, updatePayoutAccount
  groups.ts         — getAll, createGroup, requestJoin, getPendingRequests, approveMember, rejectMember, getMembers, addMembers, generateInviteLink
  cycles.ts         — createCycle, createPersonalCycle, getAll, getById, getMyDetails, getPersonalCycles, joinCycle, startCycle, getCycleMembers, approveMember, rejectMember, reorderMembers, getContributions, liquidateEarly
  banks.ts          — getBanks, lookupBankAccount
  balances.ts       — getSystemBalance, getCooperativeBalance, getCycleBalance, getMyBalances
  webhooks.ts       — (client doesn't call this, backend-only)
  profile.ts        — getProfile, updateProfile (assumed)
```

### 5.4 API Endpoint Mapping

| Method | Endpoint                                              | Hook                                   |
| ------ | ----------------------------------------------------- | -------------------------------------- |
| POST   | `/api/auth/register`                                  | `useRegister`                          |
| POST   | `/api/auth/login`                                     | `useLogin`                             |
| POST   | `/api/auth/admin-login`                               | `useAdminLogin`                        |
| POST   | `/api/auth/refresh`                                   | `useRefreshToken`                      |
| POST   | `/api/auth/verify-email`                              | `useVerifyEmail`                       |
| POST   | `/api/auth/forgot-password`                           | `useForgotPassword`                    |
| POST   | `/api/auth/reset-password`                            | `useResetPassword`                     |
| POST   | `/api/auth/update-bvn`                                | `useUpdateBvn` _(Trader only)_         |
| PUT    | `/api/auth/payout-account`                            | `useUpdatePayoutAccount`               |
| GET    | `/api/groups`                                         | `useGroups` _(search= param)_          |
| POST   | `/api/groups`                                         | `useCreateGroup` _(CoopAdmin only)_    |
| POST   | `/api/groups/{groupId}/join`                          | `useRequestJoinGroup`                  |
| POST   | `/api/groups/requests/{membershipId}/approve`         | `useApproveGroupMember` _(CoopAdmin)_  |
| POST   | `/api/groups/requests/{membershipId}/reject`          | `useRejectGroupMember` _(CoopAdmin)_   |
| GET    | `/api/groups/{groupId}/requests`                      | `usePendingRequests` _(CoopAdmin)_     |
| GET    | `/api/groups/{groupId}/members`                       | `useGroupMembers`                      |
| GET    | `/api/groups/{groupId}/invite-link`                   | `useGenerateInviteLink` _(CoopAdmin)_  |
| POST   | `/api/groups/{groupId}/members/add`                   | `useAddMembers` _(CoopAdmin)_          |
| GET    | `/api/saving-cycles`                                  | `useCycles`                            |
| POST   | `/api/saving-cycles`                                  | `useCreateCycle` _(CoopAdmin)_         |
| POST   | `/api/saving-cycles/individual`                       | `useCreatePersonalCycle`               |
| GET    | `/api/saving-cycles/individual`                       | `usePersonalCycles`                    |
| GET    | `/api/saving-cycles/my-personal`                      | `useMyPersonalCycles`                  |
| POST   | `/api/saving-cycles/{id}/liquidate-early`             | `useLiquidateEarly`                    |
| GET    | `/api/saving-cycles/{id}`                             | `useCycle`                             |
| GET    | `/api/saving-cycles/personal/{id}`                    | `usePersonalCycleDetail`               |
| GET    | `/api/saving-cycles/rosca/{id}`                       | `useRoscaCycleDetail`                  |
| GET    | `/api/saving-cycles/asca/{id}`                        | `useAscaCycleDetail`                   |
| GET    | `/api/saving-cycles/{id}/my-details`                  | `useMyCycleDetails`                    |
| GET    | `/api/saving-cycles/{id}/members`                     | `useCycleMembers` _(CoopAdmin)_        |
| POST   | `/api/saving-cycles/{id}/join`                        | `useJoinCycle`                         |
| POST   | `/api/saving-cycles/{id}/start`                       | `useStartCycle` _(CoopAdmin)_          |
| POST   | `/api/saving-cycles/{id}/members/{memberId}/approve`  | `useApproveCycleMember` _(CoopAdmin)_  |
| POST   | `/api/saving-cycles/{id}/members/{memberId}/reject`   | `useRejectCycleMember` _(CoopAdmin)_   |
| POST   | `/api/saving-cycles/{id}/members/reorder`             | `useReorderCycleMembers` _(CoopAdmin)_ |
| GET    | `/api/saving-cycles/members/{memberId}/contributions` | `useMemberContributions`               |
| GET    | `/api/balances/system`                                | `useSystemBalance` _(SystemAdmin)_     |
| GET    | `/api/balances/cooperative/{groupId}`                 | `useCooperativeBalance` _(CoopAdmin)_  |
| GET    | `/api/balances/cycle/{cycleId}`                       | `useCycleBalance` _(CoopAdmin)_        |
| GET    | `/api/balances/my-balances`                           | `useMyBalances`                        |
| GET    | `/api/banks`                                          | `useBanks`                             |
| GET    | `/api/banks/lookup?accountNumber=&bankName=`          | `useLookupBankAccount`                 |
| POST   | `/api/webhooks/nomba`                                 | _(backend-only — Nomba callback)_      |

---

## 6. Visual Design — Key Screens

### 6.1 Login / Register

Centered card on dark gradient background. Yellow CTA button. Nomba-style input styling.

```
┌───────────────────────────────────┐
│     [Logo]  AjoCore               │
│                                   │
│     Email                [input]  │
│     Password             [input]  │
│                                   │
│     [     Sign In (Yellow)    ]   │
│                                   │
│     Forgot password?  Register    │
└───────────────────────────────────┘
```

### 6.2 Trader Dashboard

Sidebar (left, dark) + main area (light or dark).

```
┌──────────┬────────────────────────────────────┐
│ Sidebar  │ Topbar:  Hello, Mubarak      [👤] │
│ (Dark)   ├────────────────────────────────────┤
│          │                                    │
│  📊 Dash │ ┌──────┐ ┌──────┐ ┌──────┐        │
│  🔄 Cycles│ │₦245k  │ │  3   │ │ ₦15k │       │
│  💰 Payout││Balance│ │Active│ │Next  │        │
│  👤 Profile││      │ │Cycles│ │Due   │        │
│          │ └──────┘ └──────┘ └──────┘        │
│          │                                    │
│          │ Active Cycles (2)                  │
│          │ ┌────────────────────────────────┐ │
│          │ │ Daily Thrift   ● Active        │ │
│          │ │ ₦5,000/day    Next: Today 6PM │ │
│          │ │ [Progress bar ████████░░ 80%]  │ │
│          │ └────────────────────────────────┘ │
│          │ ┌────────────────────────────────┐ │
│          │ │ Weekly Esusu  ● Active        │ │
│          │ │ ₦10,000/week  Next: Fri 12PM │ │
│          │ └────────────────────────────────┘ │
└──────────┴────────────────────────────────────┘
```

### 6.3 Admin — Group Detail

Tabs: Members | Cycles | Settings

```
┌──────────┬────────────────────────────────────┐
│ Sidebar  │ Topbar                             │
├──────────┼────────────────────────────────────┤
│ Dashboard│ Group: Tech Cooperative            │
│ Groups   │ [Members] [Cycles] [Settings]      │
│ Cycles   ├────────────────────────────────────┤
│ Members  │ Search members...    [+ Add]       │
│ Reports  │ ┌────┬──────┬──────┬──────┬──────┐ │
│          │ │Name│Email │Status│Cycles│Actions│ │
│          │ ├────┼──────┼──────┼──────┼──────┤ │
│          │ │... │ ...  │Active│  3   │ [x]  │ │
│          │ └────┴──────┴──────┴──────┴──────┘ │
└──────────┴────────────────────────────────────┘
```

---

## 7. Project Structure

```
ajo-frontend/
├── public/
├── src/
│   ├── api/             — Axios client + endpoint modules
│   ├── assets/          — images, fonts
│   ├── components/
│   │   ├── ui/          — Button, Input, Card, Modal, etc.
│   │   ├── layout/      — Sidebar, Topbar, DashboardLayout
│   │   ├── trader/      — Trader-specific components
│   │   └── admin/       — Admin-specific components
│   ├── context/         — AuthContext
│   ├── hooks/           — useAuth, custom hooks
│   ├── pages/
│   │   ├── auth/        — Login, Register, ConfirmEmail, etc.
│   │   ├── trader/      — Dashboard, Cycles, Profile, etc.
│   │   └── admin/       — Dashboard, Groups, Reports, etc.
│   ├── types/           — TypeScript types (DTOs, enums)
│   ├── utils/           — formatters (currency, date), validators
│   ├── App.tsx          — Router setup
│   └── main.tsx         — Entry point
├── tailwind.config.js   — Extended with AjoCore design tokens
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. Types (TypeScript)

All backend DTO types and enums mirrored in `src/types/`:

```typescript
// Enums
enum UserRole {
  Trader = 'Trader',
  CooperativeAdmin = 'CooperativeAdmin',
  SystemAdmin = 'SystemAdmin',
}
enum CycleType {
  Rosca = 'Rosca',
  Asca = 'Asca',
  Personal = 'Personal',
}
enum CycleStatus {
  Pending = 'Pending',
  Active = 'Active',
  Completed = 'Completed',
}
enum MemberStatus {
  Active = 'Active',
  Defaulted = 'Defaulted',
  Completed = 'Completed',
}
enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}
enum ContributionStatus {
  Pending = 'Pending',
  FullyPaid = 'FullyPaid',
  UnderPaid = 'UnderPaid',
  OverPaid = 'OverPaid',
  Late = 'Late',
}
enum PayoutStatus {
  NotDue = 'NotDue',
  Pending = 'Pending',
  Settled = 'Settled',
  Failed = 'Failed',
}
enum TransactionStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}
enum SchemeType {
  Contribution = 'Contribution',
  Payout = 'Payout',
}

// Auth
interface LoginRequest {
  email: string
  password: string
}
interface AdminLoginRequest {
  emailOrUsername: string
  password: string
}
interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  role: UserRole
  bvn?: string
  dateOfBirth: string
  payoutAccountNumber?: string
  payoutBankName?: string
  payoutAccountName?: string
}
interface AuthResponse {
  token: string
  email: string
  fullName: string
  role: string
  userId: string
  refreshToken: string
}
interface RefreshTokenRequest {
  token: string
  refreshToken: string
}
interface VerifyEmailRequest {
  email: string
  token: string
}
interface ForgotPasswordRequest {
  email: string
}
interface ResetPasswordRequest {
  email: string
  token: string
  newPassword: string
}
interface UpdateBvnRequest {
  bvn: string
}
interface UpdatePayoutAccountRequest {
  accountNumber: string
  bankName: string
  accountName: string
}

// Group
interface CooperativeGroup {
  id: string
  name: string
  description: string
  adminTraderId: string
  adminName: string
  memberCount: number
  cycleCount: number
  createdAt: string
}
interface GroupMember {
  id: string
  traderId: string
  traderName: string
  traderEmail: string
  status: string
  createdAt: string
  approvedAt?: string
}

// Cycle
interface SavingCycle {
  id: string
  name: string
  cycleType: string
  contributionAmount: number
  intervalDays: number
  status: string
  targetAmount: number
  startDate: string
  endDate?: string
  createdAt: string
  members?: SavingCycleMember[]
  individualSavingCycle?: IndividualSavingCycle
}
interface SavingCycleMember {
  id: string
  savingCycleId: string
  virtualAccountNumber?: string
  virtualAccountBank?: string
  payoutOrder: number
  status: string
  joinedAt: string
}
interface MyCycleDetails {
  cycleId: string
  name: string
  cycleType: string
  contributionAmount: number
  intervalDays: number
  status: string
  startDate: string
  endDate?: string
  virtualAccountNumber?: string
  virtualAccountBank?: string
  payoutOrder: number
}
interface MemberOrderDto {
  memberId: string
  newOrder: number
}

// Contribution
interface ContributionLedger {
  id: string
  savingCycleMemberId: string
  amount: number
  paidAt: string
}

// Payout
interface PayoutLedger {
  id: string
  savingCycleMemberId: string
  amount: number
  payoutDate: string
  merchantTxRef: string
}

// Balance
interface TraderBalance {
  overallTotalPaid: number
  cycleBalances: TraderCycleBalance[]
}
interface TraderCycleBalance {
  cycleId: string
  cycleName: string
  cycleType: string
  targetAmount: number
  totalPaid: number
  remainingAmount: number
}
interface SystemAdminBalance {
  totalContributions: number
  totalPayouts: number
  totalReversals: number
  systemWalletBalance: number
}
interface CooperativeAdminBalance {
  cooperativeGroupId: string
  totalContributions: number
  totalPayouts: number
  totalReversals: number
  groupWalletBalance: number
}
interface SavingCycleBalance {
  savingCycleId: string
  totalContributions: number
  totalPayouts: number
  totalReversals: number
  cycleWalletBalance: number
}

// Banks
interface BankDto {
  code: string
  name: string
}
interface BankLookupRequest {
  accountNumber: string
  bankCode: string
}
interface BankLookupResponse {
  accountName: string
}
```

---

## 9. Priority / Build Order (MVP)

### Phase 1 — Skeleton (Day 1)

- Scaffold Vite + React + TS + Tailwind
- Design tokens in tailwind.config
- Layout components (Sidebar, Topbar, DashboardLayout) for all 3 roles
- Auth context + Axios client with interceptors + refresh token logic
- Login + Register pages

### Phase 2 — Trader Flow (Day 2-3)

- Trader dashboard (balances, active cycles, next due)
- Browse & join group cycles
- Cycle detail (type-specific views: personal/rosca/asca)
- Create personal saving cycle + early liquidation
- Contributions history
- Payout timeline
- Profile: edit info, update BVN, link payout bank account

### Phase 3 — Admin Flow (Day 4-5)

- Admin dashboard (overview metrics: group/cycle member counts, collections)
- Group CRUD + invite link generation
- Pending join requests (approve/reject)
- Batch add members to group
- Cycle creation form (type, amount, interval)
- Cycle member management (approve/reject/reorder before start)
- Start cycle
- Payout approval
- Balance views (cooperative, cycle-level)
- Reports view

### Phase 4 — SystemAdmin & Polish (Day 6)

- System dashboard (total contributions, payouts, reversals, wallet balance)
- Mobile responsive
- Loading skeletons
- Error boundaries + empty states
- Toast notifications
- Edge cases (expired token, network offline)

---

## 10. Key Design Decisions

1. **React Query over Redux/Zustand** — Almost all state is server-synced. React Query handles caching, refetching, loading/error states out of the box. Auth state is the only client-specific state.

2. **Role-based routing, not a single app** — Traders and admins see completely different navigation. Separate route groups under `/trader/*` and `/admin/*` make this explicit.

3. **Nomba payment flow** — Contribute button → opens Nomba payment page (redirect) → Nomba webhook hits backend → frontend polls/refetches to reflect payment. User is redirected back via callback URL.

4. **No component library** — Build from scratch with Tailwind + Lucide. Keeps bundle small and matches the exact Nomba look. 5-6 primitive components cover 90% of pages.

5. **Dark mode first** — Nomba brand is predominantly dark (#121212 background, #FFCC00 accents). Light mode can be added later if needed.

---

## 11. Responsive Strategy

| Breakpoint | Layout                                                  |
| ---------- | ------------------------------------------------------- |
| < 768px    | Sidebar collapses to bottom nav; cards stack vertically |
| 768–1024px | Sidebar collapsible (hamburger); 2-column grids         |
| 1024px+    | Full sidebar; multi-column layouts                      |

---

## 12. Error Handling

- **API errors**: Axios interceptor catches 4xx/5xx → parse error message → show toast
- **Form validation**: Zod schemas → inline field errors (red text below input)
- **Network offline**: Detect navigator.onLine → show banner "You're offline"
- **401 expired token**: Attempt refresh → if fail → redirect `/login` with message "Session expired"
- **404 routes**: Catch-all `<NotFoundPage>` with illustration + link to dashboard
- **React Error Boundary**: Wrap each route page; show fallback with "Something went wrong" + reload button
