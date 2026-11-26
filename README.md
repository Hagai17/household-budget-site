# Tallyhome — the Alder family's household budget

[![Make the best household budget site](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=makefun)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Hagai17/household-budget-site/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=makefun)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Hagai17/household-budget-site/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=makefun)

Tallyhome is a household budget site for one family — the Alders of Maplewood —
for November 2026. Every dollar of their $5,850 take-home has a job, and the site
shows it: envelopes for each category, the bills coming up, savings goals, and
every expense listed. It works offline, on a desktop and on a phone, from its
own static files. No accounts, no ads, no trackers, nothing loaded over the
network.

## What it does

- **Overview** — income, spent, left and saved at a glance; a donut of where the
  money went; "safe to spend" per day for the rest of the month; the biggest
  envelopes, the next bills, and the latest activity.
- **Budget** — all 13 envelopes with spent-against-budget bars, a 50 / 30 / 20
  check, and −$10 / +$10 buttons that really move the budget and re-add the
  totals. Two envelopes are over budget this month (dining out and home &
  garden) and the site says so plainly, with the buffer covering them.
- **Activity** — the full ledger, newest first, with category filters, a search
  box, and a form that adds a real expense: it appears at once, updates every
  total on the site, and can be removed again. Added entries and budget tweaks
  are saved on the device (localStorage) and nothing leaves it.

Every figure is computed from the transaction ledger in `app/data.js` — category
totals are the sum of their transactions — so the numbers on screen can never
disagree with the books.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (writes the dossier the judge reads):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the
  output directory and writes `dossier.json` with the vendored library.
- `serve.ts` — a tiny static server for local use.
- `app/` — the site itself: `index.html`, `style.css`, and one job per file:
  `data.js` (the ledger), `money.js` (formatting and arithmetic),
  `charts.js` (the hand-drawn SVG donut and bars), `views.js` (the three
  pages), `main.js` (routing and state).
- `screenshots/` — fresh renders of the site running: overview, budget,
  activity, and the overview on a phone.
- `vendor/makefun-frontend.ts` — the make.fun dossier library, unchanged
  from the kit.
