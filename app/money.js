// Money and calendar helpers for Tallyhome. Everything here is pure: a value
// goes in, a formatted string or a sum comes out, nothing is stored.

export function money(amount) {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const whole = Math.floor(abs);
  const cents = Math.round((abs - whole) * 100);
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return cents === 0 ? `${sign}$${grouped}` : `${sign}$${grouped}.${String(cents).padStart(2, '0')}`;
}

export function moneyExact(amount) {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const whole = Math.floor(abs);
  const cents = Math.round((abs - whole) * 100);
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${grouped}.${String(cents).padStart(2, '0')}`;
}

export function sum(rows, pick) {
  return rows.reduce((total, row) => total + pick(row), 0);
}

// A percentage that is safe to show: 0 when there is nothing to divide by.
export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

// "Nov 3" for a day-of-month in the budget month.
const MONTH_SHORT = 'Nov';
export function dayLabel(day) {
  return `${MONTH_SHORT} ${day}`;
}

// Months needed to reach a target at a fixed monthly amount, rounded up:
// a goal is only finished when the last payment lands.
export function monthsToGoal(saved, target, monthly) {
  if (saved >= target) return 0;
  if (monthly <= 0) return Infinity;
  return Math.ceil((target - saved) / monthly);
}

const MONTH_NAMES = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

// The month label `months` after November 2026, e.g. 4 -> "March 2027".
export function monthAfter(months) {
  const index = 10 + months; // November 2026 is index 10 of its year
  const name = MONTH_NAMES[index % 12];
  const year = 2026 + Math.floor(index / 12);
  return `${name} ${year}`;
}
