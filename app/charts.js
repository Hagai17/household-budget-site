// Tallyhome charts — small hand-drawn SVG charts, no libraries.
// The donut shows where the month's spending went; the bars show each envelope
// against its budget. Both are pure functions of the data: no hard-coded figures.

const TallyCharts = {
  // Donut of spending by category. Centre shows the total spent.
  // Returns an SVG string; slices under 1.5% of the total are folded into "Rest".
  donut(data, spent) {
    const size = 220;
    const centre = size / 2;
    const radius = 88;
    const inner = 58;
    const total = Object.values(spent).reduce((a, b) => a + b, 0);
    if (!total) return '<p class="empty">No spending yet this month.</p>';

    const slices = data.categories
      .map((cat) => ({ cat, amount: spent[cat.id] || 0 }))
      .filter((s) => s.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const main = [];
    let rest = 0;
    for (const s of slices) {
      if (s.amount / total >= 0.015) main.push(s);
      else rest += s.amount;
    }
    if (rest > 0) main.push({ cat: { id: 'rest', name: 'Rest', colour: '#c9c2b4' }, amount: rest });

    let angle = -Math.PI / 2;
    let paths = '';
    for (const s of main) {
      const frac = s.amount / total;
      const sweep = frac * Math.PI * 2;
      const a0 = angle;
      const a1 = angle + sweep;
      const large = sweep > Math.PI ? 1 : 0;
      const x0 = centre + radius * Math.cos(a0);
      const y0 = centre + radius * Math.sin(a0);
      const x1 = centre + radius * Math.cos(a1);
      const y1 = centre + radius * Math.sin(a1);
      const ix1 = centre + inner * Math.cos(a1);
      const iy1 = centre + inner * Math.sin(a1);
      const ix0 = centre + inner * Math.cos(a0);
      const iy0 = centre + inner * Math.sin(a0);
      paths += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
        ' A ' + radius + ' ' + radius + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' L ' + ix1.toFixed(1) + ' ' + iy1.toFixed(1) +
        ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + ix0.toFixed(1) + ' ' + iy0.toFixed(1) +
        ' Z" fill="' + s.cat.colour + '"><title>' + s.cat.name + ' ' +
        TallyMoney.format(s.amount) + '</title></path>';
      angle = a1;
    }

    const legend = main
      .map((s) => '<li><span class="dot" style="background:' + s.cat.colour + '"></span>' +
        '<span class="lg-name">' + s.cat.name + '</span>' +
        '<span class="lg-value">' + TallyMoney.format(s.amount) + '</span></li>')
      .join('');

    return '<div class="donut-wrap">' +
      '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending by category">' +
      paths +
      '<text x="' + centre + '" y="' + (centre - 4) + '" text-anchor="middle" class="donut-total">' +
      TallyMoney.format(total) + '</text>' +
      '<text x="' + centre + '" y="' + (centre + 18) + '" text-anchor="middle" class="donut-label">spent so far</text>' +
      '</svg><ul class="legend">' + legend + '</ul></div>';
  },

  // One horizontal bar per envelope: filled to spent/budget, amber past 85%,
  // red once over budget. Returns HTML, not SVG — the bar is a div.
  budgetBar(cat, spent) {
    const pct = cat.budget ? Math.min(100, Math.round((spent / cat.budget) * 100)) : 0;
    const over = spent > cat.budget;
    const left = cat.budget - spent;
    // Amber only while an envelope is close to its limit (85-99%): exactly
    // 100% means it was paid in full on purpose (mortgage, savings moves),
    // so it keeps its own colour instead of looking like a warning.
    const cls = over ? 'bar over' : pct >= 85 && pct < 100 ? 'bar warm' : 'bar';
    const status = over
      ? TallyMoney.format(-left) + ' over'
      : TallyMoney.format(left) + ' left';
    return '<div class="envelope">' +
      '<div class="env-head"><span class="env-name">' + cat.name + '</span>' +
      '<span class="env-nums"><strong>' + TallyMoney.format(spent) + '</strong> of ' +
      TallyMoney.format(cat.budget) + '</span></div>' +
      '<div class="' + cls + '" role="progressbar" aria-valuenow="' + pct +
      '" aria-valuemin="0" aria-valuemax="100" aria-label="' + cat.name + ' ' + pct + ' percent spent">' +
      '<span style="width:' + pct + '%;background:' + cat.colour + '"></span></div>' +
      '<div class="env-foot"><span>' + pct + '% used</span><span class="' +
      (over ? 'over-text' : '') + '">' + status + '</span></div></div>';
  },

  // Thin progress bar for a savings goal.
  goalBar(goal) {
    const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
    return '<div class="goal"><div class="env-head"><span class="env-name">' + goal.name + '</span>' +
      '<span class="env-nums"><strong>' + TallyMoney.format(goal.saved) + '</strong> of ' +
      TallyMoney.format(goal.target) + '</span></div>' +
      '<div class="bar"><span style="width:' + pct + '%;background:#2e6f8e"></span></div>' +
      '<div class="env-foot"><span>' + pct + '% there</span><span>' + goal.note + '</span></div></div>';
  },
};
