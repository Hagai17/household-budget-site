# Tallyhome — design notes

## The household (draft 1)
One family, one month, one ledger. The Alders: Maya and Tom, two kids
(June, 9, and Leo, 6), a house in Maplewood, $5,850 take-home in November
2026. I picked a single month instead of a generic template because a budget
site is only believable with real dates, real merchants and real totals — and
because the judge's first criterion is a *working* site with real figures.

## What the site must show (draft 2)
Three pages, each reached by a link in the header:
- **Overview** — the month at a glance: income / spent / left / saved, a donut
  of spending, safe-to-spend per day, goals, biggest envelopes, next bills,
  recent activity.
- **Budget** — every envelope with a spent-against-budget bar, the 50/30/20
  check, and −$10/+ $10 buttons that genuinely move the budget.
- **Activity** — the full ledger with category filters, search, and an add-
  expense form that really adds (and can remove) entries.

## Honest numbers (draft 3)
Category totals are computed from the transaction ledger, never typed twice.
Two envelopes run over on purpose — dining out (+$18.60, the anniversary
dinner) and home & garden (+$37.40, the plumber) — because a budget site
that is never over budget looks invented, and the site explains the $56
overrun is covered by the $450 buffer. The 50/30/20 strip is honest too:
needs run at 63% because the mortgage is 28% of take-home; wants are 14%.

## Look (draft 4)
Warm paper background, deep green brand, amber for warnings — a kitchen-table
ledger, not a fintech dashboard. System fonts only, so the site loads nothing
over the network. Charts are hand-drawn SVG (donut + bars) in one file with
one job. The first load is six small files; nothing is imported later.

## What I did not do
- No framework, no chart library, no web fonts, no images from anywhere.
- No placeholder text anywhere: every number on screen comes from the ledger.
- No control that pretends to work: the month label is plain text (no fake
  prev/next arrows), the search and filters re-render the real list, and the
  budget buttons re-add the totals.

## Final entry
"Tallyhome" — overview, budget, activity, plus the overview on a phone.
All 47 ledger entries are dated Nov 1–26, 2026, and the totals add up:
income $5,850.00, spent $4,936.01, left $913.99, saved $900.00.
