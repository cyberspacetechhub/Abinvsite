# Backend Implementation TODO
Generated after full audit of current codebase state.

---

## AUDIT FINDINGS

### What exists and works
- Deposit creation, status update, list by user ✅
- Withdrawal creation, status update, list by user ✅
- Investment creation (via deposit + from balance), status, upgrade flow ✅
- Admin-managed DepositMethod (name, value/address, min/max, description) ✅
- Admin-managed WithdrawalMethod (name, min/max, description — no address field) ✅
- Client model has: balance, tradingBalance, pendingBalance, profitBalance, miningBalance, miningMachines ✅
- Transfer between accounts (funding ↔ trading ↔ mining) ✅
- KYC submit/approve/reject ✅
- Notifications, in-app messages ✅

### What is broken / missing / needs change

1. **Deposit does NOT store which account to credit**
   - Deposit model has no `targetAccount` field
   - `depositStatus` always credits `client.balance` (funding) regardless
   - Need: store `targetAccount` on deposit, credit correct field on approval

2. **Withdrawal does NOT deduct from funding account correctly**
   - `withdrawalStatus` deducts from `client.balance` ✅ (correct)
   - BUT `createWithdrawal` does NOT check if `client.balance >= amount` before creating
   - Need: balance check before creating withdrawal

3. **Withdrawal still references admin-created WithdrawalMethod**
   - Users should add their OWN withdrawal accounts (USDT address or bank details)
   - Admin no longer creates withdrawal methods
   - Need: new `UserWithdrawalAccount` model per client
   - Withdrawal should reference `UserWithdrawalAccount` not global `WithdrawalMethod`

4. **DepositMethod missing `qrCode` field**
   - Frontend DepositFlow shows QR code from `selectedMethod.qrCode`
   - DepositMethod model has no `qrCode` field
   - Need: add `qrCode` field to DepositMethod model

5. **DepositMethod missing `type` field**
   - Frontend filters methods by `type === 'wire'` or `type === 'bank'` vs crypto
   - DepositMethod model has no `type` field
   - Need: add `type` field ('crypto' | 'bank') to DepositMethod

6. **investmentStatus credits both `tradingBalance` AND `balance`**
   - Line: `client.tradingBalance += investment.amount; client.balance += investment.amount;`
   - This double-credits the client — should only credit `tradingBalance`
   - Need: remove `client.balance += investment.amount` from investmentStatus

7. **WithdrawalMethod admin routes still exist but should be removed**
   - `/api/withdrawalmethod` routes should be replaced with user withdrawal account routes
   - Admin withdrawal method CRUD is no longer needed

8. **No user withdrawal account management**
   - Users need to add/list/delete their own withdrawal accounts
   - Each account: type ('crypto'|'bank'), label, address/account details
   - Need: new model, service, controller, route

9. **Deposit `createDeposit` does not store `targetAccount`**
   - Frontend sends `account` field (Investment/Trading/Mining Account)
   - Backend ignores it
   - Need: store and use on approval

---

## TODO LIST (in order of priority)

### TODO 1 — Fix DepositMethod model
**File:** `backend/models/DepositMethod.js`
- Add `qrCode: { type: String }` field
- Add `type: { type: String, enum: ['crypto', 'bank'], default: 'crypto' }` field

### TODO 2 — Fix Deposit model + service
**Files:** `backend/models/Deposit.js`, `backend/services/depositService.js`
- Add `targetAccount: { type: String, enum: ['funding', 'trading', 'mining'], default: 'funding' }` to Deposit model
- Update `createDeposit` to store `data.targetAccount`
- Update `depositStatus` to credit the correct balance field based on `deposit.targetAccount`:
  - `funding`  → `client.balance`
  - `trading`  → `client.tradingBalance`
  - `mining`   → `client.miningBalance`

### TODO 3 — Fix Withdrawal service (balance check)
**File:** `backend/services/withdrawalService.js`
- In `createWithdrawal`, add check: `if (client.balance < data.amount) return { error: 'Insufficient funding balance' }`
- Withdrawal is always from `client.balance` (funding account only)
- On `withdrawalStatus` Completed: deduct from `client.balance` ✅ (already correct)

### TODO 4 — Fix investmentStatus double-credit bug
**File:** `backend/services/investmentService.js`
- Remove `client.balance += investment.amount` from `investmentStatus`
- Keep only `client.tradingBalance += investment.amount`

### TODO 5 — Create UserWithdrawalAccount model
**File:** `backend/models/UserWithdrawalAccount.js` (NEW)
```js
{
  user:        ObjectId ref User (required)
  type:        String enum ['crypto', 'bank'] (required)
  label:       String (e.g. "My USDT Wallet", "Barclays Account")
  // Crypto fields
  network:     String (e.g. "TRC20", "ERC20", "BTC")
  address:     String
  // Bank fields
  bankName:    String
  accountName: String
  accountNumber: String
  routingNumber: String
  swiftCode:   String
  isDefault:   Boolean default false
  timestamps
}
```

### TODO 6 — Create userWithdrawalAccount service
**File:** `backend/services/userWithdrawalAccountService.js` (NEW)
Functions:
- `addAccount(userId, data)` — create account for user
- `getUserAccounts(userId)` — list all accounts for user
- `deleteAccount(userId, accountId)` — delete if belongs to user
- `setDefault(userId, accountId)` — mark one as default

### TODO 7 — Create userWithdrawalAccount controller
**File:** `backend/controllers/userWithdrawalAccountController.js` (NEW)
Handlers:
- `handleAddAccount`
- `handleGetUserAccounts`
- `handleDeleteAccount`
- `handleSetDefault`

### TODO 8 — Create userWithdrawalAccount route
**File:** `backend/routes/userWithdrawalAccount.js` (NEW)
```
POST   /api/withdrawal-account/:userId        → handleAddAccount
GET    /api/withdrawal-account/:userId        → handleGetUserAccounts
DELETE /api/withdrawal-account/:userId/:id    → handleDeleteAccount
PUT    /api/withdrawal-account/:userId/:id/default → handleSetDefault
```
Register in `server.js` under `verifyJwt`

### TODO 9 — Update Withdrawal model + service
**File:** `backend/models/Withdrawal.js`, `backend/services/withdrawalService.js`
- Change `withdrawalMethod` ref from `WithdrawalMethod` to `UserWithdrawalAccount`
- Make `withdrawalMethod` optional (keep `address` as fallback)
- Update `createWithdrawal` to populate from `UserWithdrawalAccount`
- Update `withdrawalStatus` email to use account details from `UserWithdrawalAccount`

### TODO 10 — Remove admin WithdrawalMethod
**Files:** `backend/routes/withdrawalmethod.js`, `backend/server.js`
- Remove `app.use('/api/withdrawalmethod', ...)` from server.js
- Keep the model file for backward compatibility with existing records
- Remove admin frontend components: `AdminWithdrawalMethod`, `AdminWithdrawalMethodDetails`, `CreateWithdrawalMethod`, `UpdateWithdrawalMethod`, `DeleteWithdrawalMethod`

### TODO 11 — Update DepositMethod admin controller
**File:** `backend/controllers/depositMethodController.js`, `backend/services/depositMethodService.js`
- Add `qrCode` and `type` to create/update handlers
- Admin can upload QR code image (use existing cloudinary upload pattern from KYC)

### TODO 12 — Frontend: Add withdrawal account management
**File:** `frontend/src/components/client/withdrawal/` (NEW pages)
- `WithdrawalAccounts.jsx` — list user's saved accounts with add/delete/set-default
- `AddWithdrawalAccount.jsx` — form: choose crypto or bank, fill details
- Update withdrawal flow to select from saved accounts instead of admin methods

### TODO 13 — Frontend: Update DepositFlow
**File:** `frontend/src/components/client/deposit/DepositFlow.jsx`
- Already sends `account` field in step 1 — map it to `targetAccount` ('funding'|'trading'|'mining') before POST

### TODO 14 — Frontend: Update ClientDashb account cards
**File:** `frontend/src/components/client/ClientDashb.jsx`
- Mining account card `depositLink` should go to `/user/deposit-flow` with `?account=mining` pre-selected
- Trading account card `depositLink` should go to `/user/deposit-flow` with `?account=trading` pre-selected

---

## IMPLEMENTATION ORDER
1. TODO 1 (DepositMethod model)
2. TODO 2 (Deposit model + service)
3. TODO 3 (Withdrawal balance check)
4. TODO 4 (Investment double-credit fix)
5. TODO 5 → 8 (UserWithdrawalAccount full stack)
6. TODO 9 (Update Withdrawal to use UserWithdrawalAccount)
7. TODO 10 (Remove admin WithdrawalMethod)
8. TODO 11 (DepositMethod QR + type)
9. TODO 12 → 14 (Frontend updates)
