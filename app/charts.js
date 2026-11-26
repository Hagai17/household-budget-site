// Charts for Tallyhome, drawn as inline SVG strings. No library: a donut is
// a few circle strokes and a bar chart is a few rects, and keeping them here
// keeps the first load small and every figure tied to the data file.

import { money } from './money.js';

const DONUT_COLORS = ['#276749', '#c77400', '#7c5cbf', '#2b6cb0', '#b3402a', '#5a7d2a', '#8a6d3b', '#4a5568'];

// Donut of parts: [{ label, value }]. Returns SVG with a centre total and
// leaves the legend to the caller, who knows the page's layout.
export function donutChart(parts, size = 190) {
  const total = parts.reduce((t, p) => t + p.value, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const rings = parts
    .map((part, i) => {
      const frac = total ? part.value / total : 0;
      const dash = frac * circumference;
      const el = `<circle cx="100" cy="100" r="${radius}" fill="none" stroke="${DONUT_COLORS[i % DONUT_COLORS.length]}" stroke-width="26" stroke-dasharray="${dash.toFixed(2)} ${(circumference - dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 100 100)"><title>${part.label}: ${money(part.value)}</title></circle>`;
      offset += dash;
      return el;
    })
    .join('');
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="Spending by category, total ${money(total)}">${rings}<text x="100" y="95" text-anchor="middle" class="donut-total">${money(total)}</text><text x="100" y="116" text-anchor="middle" class="donut-caption">spent so far</text></svg>`;
}

export function donutLegend(parts) {
  const total = parts.reduce((t, p) => t + p.value, 0);
  return parts
    .map((part, i) => {
      const share = total ? Math.round((part.value / total) * 100) : 0;
      return `<li><span class="swatch" style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></span>${part.label}<span class="legend-value">${money(part.value)} · ${share}%</span></li>`;
    })
    .join('');
}

// Grouped bars: rows of { month, income, out }. Two bars a month, income in
// green and money out in amber, scaled to the largest value in the set.
export function cashFlowBars(rows, width = 520, height = 190) {
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.out))) * 1.08;
  const base = height - 26;
  const usable = base - 14;
  const groupW = width / rows.length;
  const barW = Math.min(26, groupW / 3.4);
  const bars = rows
    .map((row, i) => {
      const x0 = i * groupW + groupW / 2;
      const ih = (row.income / max) * usable;
      const oh = (row.out / max) * usable;
      return `<rect x="${(x0 - barW - 3).toFixed(1)}" y="${(base - ih).toFixed(1)}" width="${barW}" height="${ih.toFixed(1)}" rx="3" fill="#276749"><title>${row.month} income ${money(row.income)}</title></rect>` +
        `<rect x="${(x0 + 3).toFixed(1)}" y="${(base - oh).toFixed(1)}" width="${barW}" height="${oh.toFixed(1)}" rx="3" fill="#c77400"><title>${row.month} out ${money(row.out)}</title></rect>` +
        `<text x="${x0}" y="${height - 6}" text-anchor="middle" class="bar-label">${row.month}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" class="bars" role="img" aria-label="Income versus money out, last six months"><line x1="0" y1="${base}" x2="${width}" y2="${base}" class="axis"/>${bars}</svg>`;
}

// A single progress bar with an over-100% state, used by the budget table
// and the goals page. `ratio` is 0..1+; the fill turns red past 1.
export function progressBar(ratio, label) {
  const widthPct = Math.min(100, Math.max(0, ratio * 100));
  const over = ratio > 1 ? ' over' : '';
  return `<div class="progress${over}" role="img" aria-label="${label}"><span style="width:${widthPct.toFixed(1)}%"></span></div>`;
}
