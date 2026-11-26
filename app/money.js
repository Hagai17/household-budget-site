// Tallyhome money — formatting and the month's arithmetic, all in cents.
// Nothing here touches the page; views.js does the rendering.

const TallyMoney = {
  // $1,234.56 — cents in, a readable dollar string out.
  format(cents) {
    const sign = cents < 0 ? '-' : '';
    const whole = Math.floor(Math.abs(cents) / 100);
    const frac = Math.abs(cents) % 100;
    return sign + '$' + whole.toLocaleString('en-US') + '.' + String(frac).padStart(2, '0');
  },

  // Short form for chart labels: $1.2k, $850, $64.
  short(cents) {
    const dollars = Math.abs(cents) / 100;
    const sign = cents < 0 ? '-' : '';
    if (dollars >= 1000) return sign + '$' + (dollars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    if (dollars >= 100) return sign + '$' + Math.round(dollars);
    return sign + '$' + dollars.toFixed(0);
  },

  percent(part, whole) {
    if (!whole) return 0;
    return Math.round((part / whole) * 100);
  },

  // Total take-home for the month.
  incomeTotal(data) {
    return data.income.reduce((sum, row) => sum + row.amount, 0);
  },

  // Spent per category, summed from the transaction ledger.
  spentByCategory(data) {
    const spent = {};
    for (const cat of data.categories) spent[cat.id] = 0;
    for (const tx of data.transactions) {
      if (spent[tx.category] === undefined) spent[tx.category] = 0;
      spent[tx.category] += tx.amount;
    }
    return spent;
  },

  totalSpent(data) {
    return data.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  },

  totalBudget(data) {
    return data.categories.reduce((sum, cat) => sum + cat.budget, 0);
  },

  daysLeft(data) {
    return Math.max(0, data.daysInMonth - data.dayToday);
  },

  // Money not yet spent and not already assigned to savings or the buffer.
  flexibleLeft(data, spent) {
    let left = 0;
    for (const cat of data.categories) {
      if (cat.group === 'savings' || cat.group === 'buffer') continue;
      left += Math.max(0, cat.budget - (spent[cat.id] || 0));
    }
    return left;
  },

  // 50/30/20 split, in whole percent of income, from the budgets.
  ruleSplit(data) {
    const income = this.incomeTotal(data);
    const group = { needs: 0, wants: 0, savings: 0, buffer: 0 };
    for (const cat of data.categories) group[cat.group] += cat.budget;
    return {
      needs: this.percent(group.needs, income),
      wants: this.percent(group.wants, income),
      savings: this.percent(group.savings, income),
      buffer: this.percent(group.buffer, income),
    };
  },

  // Envelopes that have gone over their budget, with the overrun.
  overBudget(data, spent) {
    return data.categories
      .filter((cat) => (spent[cat.id] || 0) > cat.budget)
      .map((cat) => ({ category: cat, over: (spent[cat.id] || 0) - cat.budget }));
  },

  // Biggest single purchase outside the fixed bills (mortgage, savings moves).
  biggestEveryday(data) {
    const fixed = new Set(['housing', 'savings']);
    let best = null;
    for (const tx of data.transactions) {
      if (fixed.has(tx.category)) continue;
      if (!best || tx.amount > best.amount) best = tx;
    }
    return best;
  },

  // Short day label for a transaction date: "Mon 2" style.
  dayLabel(isoDate) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(isoDate + 'T12:00:00');
    return days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate();
  },

  // "Dec 1" for a bill's due date.
  dueLabel(isoDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(isoDate + 'T12:00:00');
    return months[d.getMonth()] + ' ' + d.getDate();
  },
};
