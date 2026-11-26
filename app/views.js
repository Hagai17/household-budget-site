// Tallyhome views — the three pages, as HTML strings.
// Views never store anything: main.js owns the state (transactions, budget
// tweaks) and hands it in; views only turn it into markup.

const TallyViews = {
  esc(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  categoryName(data, id) {
    const cat = data.categories.find((c) => c.id === id);
    return cat ? cat.name : id;
  },

  categoryColour(data, id) {
    const cat = data.categories.find((c) => c.id === id);
    return cat ? cat.colour : '#888888';
  },

  // One transaction row. User-added rows (id starting with "u") get a Remove button.
  txRow(data, tx) {
    const removable = tx.id && String(tx.id).indexOf('u') === 0;
    return '<li class="tx"><span class="tx-dot" style="background:' +
      this.categoryColour(data, tx.category) + '"></span>' +
      '<span class="tx-main"><strong>' + this.esc(tx.merchant) + '</strong>' +
      '<span class="tx-note">' + this.esc(tx.note) + '</span></span>' +
      '<span class="tx-cat">' + this.categoryName(data, tx.category) + '</span>' +
      '<span class="tx-date">' + TallyMoney.dayLabel(tx.date) + '</span>' +
      '<span class="tx-amount">' + TallyMoney.format(tx.amount) + '</span>' +
      (removable
        ? '<button class="tx-remove" data-remove="' + this.esc(tx.id) +
          '" aria-label="Remove this entry">Remove</button>'
        : '') +
      '</li>';
  },

  billRow(bill) {
    return '<li class="bill"><span class="bill-date">' + TallyMoney.dueLabel(bill.due) + '</span>' +
      '<span class="bill-name">' + this.esc(bill.name) + '</span>' +
      '<span class="bill-amount">' + (bill.estimate ? '~' : '') + TallyMoney.format(bill.amount) + '</span>' +
      (bill.estimate ? '<span class="bill-est">estimate</span>' : '') + '</li>';
  },

  statCard(label, value, sub) {
    return '<div class="stat"><span class="stat-label">' + label + '</span>' +
      '<span class="stat-value">' + value + '</span>' +
      '<span class="stat-sub">' + sub + '</span></div>';
  },

  // ---- Overview ---------------------------------------------------------
  overview(data, state) {
    const spent = TallyMoney.spentByCategory(state);
    const income = TallyMoney.incomeTotal(state);
    const totalSpent = TallyMoney.totalSpent(state);
    const left = income - totalSpent;
    const saved = spent.savings || 0;
    const daysLeft = TallyMoney.daysLeft(state);
    const flexible = TallyMoney.flexibleLeft(state, spent);
    const perDay = daysLeft ? Math.round(flexible / daysLeft) : flexible;
    const over = TallyMoney.overBudget(state, spent);
    const biggest = TallyMoney.biggestEveryday(state);
    const recent = state.transactions.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
    const bills = state.bills.slice(0, 4);
    const topEnvelopes = state.categories
      .slice()
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 6);

    let overNote = '';
    if (over.length) {
      const totalOver = over.reduce((s, o) => s + o.over, 0);
      overNote = '<p class="callout warn"><strong>' + over.length +
        (over.length === 1 ? ' envelope is' : ' envelopes are') + ' over budget</strong> — ' +
        over.map((o) => o.category.name + ' ' + TallyMoney.format(o.over) + ' over').join(', ') +
        '. ' + TallyMoney.format(totalOver) + ' in total, covered by the ' +
        TallyMoney.format(state.categories.find((c) => c.id === 'buffer').budget) +
        ' buffer.</p>';
    }

    return '<section class="hero"><h1>November at a glance</h1>' +
      '<p class="hero-sub">' + this.esc(state.household) + ' · ' + this.esc(state.place) +
      ' · Day ' + state.dayToday + ' of ' + state.daysInMonth + ' · ' + daysLeft + ' days left</p></section>' +
      '<section class="stats">' +
      this.statCard('Income', TallyMoney.format(income), 'take-home this month') +
      this.statCard('Spent', TallyMoney.format(totalSpent), 'of ' + TallyMoney.format(income) + ' in') +
      this.statCard('Left', TallyMoney.format(left), 'before the month ends') +
      this.statCard('Saved', TallyMoney.format(saved), TallyMoney.percent(saved, income) + '% of income') +
      '</section>' +
      overNote +
      '<section class="grid-two">' +
      '<div class="card"><h2>Where it went</h2>' + TallyCharts.donut(state, spent) + '</div>' +
      '<div class="card"><h2>Safe to spend</h2>' +
      '<p class="big-number">' + TallyMoney.format(flexible) + '</p>' +
      '<p>Flexible money left — about <strong>' + TallyMoney.format(perDay) +
      ' a day</strong> for the last ' + daysLeft + ' days of November.</p>' +
      '<p class="muted">Biggest everyday buy: ' + this.esc(biggest.merchant) + ' — ' +
      TallyMoney.format(biggest.amount) + ' on ' + TallyMoney.dayLabel(biggest.date) + '.</p>' +
      '<h3 class="subhead">Saving for</h3>' +
      state.goals.map((g) => TallyCharts.goalBar(g)).join('') +
      '</div></section>' +
      '<section class="grid-two">' +
      '<div class="card"><h2>Biggest envelopes</h2>' +
      topEnvelopes.map((c) => TallyCharts.budgetBar(c, spent[c.id] || 0)).join('') +
      '<p class="card-link"><a href="#/budget">See all ' + state.categories.length +
      ' envelopes →</a></p></div>' +
      '<div class="card"><h2>Coming up</h2><ul class="bills">' +
      bills.map((b) => this.billRow(b)).join('') + '</ul>' +
      '<h3 class="subhead">Recent activity</h3><ul class="txs">' +
      recent.map((t) => this.txRow(state, t)).join('') + '</ul>' +
      '<p class="card-link"><a href="#/activity">See all activity →</a></p></div></section>';
  },

  // ---- Budget -----------------------------------------------------------
  budget(data, state) {
    const spent = TallyMoney.spentByCategory(state);
    const totalSpent = TallyMoney.totalSpent(state);
    const totalBudget = TallyMoney.totalBudget(state);
    const split = TallyMoney.ruleSplit(state);
    const over = TallyMoney.overBudget(state, spent);

    const adjust = (cat) => '<span class="adjust">' +
      '<button data-adjust="' + cat.id + ':-1000" aria-label="Lower ' + cat.name + ' budget by $10">− $10</button>' +
      '<button data-adjust="' + cat.id + ':1000" aria-label="Raise ' + cat.name + ' budget by $10">+ $10</button></span>';

    return '<section class="hero"><h1>Envelopes</h1>' +
      '<p class="hero-sub">Every dollar of the ' + TallyMoney.format(TallyMoney.incomeTotal(state)) +
      ' take-home has a job. ' + TallyMoney.format(totalSpent) + ' spent of ' +
      TallyMoney.format(totalBudget) + ' planned.</p></section>' +
      '<section class="card rule-card"><h2>The 50 / 30 / 20 check</h2>' +
      '<div class="rule-bar"><span style="width:' + split.needs + '%;background:#1f4d3a" title="Needs"></span>' +
      '<span style="width:' + split.wants + '%;background:#e8a13a" title="Wants"></span>' +
      '<span style="width:' + split.savings + '%;background:#2e6f8e" title="Savings"></span>' +
      '<span style="width:' + split.buffer + '%;background:#9aa38f" title="Buffer"></span></div>' +
      '<p class="rule-legend"><span><i style="background:#1f4d3a"></i>Needs ' + split.needs +
      '%</span><span><i style="background:#e8a13a"></i>Wants ' + split.wants +
      '%</span><span><i style="background:#2e6f8e"></i>Savings ' + split.savings +
      '%</span><span><i style="background:#9aa38f"></i>Buffer ' + split.buffer + '%</span></p>' +
      '<p>Needs run high because the mortgage alone is 28% of take-home; wants sit well ' +
      'under 30%, and savings plus the buffer come to ' + (split.savings + split.buffer) +
      '% — above the 20% rule.</p></section>' +
      (over.length
        ? '<p class="callout warn"><strong>Over budget:</strong> ' +
          over.map((o) => o.category.name + ' +' + TallyMoney.format(o.over)).join(', ') +
          '. Nudge the budget up, or spend less there this week.</p>'
        : '') +
      '<section class="card"><h2>All envelopes</h2>' +
      state.categories.map((cat) =>
        '<div class="env-row">' + TallyCharts.budgetBar(cat, spent[cat.id] || 0) + adjust(cat) + '</div>'
      ).join('') +
      '<p class="muted">Budget tweaks are saved on this device and count straight away — ' +
      'the totals above always add up to the income.</p></section>';
  },

  // ---- Activity ---------------------------------------------------------
  activity(data, state, filter, query) {
    const all = state.transactions.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    const q = (query || '').trim().toLowerCase();
    const shown = all.filter((tx) => {
      if (filter && filter !== 'all' && tx.category !== filter) return false;
      if (q && (tx.merchant + ' ' + tx.note).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    const total = shown.reduce((s, tx) => s + tx.amount, 0);

    const chips = ['all'].concat(state.categories.map((c) => c.id))
      .filter((id) => id === 'all' || state.transactions.some((t) => t.category === id))
      .map((id) => '<button class="chip' + ((filter || 'all') === id ? ' on' : '') +
        '" data-filter="' + id + '">' + (id === 'all' ? 'All' : this.categoryName(state, id)) + '</button>')
      .join('');

    const options = state.categories
      .map((c) => '<option value="' + c.id + '">' + c.name + '</option>').join('');

    return '<section class="hero"><h1>Activity</h1>' +
      '<p class="hero-sub">Every dollar out, newest first. ' + shown.length +
      ' shown · ' + TallyMoney.format(total) + '.</p></section>' +
      '<section class="card"><h2>Add an expense</h2>' +
      '<form id="add-tx" class="add-form">' +
      '<label>Date<input type="date" name="date" value="2026-11-26" required></label>' +
      '<label>What<input type="text" name="merchant" placeholder="e.g. GreenMart" required maxlength="80"></label>' +
      '<label>Category<select name="category">' + options + '</select></label>' +
      '<label>Amount $<input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>' +
      '<button type="submit">Add expense</button></form>' +
      '<p class="muted">Added entries appear here at once, update every total on the site, ' +
      'and can be removed again. They are saved on this device only.</p></section>' +
      '<section class="card"><h2>Filter</h2>' +
      '<div class="chips">' + chips + '</div>' +
      '<label class="search">Search <input type="search" id="tx-search" placeholder="merchant or note…" value="' +
      this.esc(query || '') + '"></label>' +
      '<ul class="txs">' + (shown.length ? shown.map((t) => this.txRow(state, t)).join('')
        : '<li class="empty">Nothing matches — try another filter or search.</li>') + '</ul></section>';
  },
};
