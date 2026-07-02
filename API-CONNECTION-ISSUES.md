# API Connection Issues — Frontend ↔ Backend

> Generated from audit of `AjoCore--Frontend` (React/TypeScript) vs `AjoCore---Backend` (.NET 10 / CQRS)
> Date: 2026-07-02

---

## Critical

### 1. Register endpoint returns wrong response shape

**Backend** (`AuthController.cs:34`): `POST /api/auth/register` returns `Ok(new { Message = result })` — just a string message.

**Frontend** (`endpoints.ts:22`): Expects `AuthResponse` with `{ token, email, fullName, role, userId, refreshToken }`.

**Impact**: Registration will crash — `AuthContext.tsx:68` calls `persistAuth(response)` which destructures `.token`, `.refreshToken`, etc. from a `{ Message }` response, getting `undefined` for all fields.

**Fix**: Either:

- (a) Backend: Change register handler to return `AuthResponseDto` (like login/refresh), or
- (b) Frontend: After successful registration, immediately call `login` to get a proper `AuthResponse`

### 2. Refresh token endpoint path + shape mismatch

**Backend** (`AuthController.cs:71`): `POST /api/auth/refresh`

**Frontend** calls:

- `endpoints.ts:26`: `POST /api/auth/refresh-token`
- `client.ts:62`: `POST /api/auth/refresh-token`

**Backend** (`RefreshTokenCommand.cs`): Expects body `{ Token: string, RefreshToken: string }`

**Frontend** (`client.ts:62`): Sends body `{ refreshToken }` (single field, lowercase).

**Fix**:

- Backend endpoint: `/api/auth/refresh` → `/api/auth/refresh-token` (or change frontend to match)
- Body shape: Frontend must send `{ token, refreshToken }` or backend must accept `{ refreshToken }`

---

## High

### 3. Profile endpoints missing on backend

**Frontend** (`endpoints.ts:27-29`):

- `GET /api/auth/profile` — `auth.profile()`
- `PUT /api/auth/profile` — `auth.updateProfile()`

**Backend**: No `profile` GET/PUT routes exist in `AuthController.cs`.

**Impact**: Calling `auth.profile()` or `auth.updateProfile()` returns 404.

**Fix**: Add `GET /api/auth/profile` and `PUT /api/auth/profile` endpoints to the backend's `AuthController`.

### 4. Balances endpoint paths all wrong

**Frontend** (`endpoints.ts:32-35`):

- `GET /api/balances/trader` — calls this for traders
- `GET /api/balances/admin` — calls this for cooperative admins
- `GET /api/balances/system` — calls this for system admins

**Backend** (`BalancesController.cs`):

- `GET /api/balances/system` — SystemAdmin only ✅ (matches frontend)
- `GET /api/balances/my-balances` — any authorized user (this is what traders should call)
- `GET /api/balances/cooperative/{groupId}` — CooperativeAdmin only (this replaces `/admin`)
- `GET /api/balances/cycle/{cycleId}` — CooperativeAdmin only

**Fix**:

- Frontend `/balances/trader` → change to `/balances/my-balances`
- Frontend `/balances/admin` → change to `/balances/cooperative/{groupId}` (needs groupId parameter)
- Both endpoints need updated return type expectations

### 5. Trader balance response shape completely different

**Backend** (`TraderBalanceDto`):

```csharp
{ OverallTotalPaid: decimal, CycleBalances: [{ CycleId, CycleName, CycleType, TargetAmount, TotalPaid, RemainingAmount }] }
```

**Frontend** (`BalanceInfo`):

```typescript
{ walletBalance, totalSavings, totalEarnings?, activeCycles, pendingContributions, nextDueDate?, ... }
```

Zero fields match. Fix the frontend type or add a mapper.

### 6. Groups endpoint paths mismatch

**Frontend** (`endpoints.ts:48-58`):

- `GET /api/groups/my` — not found on backend
- `GET /api/groups/{id}` — not found on backend
- `POST /api/groups/requests/approve` → backend has `POST /api/groups/requests/{membershipId}/approve`
- `POST /api/groups/requests/reject` → backend has `POST /api/groups/requests/{membershipId}/reject`

**Backend** (`CooperativeGroupsController.cs`):

- `GET /api/groups` — list all (with search) ✅
- `POST /api/groups` — create ✅
- `POST /api/groups/{groupId}/join` — request join ✅
- `GET /api/groups/{groupId}/requests` — pending requests
- `POST /api/groups/requests/{membershipId}/approve`
- `POST /api/groups/requests/{membershipId}/reject`
- `GET /api/groups/{groupId}/members`
- `GET /api/groups/{groupId}/invite-link`

**Fix**:

- Remove `groups.myGroups()` and `groups.get()` or add those endpoints to backend
- Change approve/reject to use membershipId in URL path: `POST /api/groups/requests/${membershipId}/approve`

---

## Medium

### 7. Cycle type enum mismatch

**Backend** (`CycleType`): `Rosca=1, Asca=2, Personal=3`

**Frontend** (`CycleType`): `Individual, Group`

**Impact**: Cycles returned from backend will have types like "Rosca" / "Asca" / "Personal" but frontend only understands "Individual" / "Group". UI will not display cycle type correctly.

**Fix**: Align enums. Recommend backend also accepts "Individual"/"Group" or frontend maps Rosca→Group, Personal→Individual, Asca→Group.

### 8. SavingCycle response shape mismatch

**Backend** (`SavingCycleDto`):

```csharp
{ Id, Name, CycleType, ContributionAmount, IntervalDays, Status, TargetAmount, StartDate, EndDate, CreatedAt, Members?, IndividualSavingCycle? }
```

**Frontend** (`SavingCycle`):

```typescript
{
  ;(id,
    cycleType,
    cycleName,
    targetAmount,
    totalSaved,
    frequency,
    contributionAmount,
    startDate,
    endDate,
    status,
    memberCount,
    nextContributionDate,
    progress)
}
```

**Mismatches**:

| Field                  | Frontend expects         | Backend has                       |
| ---------------------- | ------------------------ | --------------------------------- |
| `cycleName`            | `cycleName`              | `Name`                            |
| `totalSaved`           | computed field           | not present                       |
| `frequency`            | enum (Daily/Weekly etc.) | `IntervalDays` (int)              |
| `memberCount`          | direct field             | must derive from `Members.length` |
| `nextContributionDate` | direct field             | not present                       |
| `progress`             | direct field (0-100)     | not present                       |
| `CreatedAt`            | not used                 | present                           |

**Fix**: Add computed fields to backend or map in frontend API layer.

### 9. CooperativeGroup response shape mismatch

**Backend** (`CooperativeGroupDto`):

```csharp
{ Id, Name, Description, AdminTraderId, AdminName, MemberCount, CycleCount, CreatedAt }
```

**Frontend** (`CooperativeGroup`):

```typescript
{ id, groupName, description?, memberCount, savingsGoal, totalSaved, createdBy, createdAt, isActive }
```

**Mismatches**:

| Field         | Frontend    | Backend                                       |
| ------------- | ----------- | --------------------------------------------- |
| `groupName`   | `groupName` | `Name`                                        |
| `savingsGoal` | exists      | not present                                   |
| `totalSaved`  | exists      | not present                                   |
| `createdBy`   | string      | `AdminTraderId` (Guid) + `AdminName` (string) |
| `isActive`    | boolean     | not present                                   |
| `CycleCount`  | not used    | present                                       |

### 10. Create group request shape mismatch

**Frontend** sends: `{ groupName, description?, savingsGoal }`

**Backend** expects: `{ Name, Description }` — no `savingsGoal` field.

**Fix**: Add `SavingsGoal` to `CreateGroupCommand` or remove it from the frontend request.

### 11. Create cycle request shape mismatch

**Frontend** (`CreateCycleRequest`):

```typescript
{ cycleName, targetAmount, frequency, contributionAmount, startDate, endDate, description?, groupId? }
```

**Backend** (`CreateSavingCycleCommand`):

```csharp
{ Name, CycleType, ContributionAmount, IntervalDays, CooperativeGroupId? }
```

**Mismatches**:

| Field          | Frontend    | Backend                              |
| -------------- | ----------- | ------------------------------------ |
| `cycleName`    | `cycleName` | `Name`                               |
| `targetAmount` | exists      | not present                          |
| `frequency`    | enum        | `IntervalDays` (int)                 |
| `startDate`    | exists      | not present                          |
| `endDate`      | exists      | not present                          |
| `description`  | exists      | not present                          |
| `CycleType`    | not sent    | required ("Rosca"/"Asca"/"Personal") |

### 12. Banks endpoint wrapped response + different path

**Backend** (`BanksController.cs`):

- `GET /api/banks` returns `{ success: true, data: [...] }` — wrapped
- `GET /api/banks/lookup?accountNumber=...&bankName=...` — uses `bankName` not `bankCode`

**Frontend** (`endpoints.ts:61-66`):

- `GET /api/banks` expects `Bank[]` directly from `r.data`
- `POST /api/banks/verify` with `{ accountNumber, bankCode }`

**Fix**:

- Frontend: unwrap `r.data.data` for bank list
- Frontend `verifyAccount()`: change to GET with query params, use `bankName` not `bankCode`

### 13. ContributionLedger fields mismatch

**Backend** (`ContributionLedgerDto`): `{ Id, SavingCycleMemberId, Amount, PaidAt }`

**Frontend** (`ContributionLedger`): `{ id, amount, transactionDate, transactionReference, status }`

**Mismatches**: Frontend expects `transactionReference` and `status` — neither exists in backend DTO. Frontend expects `transactionDate` — backend has `PaidAt`.

### 14. Approve/reject request shape

**Frontend** sends body: `{ membershipId, approve: boolean }`

**Backend** expects: membershipId in URL path, no body needed.

**Fix**: Frontend should call `POST /api/groups/requests/${membershipId}/approve` or `/reject` directly.

### 15. Cycle status enum mismatch

**Backend** (`CycleStatus`): `Pending=1, Active=2, Completed=3`

**Frontend** (`CycleStatus`): `Active, Completed, Liquidated, Defaulted`

Frontend has extra values (`Liquidated`, `Defaulted`) that backend never returns. Backend has `Pending` which frontend doesn't handle.

### 16. Liquidate endpoint path

**Frontend**: `POST /api/saving-cycles/{id}/liquidate`

**Backend**: `POST /api/saving-cycles/{id}/liquidate-early`

**Fix**: Change one to match the other.

### 17. Individual vs group saving cycles query

**Frontend**: `GET /api/saving-cycles/my`

**Backend**: `GET /api/saving-cycles/my-personal`

And the frontend doesn't call `POST /api/saving-cycles/individual` (individual cycle creation) or query by type (`personal/{id}`, `rosca/{id}`, `asca/{id}`).

### 18. SavingCycleMember lacks trader info

**Backend** (`SavingCycleMemberDto`): `{ Id, SavingCycleId, VirtualAccountNumber, VirtualAccountBank, PayoutOrder, Status, JoinedAt }`

**Frontend** (`CycleMember`): expects `{ id, userId, fullName, email, totalContributed, joinDate, status }`

Backend DTO has no trader name/email or contribution totals. The backend would need to join with Trader data to provide this.

---

## Summary

| Severity     | Count  | Impact                                     |
| ------------ | ------ | ------------------------------------------ |
| **Critical** | 2      | App crashes on register + refresh token    |
| **High**     | 4      | Profile, balances, groups endpoints broken |
| **Medium**   | 12     | Data rendering broken or incorrect         |
| **Total**    | **18** |                                            |

### Quick Wins (Fix on one side only)

1. Rename `SavingCycleDto.Name` → `cycleName` (frontend expects camelCase)
2. Add `totalSaved`, `memberCount`, `progress`, `nextContributionDate` as computed properties
3. Fix cycle type enum alignment
4. Add `/api/auth/profile` endpoints to backend
5. Fix approve/reject and liquidate URL paths
