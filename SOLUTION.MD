# Retail Shopping App - Solution Document

## Table of Contents
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Screens](#screens)
- [Testing](#testing)
- [Reviewer Checklist](#reviewer-checklist)
- [Assumptions](#assumptions)
- [Repository Structure Rationale](#repository-structure-rationale)
- [Data Persistence Model](#data-persistence-model)
- [Discount Catalogue and Engine](#discount-catalogue-and-engine)
- [Full Suite Equivalent Command](#full-suite-equivalent-command)

## Getting Started

### Prerequisites
- Node.js v22.11.0+
- npm v10+
- Mobile development setup (Android SDK or Xcode)

If build tools are not installed, use:
- React Native setup guide: https://reactnative.dev/docs/set-up-your-environment
- Android Studio: https://developer.android.com/studio
- Node.js download: https://nodejs.org/en/download

### Tested Device
- Tested on Android emulator only
- iOS was not tested in this submission
- Device: Pixel 3a emulator
- Android version: API 36

### Setup Steps (including config)
1. Clone the repository:
```bash
git clone https://github.com/toba321/retail-shopping-app.git
cd retail-shopping-app
```

2. Install dependencies:
```bash
cd server
npm install
cd ../app
npm install
cd ..
```

3. Configure the backend URL based on your setup:

The backend will run on `localhost:3000` on your machine. Choose the address your app should use:
- **Android emulator on your machine**: `http://10.0.2.2:3000` (10.0.2.2 is how the emulator refers to your machine's localhost), or use your emulator's local address if different
- **Physical device/different machine**: Use your machine's local IP address, e.g., `http://192.168.1.23:3000`

Open `app/src/config.ts` and update this line with your chosen address:
```typescript
export const API_BASE_URL = 'http://10.0.2.2:3000'; // Replace with your chosen address above
```

4. Start the backend in one terminal:
```bash
cd server
npm run start
```
Backend will run at `http://localhost:3000` on your machine.

5. Start the React Native development server in another terminal:
```bash
cd app
npm run start
```

6. Launch the app on your emulator in a third terminal:
```bash
cd app
npm run android
```

If you see a message asking about port 8081, select **No** to keep it on the same port as the running app:
```
info Another process is running on port 8081.
? Use port 8082 instead?
>   Yes
    No  ← Select this
```

## Architecture

### Directory Structure
```text
app/
  src/
    components/
    hooks/
    navigation/
    screens/
    services/
    store/
    types/

server/
  src/
    cart/
    checkout/
    discounts/
    products/
```

### API Endpoints

| Area | Endpoint | Purpose |
|---|---|---|
| Products | GET /products | List product catalogue with current stock |
| Products | GET /products/:id | Get product details |
| Discounts | GET /discounts | List active discounts |
| Discounts | GET /discounts/:id | Get discount details |
| Cart | GET /cart | Get current cart state |
| Cart | POST /cart/items | Add or set quantity for a cart item |
| Cart | PUT /cart/items/:productId | Update item quantity |
| Cart | DELETE /cart/items/:productId | Remove item from cart |
| Checkout | POST /checkout | Execute checkout and return order summary |

### Approach

- SOLID Principles: Business logic stays in hooks/services, UI logic stays in components.
- Separation of Concerns: Components focus on presentation; hooks and services manage state and side effects.
- Modular Components: Features are organized by domain (common, product, cart, checkout).
- Reactive Updates: Zustand store updates automatically re-render subscribed UI.
- BFF Pattern: NestJS backend is tailored to the mobile client workflow.
- Error Handling: API errors are transformed into user-readable feedback in the app.
- Discount Handling: Frontend selects a discount code, backend validates and applies it during checkout.

### Repository Structure Rationale

This repository has two top-level folders:
- `app`: React Native mobile app
- `server`: NestJS Backend for Frontend (BFF)

Why this structure was used:
- Reviewers only need one clone to run both parts.
- The full customer flow (mobile + API) can be tested in one place.
- Setup and troubleshooting are simpler because all commands are in one repository.

### Data Persistence Model

This solution uses in-memory storage only (no database).

What is stored in memory:
- Products: seeded when the BFF starts.
- Discounts: seeded when the BFF starts.
- Cart state: created and updated while the BFF is running.

Reset behavior:
- When the BFF restarts, products and discounts return to their initial seeded values.
- All cart data is also reset on restart.

### Discount Catalogue and Engine

Seeded discounts:
- `D1`: 10% off orders over 100.
- `D2`: 5 off purchase.

How discounts are applied:
- Discounts are checked at checkout.
- The customer can provide one discount code.
- If the code is invalid or subtotal requirements are not met, checkout returns a clear error message.
- Fixed discounts are capped so the total never drops below zero.
- Checkout returns a clear summary with subtotal, discount applied, and final total.

## Screens

### Product Listing
- Shows all seeded products from the backend
- Displays product name, price, and stock availability
- Opens Product Detail when a product is selected

### Product Detail
- Shows full product details for a selected item
- Lets the user set quantity and add/update that item in cart
- Shows quantity currently in cart for the selected product

### Cart
- Shows all cart items with quantity controls and remove action
- Shows running totals
- Shows reservation timer while the cart is active
- Navigates to Checkout

### Checkout
- Shows order review, discount code input, and final purchase action
- Displays selected offer details
- Validates checkout and displays success/failure with user-readable message

## Testing

This project follows a testing pyramid:
- Unit tests for core business logic
- Integration/controller tests for API behavior
- End-to-end tests to check the full API flow works

### Test Commands

Run from the project root folder:

```bash
cd server
npm test
npm run test:e2e
cd ../app
npm test -- --runInBand
```

`--runInBand` runs tests one-by-one instead of in parallel, which makes React Native test runs more stable on local machines.

### Full Suite Equivalent Command

Equivalent full-suite run from the repository root:

For Bash:

```bash
cd server && npm test && npm run test:e2e && cd ../app && npm test -- --runInBand
```

For PowerShell 5.1:

```powershell
cd server; npm test; npm run test:e2e; cd ../app; npm test -- --runInBand
```

### Test Coverage Table

| Test Name | Description |
|---|---|
| Backend: Products service tests | Seeded product data, product lookup, and stock updates |
| Backend: Products controller tests | Product endpoint response behavior |
| Backend: Discounts service tests | Discount seed data, lookup by code, and discount calculations |
| Backend: Discounts controller tests | Discount list and detail endpoint behavior |
| Backend: Cart service tests | Cart add/update/remove behavior and cart-state lifecycle outcomes |
| Backend: Cart controller tests | Cart endpoint behavior for item and total updates |
| Backend: Checkout service tests | Checkout success/failure, stock validation, and discount validation |
| Backend: Checkout controller tests | Request payload forwarding from controller to service |
| Backend: E2E API test | App boot and key endpoint response over HTTP |
| Frontend: App render test | Root app render with providers/navigation shell |
| Frontend: Product detail screen tests | Product display and quantity input behavior |
| Frontend: Cart store tests | Cart state fetch/add/remove flows |
| Frontend: Checkout hook tests | Best-discount auto-selection and invalid-discount blocking |

## Reviewer Checklist

- [ ] Clone the repository and follow `SOLUTION.MD` to run both the BFF and the React Native app
- [ ] Launch the React Native app and, as a customer, browse the pre-seeded catalogue, manage a cart, and complete checkout
- [ ] Verify that a successful checkout updates stock levels in the BFF
- [ ] Verify that checkout is blocked when stock is insufficient, with clear user feedback
- [ ] Verify that stock reservations are released if a cart is inactive for 2 minutes

## Assumptions

Assumptions used in this implementation:
- I used React Native CLI (Bare Workflow) instead of the React Native Expo framework to ensure maximum flexibility and alignment with enterprise-grade environments.
- The app automatically picks the best discount for the user, with manual override still available.
- I allowed users to add more than available stock to the cart so the checkout flow can clearly demonstrate stock failure handling.
- Authentication is out of scope, so checkout runs under a single demo user.
- Payment is simulated will fail 20% of the time, so failure and retry messaging can be demonstrated.
- I validated runtime behavior on Android emulator; iOS runtime testing was not completed.
