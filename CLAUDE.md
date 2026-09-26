# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Playwright + TypeScript end-to-end test suite for the demo shop at https://practicesoftwaretesting.com (overridable via `BASE_URL` env var).

## Commands

```bash
npm install                                   # install dependencies
npx playwright install chromium               # install the browser binary (one-time)
npx tsc --noEmit                              # type-check the project
npx playwright test                           # run the full suite
npx playwright test tests/cart/cart.spec.ts   # run one file
npx playwright test --grep "CH01"             # run one test by its ID
npx playwright test --grep "@regression"      # run tests by tag
npm run test:headed                           # run with the browser visible
npm run test:ui                               # open Playwright UI mode
npm run test:report                           # open the last HTML report
```

`npm test` only runs the `C01` test in headed mode — it is not the full-suite command.

There is no lint script configured; `npx tsc --noEmit` is the only static check.

## Architecture

Page Object Model with a facade layer and Playwright fixtures wiring it together:

- **`pages/`** — one class per site page/section (`HomePage`, `ProductPage`, `CartPage`, `CheckoutPage`), each holding that page's locators and low-level actions. `BasePage` provides a shared `navigate()` helper but the other page classes do not currently extend it.
- **`common_actions/shop.facade.ts`** (`ShopFacade`) — composes page objects into multi-step user flows used across tests, e.g. `addToCart`, `addToCartAndGoToCheckout`, `fullGuestCheckout`. Prefer extending the facade for new cross-page flows rather than duplicating steps in tests.
- **`fixtures/index.ts`** — extends Playwright's `test` with fixtures for each page object plus `shopFacade`, and re-exports `expect`. Tests import `test`/`expect` from `../../fixtures`, not from `@playwright/test` directly.
- **`data/`** — shared test data (`PRODUCTS`, `USERS`) referenced by tests instead of inline literals.
- **`utils/helpers.ts`** — standalone helper functions (`addProductToCart`, `loginViaUI`, `parseCurrency`) that predate/overlap with the facade; some tests use these directly instead of `ShopFacade`.
- **`tests/`** — specs grouped by feature (`cart/`, `checkout/`, `product/`). Each test has an ID prefix (e.g. `C01`, `CH01`, `P01`) and is tagged `@regression`.
- **`tests/auth.setup.ts`** — logs in via UI and saves storage state to `auth.json` (run via `npm run setup`); not currently wired into `playwright.config.ts` as a dependency project, so it must be run manually if a test needs an authenticated session.

## Configuration notes (`playwright.config.ts`)

- Single `chromium` project, `baseURL` from `BASE_URL` env var (via `dotenv`), defaults to the live demo site.
- Screenshots on failure, traces retained on failure, video off, 15s test timeout, retries disabled, fully parallel.
