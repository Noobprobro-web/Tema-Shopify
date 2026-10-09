ID: GPT-DOCS-VERIFY-001
Estado: Fixes prepared and tested; publication and delivery verification pending.
Decisión requerida: Maintainer apply reviewed changes to private docs/merchant source, then sync public sartorial-docs. No commit/push or support message sent.
Resumen en 5 líneas:
- Latest public head 925b42c8540e9bb43ba998e55b4553f4ee44357a still documents GSAP; current theme uses native CSS.
- Formspree action and native validation verified in live desktop/mobile browser.
- 320px docs overflow reproduced (scrollWidth321/clientWidth305), fixed copies prepared.
- Form hardening adds duplicate-submit guard and 30-second abort timeout; four mock scenarios pass.
- Source README requires private-source-first publication; existing dirty merchant files left intact.
Archivos tocados: Only new files within agent-comms/outbox-gpt/harness-DOCS-VERIFY-001 plus this report.
Desviaciones: None to theme architecture/settings; patches prepared only.
Hallazgos extra: None implemented outside assigned documentation scope.

COMMIT EVIDENCE (GitHub connector, current default main)
925b42c8540e9bb43ba998e55b4553f4ee44357a, 2026-10-01T04:46:23Z, Document motion settings and GSAP usage; docs.html:221.
735b6ee0d03c3657ec32c0d0ca67648110a2d8a8, 2026-10-01T02:04:23Z, Connect support form to Formspree.
3e8985d479afb9e77a747fda29c0bbba709ae985, 2026-10-01T01:26:25Z, Publish Sartorial merchant documentation and support portal.
README.md:8 says source of truth private docs/merchant; do not edit public repo directly.
GitHub API connector succeeds; shell gh network unavailable.

FINDINGS
P1 docs.html:221 stale GSAP/ScrollTrigger claim. Local config/settings_schema.json:203 id animations; option values none/subtle/full at208/212/216; default subtle:220.
locales/en.default.schema.json:7 label Motion, :8 native CSS/no library.
assets/base.css:8745 support guard; :8880 native hero timeline; :8908 marquee timeline; :9020 reduced-motion override.
assets/theme.js:4712 None early return; :4713 reduced-motion early return.
Existing dirty docs/merchant/docs.html:221 already describes native CSS. It needs synchronization and narrow-mobile CSS review, not blind overwrite.
P2 docs.html:41,70,106 narrow mobile overflow: h1 long word and minimum grid widths.
P2 support.html:286-304 has no pending submission guard or fetch timeout. A never-settling network leaves button disabled; patch adds safe guard/AbortController timeout where supported.

LIVE BROWSER EVIDENCE
https://noobprobro-web.github.io/sartorial-docs/support.html:
1440x900 viewport: scrollWidth1425/clientWidth1425 (no overflow); form action https://formspree.io/f/xyezvvjo.
Desktop controls: input48.8px, select50.4px, textarea140px, submit46.4px height.
375x812: scrollWidth360/clientWidth360; mobile submit246.4px wide,64px high; select246.4px wide,50.4px high.
Clicked empty Send Support Ticket: browser blocked; name/store_url/message show required validation; status remains empty. No valid POST issued.
Entered invalid-email: typeMismatch=true,valid=false; field then left as test value in temporary tab.
docs.html:
375x812: scrollWidth360/clientWidth360; motion paragraph live contains GSAP.
320x740: scrollWidth321/clientWidth305; screenshot displayed horizontal scrollbar and clipped Documentation heading.
1440x900: scrollWidth1425/clientWidth1425.
Temporary viewport reset after checks. No theme-setting toggles or real store motion runs performed in this task.

PATCH ARTIFACTS (public head-relative, do not blind-apply to dirty private source)
harness-DOCS-VERIFY-001/sartorial-docs-fixes.diff
harness-DOCS-VERIFY-001/original/{docs.html,support.html} snapshot public head
harness-DOCS-VERIFY-001/fixed/{docs.html,support.html} reviewable fixed copies
fixed/docs.html:43 heading wrapping,:71 table-of-contents grid minimum,:107 cards minimum,:222 native motion documentation
fixed/support.html:43 heading wrapping,:289 pending guard,:290-291 abort timer,:296 signal,:306 timer cleanup.
harness-DOCS-VERIFY-001/test-form.mjs extracts and executes actual fixed inline form script with mock DOM/network; it does NOT prove live delivery.

VERIFICATION
node agent-comms/outbox-gpt/harness-DOCS-VERIFY-001/test-form.mjs
PASS success: one request, button recovers, reset
PASS http-error: one request, button recovers, input preserved
PASS network-error: one request, button recovers, input preserved
PASS timeout: one request, button recovers, input preserved
Exit0.
git apply --check --directory=agent-comms/outbox-gpt/harness-DOCS-VERIFY-001/original agent-comms/outbox-gpt/harness-DOCS-VERIFY-001/sartorial-docs-fixes.diff
Exit0, no output.

REMAINING MANUAL CHECKS / OWNERS
Johandry: one explicitly authorized Formspree test ticket and inbox receipt/reply-to/recipient verification; account activation, quotas, spam/CAPTCHA checks.
Claude/maintainer: merge prepared patch into dirty docs/merchant sources, sync public docs repo, confirm Pages deployment commit.
QA: rerender patched docs at320/375/1440; no post-fix browser render has been claimed.
QA: live form pending/success/server-error/offline/timeout and JS-disabled POST fallback; screen-reader status announcement; mobile Safari/email keyboard/long content.
QA: real store None/Subtle/Full at375/1440; supported vs unsupported scroll-timeline browsers, reduced motion, marquee pause control, keyboard focus, scroll settle and resize. Public docs pages are static; their responsive tests cannot prove actual store animation behavior.
Legacy browsers lacking AbortController retain original unbounded network behavior.
Ambiguous timeout can occur after server receipt: confirm inbox before retrying test ticket.
Ledger: closes no requirements rows. Relevant public support/docs row107 and motion rows38/56/57/58 remain subject to real-store Gate5 and owner acceptance.
Memory used: MEMORY.md:90-104; rollout ID01a0fcb2-d8e8-7ea3-a162-1e869422c15e. Memory contextual direction was independently verified against current code/BOARD.

