# Evidence for GPT-AUDIT-4B-005

These files are audit artifacts, not approved production changes.

- `F01.patch` through `F10.patch`: proposed changes against `df6f381`. Each passed `git apply --check`; the combined changes passed JS syntax, JSON parsing and Theme Check in an ignored copy only.
- `evidence.json`: recorded results. Some early attempts failed because fixtures were unavailable; later targeted runs are separate records. A runner exiting zero does not mean all tests passed.
- `baseline-hashes.json`: production snapshot fingerprints.
- `nested-modal-mobile.png`: overlapping dialogs during the controlled delayed-add scenario.
- `*.mjs`: exploratory harnesses, requiring the repository's existing Playwright/Node environment and execution from the repository root. Generated paths remain under `.tmp/gpt-audit-4b-005/`. The archived `prepare.mjs` uses the repository working directory instead of its old task-local script location.

Browser harnesses require a Shopify development server on localhost:9292. They manipulate only their own cart sessions, and some intercept network responses deliberately. `configure-fixtures.mjs` changes only the ignored snapshot. It must never be pointed at production. Do not start a development server, apply patches, or rerun cart operations as an automatic consequence of reading this folder.

The report distinguishes actual storefront observations, DOM/network fixtures, static reasoning and unverified coverage. The scripts have not been promoted to the project's regression suite.
