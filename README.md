# Tallyhome — a household budget site

[![Bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=household-budget-site)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Hagai17/household-budget-site/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=household-budget-site)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Hagai17/household-budget-site/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=household-budget-site)

Tallyhome keeps one household's budget on one page: the Reyes family —
Maya, Daniel and June — through November 2026. It is a static site with no
build step and no network loads; open `app/index.html` through any static
server and it works, on a desktop or a phone.

## What it does

- **Overview** — money in ($5,860), money out ($5,198.86), safe to spend after
  the bills still due ($549.15, about $137 a day), the month's savings rate
  (22%), a spending donut by category, and income-vs-out bars for six months.
- **Budget** — all 16 categories in Needs / Wants / Savings groups with
  planned vs used, progress bars and over-budget flags, plus a live
  **50 / 30 / 20 calculator**: type any take-home pay and the rule's split is
  worked out next to this household's own.
- **Activity** — every November payment in and out, a working category
  filter, and an add-transaction form. Added transactions update the totals
  on every page at once, because every figure is summed from one ledger.
- **Bills** — eight regular bills with due dates and paid/upcoming status,
  and the subscriptions priced by the year ($707.64 — the yearly truth).
- **Goals** — emergency fund, Lisbon holiday and car replacement with
  progress and finish dates computed from the monthly payments, plus the
  student-loan payoff countdown.
- **Guide** — the system behind it: give every dollar a job, 50/30/20 as a
  compass, pay savings first, sinking funds, the emergency-fund ladder, and
  the 20-minute Sunday money date.

## Layout

- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the
  output directory and writes `dossier.json` with the kit's library.
- `app/data.js` — the ledger: income, categories, transactions, bills,
  subscriptions, goals. The single source of truth for every figure.
- `app/money.js` — currency formatting, sums, percentages, goal dates.
- `app/charts.js` — the donut, cash-flow bars and progress bars as inline SVG.
- `app/views.js` — one render function per page.
- `app/main.js` — hash routing and the controls (calculator, filter, form).
- `app/style.css` — the paper-ledger look; system font stacks only.
- `serve.ts` — a tiny local static server: `node serve.ts`, then open
  http://localhost:8080.
- `screenshots/` — real renders of the site, listed in `shots.json`.

## License

MIT — see `LICENSE`.
