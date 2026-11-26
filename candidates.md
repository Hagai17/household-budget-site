# Candidates & build record — Tallyhome (best-household-budget-site-20261126-1457)

## The kit contract (read first, followed exactly)

- Repo: `main.ts` (Node 22, stdlib only) + `vendor/makefun-frontend.ts` (kit
  copy, byte-identical, sha256 4c8da1c8…) + `app/` static site + `screenshots/`
  (3–4 real browser renders, ≤256 KiB each, long side ≤1280, short ≥360) +
  OSI LICENSE.
- `main.ts` copies `app/` and `screenshots/` to the output dir and writes
  `dossier.json` via `buildDossier` — the gate rebuilds it and compares byte
  for byte.
- The site must work offline from its own files: no network loads of any
  kind (scripts, styles, fonts, images all local or `data:`), no build step.
- Judge (z-ai/glm-5.3-flash) sees a contact sheet of the screenshots (cover =
  first by name, fitted 768×480; the rest small beneath) plus a short source
  outline (Totals line + file declarations). Criteria, in order:
  1. a working budget site in the screenshots — pages/tools/sections reached
     by links, real figures, controls that do what they say, nothing empty
     or placeholder; screenshots and outline must agree;
  2. content & usefulness — specific, complete, actionable;
  3. ease of use — navigation, hierarchy, phone layout, readable type;
  4. look & originality — own identity, coherent palette, fitting charts;
  5. speed & structure — small first load, no heavy framework, source split
     into files with one clear job each, named for what they do.

## Field scan

The submissions API showed **zero entries** when checked at build time
(competition opened 2026-11-26 14:57 WIB; blind rounds hide live ranks
anyway). The real benchmark is therefore the four fixed house sites and the
starter (house site #2 — a plain recipe list). Differentiation chosen:
completeness of *tools* (a working calculator, a working add-transaction
ledger, filters) over decoration, and one-ledger consistency — every figure
on every page is summed from the same transaction list, so no two pages can
disagree. That is the claim most budget-site entries will fail: hand-typed
totals that drift apart between pages.

## Design choices

- **One fictional household, one month, fully worked**: the Reyes family,
  November 2026, day 26 of 30. Income $5,860 (two salaries, overtime, one
  sale); 16 budget categories in Needs/Wants/Savings; 33 transactions whose
  sums produce every displayed figure. Category actuals are never stored —
  they are summed from the transactions, so the donut, the budget table, the
  activity totals and the stat cards agree by construction.
- **Real imperfections, honestly labelled**: eating out is over plan by
  $15.05 (a family dinner), subscriptions run $1.97 over, $167 of income is
  deliberately "unassigned — the shock absorber". A budget with no friction
  reads as a placeholder; the judge's first criterion punishes empty gloss.
- **Tools that work**: hash-routed six pages (Overview, Budget, Activity,
  Bills, Goals, Guide); add-transaction form that re-renders every total;
  category filter; 50/30/20 calculator that recomputes on each keystroke and
  compares the rule with the household's own 65/10/22 split; goal finish
  dates computed from saved/target/monthly, not typed.
- **Charts drawn by hand** (`charts.js`, inline SVG: donut, grouped bars,
  progress bars) — no library at all, so the first load is just the page,
  one stylesheet and five small modules (~46 KB raw total).
- **Identity**: "Tallyhome" — paper-ledger styling (cream, deep green ink,
  amber warnings), serif display type from system stacks only; no webfonts,
  no images, nothing fetched.

## Iteration record

1. **v1 build**: data.js (ledger), money.js, charts.js, index.html,
   style.css, views.js (six views), main.js (router + wiring). Served with
   the kit's serve.ts; four screenshots taken in Chromium (1280×800 desktop
   ×3, 390×844 phone ×1; 63–140 KiB each).
2. **Screenshot review → v2 edits** (two separate revisions of views.js):
   - `splitTable`: dropped a dead variable and added a "Share of that pay"
     column, so the calculator answers in percentages as well as dollars.
   - Donut widened from top-6 to top-7 slices ("Everything else" fell from
     23% to 19% of spending).
   - Shots re-taken with intent: budget shot scrolled so the savings rows,
     the totals row and the calculator share one frame; activity shot taken
     with the filter set to Groceries (5 payments, $577.91 — visibly tying
     to the budget page).
3. **Headless smoke test** (Puppeteer, all assertions on rendered text):
   adding "Bakery on Alder Street, $12.40, Groceries" on the activity page
   appears in the list, moves the out-total to $5,211.26, and the overview
   then shows the same $5,211.26 and groceries at $590.31; setting the
   calculator's pay to $4,000 re-renders the needs target as $2,000 with
   updated verdicts; all six routes render 1,200–2,800 characters of content.
4. **Hand-in check**: `main.ts` run twice into separate output dirs; the two
   dossier.json files are byte-identical (deterministic), and the output
   holds app/ (7 files) + 4 screenshots + dossier.json, all inside the
   gate's caps.

## Honest assessment

Strengths: completeness (six linked, fully populated pages), one-ledger
consistency that survives cross-checking between screenshots, two genuinely
interactive tools plus a form whose effects are visible across pages, a
tiny first load, and an original identity that is not a fintech-dashboard
clone. Weaknesses: the design is deliberately quiet — a rival with richer
visual polish could take criterion 4; the bills and goals pages are not in
the screenshot set (the cover shows upcoming bills and the emergency fund,
and the outline names billsView/goalsView); and with blind rounds and an
empty early field, the house sites are the only calibration — the starter
(house #2) is far weaker than this entry, but the strongest house site is
unknown. The entry should clear the gate cleanly and compete on criteria
1–3 and 5; criterion 4 is where it can be beaten.
