# R-A / R-B preview harness — D28 host policy

This scoped Playwright runner targets the unpublished previews of `tema-qkqpke0j.myshopify.com`:

| Preset | Allowed theme ID |
| --- | --- |
| Sartorial | 190232297715 |
| Imprint | 190232330483 |
| Archive | 190232363251 |

Before **every** execution, the coordinator must run a fresh read-only Shopify theme inventory and confirm that each selected ID is still unpublished. For example, from the prepared worktree with the local token environment variable:

```powershell
shopify theme list --store tema-qkqpke0j.myshopify.com --role unpublished --no-input
```

This precondition is external to the harness. The script does not execute Shopify CLI, use the token for Admin requests or claim to verify publication role. It restricts IDs to the three above and requires `Shopify.theme.id` to match the selected ID before tests. Stop if inventory cannot confirm unpublished status.

## Modes and local environment

Both `STOREFRONT_PASSWORD` and `SHOPIFY_CLI_THEME_TOKEN` must exist locally. No value is passed as a command argument or written to a file. The password is used only for one authentication operation at the exact API endpoint, with resends permitted only after HTTP 429 as described below. The token is checked for presence and included in the in-memory redaction guard; it is not sent by this harness.

Run exactly one mode after independent review:

```powershell
node agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs --read-only
node agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs --inventory
node agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs --cart
```

Default is all three previews. An optional `--theme=190232297715` (or one of the other two IDs) selects one ID; lists are not accepted. Each preview gets a fresh nonpersistent BrowserContext. No storageState, cookies, HAR, trace, screenshots, raw exceptions, response bodies, node HTML, selectors, DOM text or form values are saved.

## Network policy authorized by Johandry, 2026-11-05

| Method / mode | Allowed destination |
| --- | --- |
| GET or HEAD, every mode | Exact HTTPS host `tema-qkqpke0j.myshopify.com`, `cdn.shopify.com` or `fonts.shopifycdn.com`, with no pathname restriction. No wildcard hosts or nondefault ports. |
| POST authentication | Exact store endpoint `/password`, no query/fragment, one operation through the context API client; HTTP 429 retries remain on this same endpoint. |
| POST cart, only `--cart` | Exact store paths `/cart/add.js`, `/cart/update.js`, `/cart/clear.js`, no query/fragment, after matching preview identity and verifying the session cart initially empty. |
| Every other method / destination | Blocked. In particular no product/app/metafield/config mutation, checkout/payment POST, or `/cart/change.js`. |

GET/HEAD requests retain their actual query where needed by Shopify; output never stores it. Every server redirect is fetched with automatic redirects/retries disabled and its destination host is revalidated before another read hop. Cross-host reads are allowed only within the same three-host set. Authentication accepts only 302/303 to store origin and `/`, discards Location query/fragment and never follows or replays the POST to a redirect destination; the next GET is locally constructed with the selected preview ID. All other API redirects and all browser POST redirects fail closed. Location/Refresh response headers are not returned to Chromium for automatic navigation.

External CDN/font reads use a fresh empty-cookie API client per hop and constant Accept/User-Agent headers; browser Cookie, Authorization, Referer, Origin and custom headers are not copied. External Set-Cookie/WWW-Authenticate response headers are not fulfilled to the browser. The runner never selects a checkout or payment control, submits checkout, or navigates intentionally outside the fixed suite/cart pages. GET resource permission does not authorize purchase or mutation.

All other hosts are blocked as warnings. The known analytics/pixel warning list is `monorail-edge.shopifysvc.com`, `www.google-analytics.com`, `region1.google-analytics.com`, `analytics.google.com`, `www.googletagmanager.com`, `stats.g.doubleclick.net`, `connect.facebook.net`, `www.facebook.com`, and `analytics.tiktok.com`. D28 platform/preview noise is also blocked as warning: `bugsnag.com` and its subdomains, `notify.bugsnag.com`, `sessions.bugsnag.com`, `shop.app`, `www.shop.app`, `pay.shopify.com`, `checkout.shopify.com`, `accounts.shopify.com`. This list classifies warnings; it grants no request permission. An unlisted host is also blocked and reported safely. A required blocked host must be reviewed by Johandry; the harness never authorizes it itself.

A blocked host, analytics request or WebSocket does not directly fail the run or set the router-failure flag. Actual functional assertions may still fail; network warning context must be reviewed before attributing a defect to the theme. Resource filtering can still affect results.

## HTTP 429 and cart pacing

API and browser-router HTTP 429 responses allow at most **three retries after the first attempt**. Each retry waits for the greater of exponential backoff (1, 2, then 4 seconds) and `Retry-After`, parsed as delta-seconds or an HTTP-date. A valid server delay is never shortened; missing/invalid headers use backoff. Other transport/HTTP errors do not trigger this retry policy. Transport retries remain zero, and each retry uses the same allowed method/destination without following a POST redirect.

All store cart requests pass through one serial queue, including API calls, browser reads, retries and cleanup. Their start times are separated by at least **one second**. A 429 also establishes a cooldown for subsequent requests to that host. Before repeating a non-idempotent add after 429, the harness reads the same session cart with this retry policy: a matching one-unit expected line confirms the add without replay; another add is allowed only after a valid empty/no-note reading. Unknown or unexpected state stops the workflow and enters cleanup. Variant/plan identifiers and cart bodies used for this comparison stay in memory.

## Safe outputs

JSON files are written under `results/`. `networkWarnings` contains severity, fixed method/resource/reason enums, host and pathname **without query/fragment**, redaction flags/reasons and occurrence counts. Safe blocked hosts are reported even when not in the permitted set. Hostnames must satisfy a bounded DNS grammar; pathname length is limited to 1024 and a bounded ASCII grammar. A common guard compares candidate variants against nonempty environment values whose names match token/password/passwd/pwd/cookie/secret/auth/credential/key, using NFKC, trim, case folding and up to three URL-decode steps. Sensitive/unsafe fields are null with a fixed reason. Warnings are deduplicated and capped at 200 per session, with omitted-occurrence counts, and guarded again before writing. No complete URL, query, URL fragment, cookie, header, body, token or form value is emitted. Console output uses result basenames and fixed result/intervention codes; arbitrary operator input is never echoed or retained.

`deniedResourceSummary` retains fixed root/extension/reason categories and counts. `sourceSuffix` is only `base_css`, `theme_js`, `shopify_xr_js`, `product_zoom_js` or `other`, compared in memory from local-source literals. These lexical categories do not prove asset identity, route ownership or a theme defect. They do not affect permissions.

`--inventory` only loads home/collection/product to observe denied static GET/HEAD resources, without running functional/axe/keyboard/cart tests. Its `scopeResult` is always `inventory_only`; `executionResult` reports whether loading completed. Its additional `inventoryResources` rows store only a known host, categories and salted SHA-256 fingerprints. The private per-run salt is never emitted, and raw pathname is not stored in that hash inventory. Unknown/unsafe candidates have host/fingerprint null. It is capped at 100 deduplicated rows per session. The separate `networkWarnings` host/path diagnostics still follow the host/path permission above. Inventory never expands the policy or certifies R-A/R-B.

## Executable scope and limits

`--read-only` checks unlocked/identity-matched home, collection and product at 390×844 and 1280×800, horizontal overflow, 32 Tab steps plus reverse Tab, controlled/hash-pinned axe 4.10.2 with fixed rule IDs, rendered language-button name matching, menu viewport crossing and empty-cart drawer open/close. CSS focus-indicator counts and H1 counts are observations. Known preview toolbar iframe is excluded from axe; source review is still needed for violations/incomplete results. No claim of axe 4.14, measured focus contrast, Spanish language change or screen-reader output is made.

`--cart` performs a minimum PDP add and note smoke test only. After external unpublished preflight and exact preview identity, GET cart must have numeric nonnegative integer item_count, a coherent items array and null/string note, with zero items and empty note. A nonempty/unreadable initial cart prevents authorization and is never cleared. The actual visible PDP form must be supported, available and request exactly one unit; no quantity, variant ID, note value or other form value is saved. One server line/item is verified, the populated drawer is checked at 390 and 1280, and a synthetic in-memory multiline/emoji note is updated via the permitted endpoint and compared in memory to the server echo.

In the same BrowserContext, its final `finally` waits for an initiated add, sends clear and empty-note update, then GET cart. **The R-B cleanup check passes only when clear, update and final read have successful HTTP responses and the strict final reading proves zero items/lines and an empty note.** Each operation uses the HTTP 429 retry policy above.

The context-close guard has a separate condition: a final valid read must prove the cart empty and note empty. It may therefore close a verified-empty context even if the clear/update responses made the cleanup check fail; that failure remains in the report and does not become a pass. If final state cannot be verified, the report records `CART_CLEANUP_UNVERIFIED` and the process, headless context and browser remain held without automatic timeout/closure. An operator can send the exact command `retry-cleanup` through the still-open process stdin to request another cleanup of that same session. Only verified empty/no-note state permits closure; preserve the process for intervention. No other input is echoed or stored.

API calls share only that context's cookie jar, including when cleanup must proceed after a renderer/navigation failure. Cleanup permission remains restricted to the two fixed cart endpoints; no checkout or payment is attempted.

A successful smoke run is `completed_with_limits`, never full R-A/R-B or Lote 0 acceptance. Still pending: complete A-03 contrast/schemes/backgrounds/states/motion matrix; A-02 controlled settings; C-08 explicit content/contact matrix; full B-01 editor/cart-from-menu matrix; actual B-05 language change and required axe-version checks; B-03 lost-response/retry, featured/quick-add/sticky/complete-the-look, min/step/many lines and plan cases; full B-04 UI note/slow/offline/in-flight cases. Quantity/delete cases needing `/cart/change.js` are not enabled by this decision. Johandry's C-R0-4 subscription fixture remains pending; do not create products, plans, metafields or apps to fill it. Checkout/payment and accelerated checkout remain uncertified and are never executed.
