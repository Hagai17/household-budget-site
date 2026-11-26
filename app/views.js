// Tallyhome's pages. Each view is a function from the ledger (the transaction
// list, which the activity page can add to) to an HTML string. All figures
// are summed here from data.js, so a transaction added on the activity page
// moves the dashboard, the budget table and the donut at once.

import {
  BILLS, CATEGORIES, GOALS, GROUP_LABELS, HISTORY, HOUSEHOLD, INCOME, LOAN, SUBSCRIPTIONS,
} from './data.js';
import { dayLabel, money, moneyExact, monthAfter, monthsToGoal, pct, sum } from './money.js';
import { cashFlowBars, donutChart, donutLegend, progressBar } from './charts.js';

export function categoryActuals(transactions) {
  const actuals = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of transactions) actuals.set(t.category, (actuals.get(t.category) ?? 0) + t.amount);
  return actuals;
}

export function totals(transactions) {
  const income = sum(INCOME, (i) => i.amount);
  const out = sum(transactions, (t) => t.amount);
  const planned = sum(CATEGORIES, (c) => c.planned);
  const actuals = categoryActuals(transactions);
  const savedActual = sum(CATEGORIES.filter((c) => c.group === 'savings'), (c) => actuals.get(c.id));
  const upcomingBills = sum(BILLS.filter((b) => b.status === 'upcoming'), (b) => b.amount);
  return { income, out, planned, actuals, savedActual, upcomingBills, left: income - out };
}

function groupRows(transactions, group) {
  const actuals = categoryActuals(transactions);
  return CATEGORIES.filter((c) => c.group === group).map((c) => ({ ...c, actual: actuals.get(c.id) }));
}

// ---------------------------------------------------------------- Overview
export function overviewView(transactions) {
  const t = totals(transactions);
  const daysLeft = HOUSEHOLD.daysInMonth - 26;
  const safeToSpend = t.left - t.upcomingBills;
  const perDay = safeToSpend / daysLeft;
  const savingsRate = pct(t.savedActual, t.income);
  const byCategory = CATEGORIES.map((c) => ({ label: c.label, value: t.actuals.get(c.id) }))
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const donutParts = [...byCategory.slice(0, 7), { label: 'Everything else', value: sum(byCategory.slice(7), (p) => p.value) }];
  const history = [...HISTORY, { month: 'Nov', income: t.income, out: t.out }];
  const upcoming = BILLS.filter((b) => b.status === 'upcoming');
  const topGoal = GOALS[0];
  const goalMonths = monthsToGoal(topGoal.saved, topGoal.target, topGoal.monthly);

  return `
  <h1 class="page-title">November at a glance</h1>
  <p class="page-lede">Day 26 of 30. The month is nearly spent, the plan mostly held, and there is
  still money left with a job to do. Everything below is summed from the same ledger as the
  <a href="#/activity">activity page</a> — add a transaction there and this page moves.</p>

  <div class="grid grid-4">
    <section class="card"><p class="stat-label">Money in</p><p class="stat-value">${money(t.income)}</p>
      <p class="stat-note">Two salaries, one overtime shift, one stroller sold.</p></section>
    <section class="card"><p class="stat-label">Money out</p><p class="stat-value">${money(t.out)}</p>
      <p class="stat-note">Of ${money(t.planned)} planned for the whole month.</p></section>
    <section class="card"><p class="stat-label">Safe to spend</p><p class="stat-value good">${money(safeToSpend)}</p>
      <p class="stat-note">Left after the ${upcoming.length} bills still due — about ${money(perDay)} a day for ${daysLeft} days.</p></section>
    <section class="card"><p class="stat-label">Saved this month</p><p class="stat-value good">${money(t.savedActual)}</p>
      <p class="stat-note">${savingsRate}% of income, moved before spending started.</p></section>
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h2>Where the money went</h2>
      <div class="chart-flex">${donutChart(donutParts)}<ul class="legend">${donutLegend(donutParts)}</ul></div>
      <p class="more">Rent and savings transfers are the two big slices by design. The full
      line-by-line table is on the <a href="#/budget">budget page</a>.</p>
    </section>
    <section class="card">
      <h2>Income vs money out</h2>
      ${cashFlowBars(history)}
      <p class="chart-key">Income<span class="swatch" style="background:#276749"></span>Out<span class="swatch" style="background:#c77400"></span></p>
      <p class="more">Six months without a single month spent past income. November's bar is
      short because the month is not over — ${money(t.planned - t.out)} of planned spending is still to come.</p>
    </section>
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h2>Still due this month</h2>
      <table><tbody>
      ${upcoming.map((b) => `<tr><td>${b.name}<span class="cat-note">${b.detail}</span></td><td class="num">${moneyExact(b.amount)}</td><td><span class="pill upcoming">Due ${b.due}</span></td></tr>`).join('')}
      </tbody></table>
      <p class="more">Total still to leave the account: <strong>${money(t.upcomingBills)}</strong>.
      Every paid bill is listed on the <a href="#/bills">bills page</a>.</p>
    </section>
    <section class="card">
      <h2>Emergency fund</h2>
      <p class="stat-value">${money(topGoal.saved)} <span style="font-size:17px;color:var(--ink-soft)">of ${money(topGoal.target)}</span></p>
      ${progressBar(topGoal.saved / topGoal.target, 'Emergency fund progress')}
      <p>At ${money(topGoal.monthly)} a month the fund is full in ${goalMonths} months — ${monthAfter(goalMonths)}.
      All three goals, with their finish dates worked out, are on the <a href="#/goals">goals page</a>.</p>
    </section>
  </div>`;
}

// ------------------------------------------------------------------ Budget
export function budgetView(transactions) {
  const t = totals(transactions);
  const groups = ['needs', 'wants', 'savings']
    .map((group) => {
      const rows = groupRows(transactions, group);
      const planned = sum(rows, (r) => r.planned);
      const actual = sum(rows, (r) => r.actual);
      const body = rows
        .map((r) => {
          const left = r.planned - r.actual;
          const flag = left < 0 ? `<span class="flag-over">Over by ${money(-left)}</span>` : `<span class="flag-ok">${money(left)} left</span>`;
          return `<tr><td>${r.label}<span class="cat-note">${r.note}</span></td><td class="num">${money(r.planned)}</td><td class="num">${money(r.actual)}</td><td class="bar-cell">${progressBar(r.actual / r.planned, `${r.label}: ${money(r.actual)} of ${money(r.planned)}`)}<span class="bar-fig">${pct(r.actual, r.planned)}% used</span></td><td>${flag}</td></tr>`;
        })
        .join('');
      return `<tr class="group-row"><td colspan="5">${GROUP_LABELS[group]} — planned ${money(planned)}, used ${money(actual)}</td></tr>${body}`;
    })
    .join('');
  const unassigned = t.income - t.planned;

  return `
  <h1 class="page-title">The November budget</h1>
  <p class="page-lede">Every dollar of the ${money(t.income)} that came in was given a job before the month
  started. Planned is what we assigned, used is what has actually left the account, and the bar
  shows how much of each line is gone with four days still to run.</p>

  <section class="card">
    <table>
      <thead><tr><th>Category</th><th class="num">Planned</th><th class="num">Used</th><th>Progress</th><th>Status</th></tr></thead>
      <tbody>${groups}
      <tr class="total"><td>All categories</td><td class="num">${money(t.planned)}</td><td class="num">${money(t.out)}</td><td></td><td>${money(t.planned - t.out)} still planned</td></tr>
      </tbody>
    </table>
    <p>Income was ${money(t.income)} and ${money(t.planned)} of it is assigned, leaving
    <strong>${money(unassigned)} unassigned</strong> — the household's shock absorber. If nothing
    surprises us, it joins the emergency fund on the 30th. Eating out is the one line already over:
    a family dinner at Nonna's Table was worth it, and it is paid for by the grocery line running under.</p>
  </section>

  <section class="card" style="margin-top:16px">
    <h2>Try the 50 / 30 / 20 split</h2>
    <p>The best-known budgeting rule of thumb divides take-home pay into 50% needs, 30% wants and
    20% savings and debt. Type any monthly take-home pay and the split is worked out live, next to
    how this household's own plan compares.</p>
    <div class="controls">
      <label class="field">Monthly take-home pay ($)
        <input id="pay-input" type="number" min="0" step="10" value="${t.income}">
      </label>
    </div>
    <div id="split-output"></div>
    <p class="form-note">Our own split this month is needs-heavy — rent and childcare in the city do
    that — so we treat the rule as a compass, not a verdict. The reasoning is written up in the
    <a href="#/guide">guide</a>.</p>
  </section>`;
}

// The 50/30/20 comparison table, rendered by main.js whenever the pay input
// changes. Kept here so all budget maths lives with the budget view.
export function splitTable(pay, transactions) {
  const t = totals(transactions);
  const groupPlanned = (group) => sum(CATEGORIES.filter((c) => c.group === group), (c) => c.planned);
  const rows = [
    ['Needs', 0.5, groupPlanned('needs')],
    ['Wants', 0.3, groupPlanned('wants')],
    ['Savings & debt', 0.2, groupPlanned('savings')],
  ];
  const body = rows
    .map(([label, share, ours]) => {
      const target = pay * share;
      const diff = ours - target;
      const verdict = Math.abs(diff) < 1 ? 'matches the rule' : diff > 0 ? `${money(diff)} above the rule` : `${money(-diff)} below the rule`;
      return `<tr><td>${label}</td><td class="num">${money(target)}</td><td class="num">${money(ours)}</td><td class="num">${pct(ours, pay)}% of that pay</td><td>${verdict}</td></tr>`;
    })
    .join('');
  return `<table><thead><tr><th>Slice</th><th class="num">The rule says</th><th class="num">Our plan</th><th class="num">Share</th><th>Difference</th></tr></thead><tbody>${body}</tbody></table>`;
}

// ---------------------------------------------------------------- Activity
export function activityView(transactions, filter) {
  const shown = transactions
    .filter((row) => filter === 'all' || row.category === filter)
    .slice()
    .sort((a, b) => b.day - a.day);
  const shownTotal = sum(shown, (r) => r.amount);
  const options = CATEGORIES.map((c) => `<option value="${c.id}"${filter === c.id ? ' selected' : ''}>${c.label}</option>`).join('');
  const rows = shown
    .map((r) => {
      const cat = CATEGORIES.find((c) => c.id === r.category);
      return `<tr><td class="num">${dayLabel(r.day)}</td><td>${r.payee}</td><td>${cat ? cat.label : r.category}</td><td class="num">${moneyExact(r.amount)}</td></tr>`;
    })
    .join('');
  const incomeRows = INCOME.slice()
    .sort((a, b) => b.day - a.day)
    .map((i) => `<tr><td class="num">${dayLabel(i.day)}</td><td>${i.source}</td><td>Income</td><td class="num">+${moneyExact(i.amount)}</td></tr>`)
    .join('');

  return `
  <h1 class="page-title">Activity</h1>
  <p class="page-lede">Every payment in and out of the current account this November, newest first.
  Filter by category to check one line of the budget, or add a transaction and watch the totals —
  here, on the <a href="#/">overview</a> and on the <a href="#/budget">budget page</a> — move together.</p>

  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-form">
      <div class="controls">
        <label class="field">Day (1–30)<input id="f-day" type="number" min="1" max="30" value="26" required></label>
        <label class="field">What was it?<input id="f-payee" type="text" size="24" placeholder="e.g. Bakery on Alder Street" required></label>
        <label class="field">Category<select id="f-category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select></label>
        <label class="field">Amount ($)<input id="f-amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>
        <button class="primary" type="submit">Add transaction</button>
      </div>
    </form>
    <p class="form-note">Added transactions live in this page's ledger for as long as the page is open;
    the household writes the real ones into the shared ledger every Sunday.</p>
  </section>

  <section class="card" style="margin-top:16px">
    <div class="controls">
      <label class="field">Show category
        <select id="filter-select"><option value="all">All categories</option>${options}</select>
      </label>
    </div>
    <table>
      <thead><tr><th class="num">Date</th><th>Payment</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>${rows}
      <tr class="total"><td></td><td colspan="2">${shown.length} payments out</td><td class="num">${moneyExact(shownTotal)}</td></tr>
      ${incomeRows}
      <tr class="total"><td></td><td colspan="2">Money in</td><td class="num">+${moneyExact(sum(INCOME, (i) => i.amount))}</td></tr>
      </tbody>
    </table>
  </section>`;
}

// ------------------------------------------------------------------- Bills
export function billsView() {
  const billsTotal = sum(BILLS, (b) => b.amount);
  const subsTotal = sum(SUBSCRIPTIONS, (s) => s.monthly);
  const billRows = BILLS.map(
    (b) => `<tr><td>${b.name}<span class="cat-note">${b.detail}</span></td><td class="num">${moneyExact(b.amount)}</td><td>Due ${b.due}</td><td><span class="pill ${b.status}">${b.status === 'paid' ? 'Paid' : 'Upcoming'}</span></td></tr>`,
  ).join('');
  const subRows = SUBSCRIPTIONS.map(
    (s) => `<tr><td>${s.name}<span class="cat-note">${s.detail}</span></td><td class="num">${moneyExact(s.monthly)}</td><td class="num">${money(s.monthly * 12)}</td></tr>`,
  ).join('');

  return `
  <h1 class="page-title">Bills &amp; subscriptions</h1>
  <p class="page-lede">The money that leaves whether we think about it or not: ${money(billsTotal)} of
  regular bills a month, plus ${money(subsTotal)} of subscriptions. Every one is listed with its due
  date, so nothing on this page can ambush the budget.</p>

  <section class="card">
    <h2>Regular bills — November</h2>
    <table>
      <thead><tr><th>Bill</th><th class="num">Amount</th><th>Due</th><th>Status</th></tr></thead>
      <tbody>${billRows}
      <tr class="total"><td>All regular bills</td><td class="num">${moneyExact(billsTotal)}</td><td></td><td></td></tr>
      </tbody>
    </table>
  </section>

  <section class="card" style="margin-top:16px">
    <h2>Subscriptions — the yearly truth</h2>
    <p>Subscriptions feel small one at a time. Priced by the year, the four of them cost
    <strong>${money(subsTotal * 12)}</strong> — more than a month of groceries' top-ups. We re-decide
    each one every January; the gym and the photo backup have survived three reviews, Streamly is
    on its last warning.</p>
    <table>
      <thead><tr><th>Subscription</th><th class="num">Monthly</th><th class="num">Per year</th></tr></thead>
      <tbody>${subRows}
      <tr class="total"><td>All subscriptions</td><td class="num">${moneyExact(subsTotal)}</td><td class="num">${money(subsTotal * 12)}</td></tr>
      </tbody>
    </table>
  </section>`;
}

// ------------------------------------------------------------------- Goals
export function goalsView() {
  const cards = GOALS.map((g) => {
    const months = monthsToGoal(g.saved, g.target, g.monthly);
    return `<section class="card">
      <h3>${g.name}</h3>
      <p class="stat-value">${money(g.saved)} <span style="font-size:16px;color:var(--ink-soft)">of ${money(g.target)}</span></p>
      ${progressBar(g.saved / g.target, `${g.name}: ${money(g.saved)} of ${money(g.target)}`)}
      <p>${pct(g.saved, g.target)}% there. At ${money(g.monthly)} a month, the last ${money(g.target - g.saved)}
      takes ${months} more months — full by <strong>${monthAfter(months)}</strong>.</p>
      <p class="stat-note">${g.note}</p>
    </section>`;
  }).join('');

  return `
  <h1 class="page-title">Goals</h1>
  <p class="page-lede">Savings with names on them. Each goal is fed by its own line of the
  <a href="#/budget">budget</a>, moved on the 2nd of the month before any spending happens, and its
  finish date below is worked out from the amount and the monthly payment — not wished into place.</p>

  <div class="grid grid-3">${cards}</div>

  <section class="card" style="margin-top:16px">
    <h2>The student loan payoff</h2>
    <p>Balance left: <strong>${money(LOAN.balance)}</strong> at ${LOAN.rateLabel}. The minimum payment is
    ${money(LOAN.minimum)}; the budget adds <strong>${money(LOAN.extra)} extra</strong> every month, which
    brings the debt-free date forward by ${LOAN.goneEarlyBy} — to <strong>${LOAN.debtFreeLabel}</strong> —
    and saves more in interest than a year of subscriptions costs. When the loan goes, its
    ${money(LOAN.minimum + LOAN.extra)} a month moves straight into the car fund.</p>
  </section>`;
}

// ------------------------------------------------------------------- Guide
export function guideView(transactions) {
  const t = totals(transactions);
  const groupPlanned = (group) => sum(CATEGORIES.filter((c) => c.group === group), (c) => c.planned);
  const needs = pct(groupPlanned('needs'), t.income);
  const wants = pct(groupPlanned('wants'), t.income);
  const savings = pct(groupPlanned('savings'), t.income);

  return `
  <h1 class="page-title">How this budget works</h1>
  <p class="page-lede">The short version of the system behind every page here — written for anyone
  starting a household budget from zero, with our own November numbers as the worked example.</p>

  <div class="guide">
    <h2>1. Give every dollar a job</h2>
    <p>Before the month starts, assign all of the income you expect — not most of it, all of it.
    Our November plan assigns ${money(t.planned)} of ${money(t.income)}; the last
    ${money(t.income - t.planned)} sits unassigned on purpose, as the shock absorber for the thing
    nobody planned. A budget that only covers the predictable is a wish, not a plan.</p>

    <h2>2. Use 50 / 30 / 20 as a compass, not a verdict</h2>
    <div class="rule-split">
      <span class="rule-chip">Needs<strong>50%</strong></span>
      <span class="rule-chip">Wants<strong>30%</strong></span>
      <span class="rule-chip">Savings &amp; debt<strong>20%</strong></span>
    </div>
    <p>The rule divides take-home pay into needs, wants and savings. Our own plan is
    ${needs}% / ${wants}% / ${savings}% — needs run high because rent and childcare in a city are
    what they are, and we refuse to fix that by saving nothing. What the rule is really for is the
    direction of travel: every January we move one point from wants to savings. Try your own pay in
    the calculator on the <a href="#/budget">budget page</a>.</p>

    <h2>3. Pay the savings first</h2>
    <p>Our transfers to the emergency fund, holiday fund and car fund all leave on the 2nd and 3rd of
    the month — visible at the top of the <a href="#/activity">activity page</a>. Money that is moved
    before spending starts does not need willpower later. What is left after the transfers is, by
    definition, safe to spend.</p>

    <h2>4. Smooth the lumpy bills with sinking funds</h2>
    <p>Car insurance, the car itself, Christmas, the boiler service: none of these are surprises,
    they are just bills that arrive rarely. Each gets a small monthly line so the month it lands is
    an ordinary month. Our car fund holds ${money(2300)} today against exactly this.</p>

    <h2>5. Build the emergency fund in steps</h2>
    <ol class="steps">
      <li><strong>Starter:</strong> $1,000, fast, in an ordinary savings account.</li>
      <li><strong>One month of needs:</strong> for us, ${money(groupPlanned('needs'))}.</li>
      <li><strong>Three months of needs:</strong> ${money(groupPlanned('needs') * 3)} — our current
      target of ${money(10000)} is most of the way there, and the fund stands at ${money(7850)}.</li>
    </ol>

    <h2>6. Hold a 20-minute money date</h2>
    <p>Every Sunday, Maya and Daniel open the <a href="#/activity">activity page</a>, write the week's
    real spending into the ledger, and check three numbers: safe to spend, the one category running
    hottest, and the next bill due. Twenty minutes, no blame, tea involved. The budget works because
    it is looked at, not because it was written beautifully in November.</p>
  </div>`;
}
