---
name: run-contact-tests
description: Runs the Playwright regression suite for the Contact page (tests/contact/contact.spec.ts) at practicesoftwaretesting.com/contact and reports pass/fail results as a summary table. Use whenever asked to run, execute, verify, or re-check the Contact page tests/cases.
---

# Run Contact page test suite

Executes the Contact page automated test cases (CN01–CN05: happy-path submit, empty-form
validation, message-length validation, invalid-email validation, subject dropdown options)
and reports the outcome. This wraps the Page Object at `pages/contact.page.ts` and the spec
at `tests/contact/contact.spec.ts`.

## Steps

1. If `node_modules/` is missing, say so and run `npm install` first (one-line explanation
   before running, per project policy).
2. If the Chromium browser binary is missing (error like "Executable doesn't exist"), run
   `npx playwright install chromium` once, then retry.
3. Run the suite serially (this project's `BasePage.navigate()` targets a single live public
   site, and each test hits its own live HTTP endpoints — serial execution has proven far more
   stable than parallel workers here):

   ```bash
   npx playwright test tests/contact/contact.spec.ts --workers=1 --reporter=list
   ```

   Add `--headed` if the user asked to see the browser.

4. Parse the list-reporter output into a summary table: Test ID (parse from the test title,
   e.g. `CN01`), case name, ✅ Pass / ❌ Fail, and duration. Include failure reason text for any
   failing test (assertion diff or error message), not just "failed."
5. Delete `test-results/` and `playwright-report/` afterward (these are run artifacts, not
   source — leave the repo clean). Do not delete anything else.
6. If a test fails, distinguish between:
   - **A real code/locator regression** — the site's HTML/data-test attributes changed, or the
     Page Object logic is wrong. Flag this clearly as something to fix.
   - **Live-site flakiness** — e.g. the demo backend (`api.practicesoftwaretesting.com`)
     intermittently returns `500` on identical valid requests, or a `networkidle`-style wait
     timing out due to background widgets. This has happened before on this suite. Re-run the
     specific failing test once to check if it's transient before reporting it as a real bug.
7. Report: a summary table of all 5 cases, and one line noting whether the run was clean or
   flaky (and why, if flaky).
