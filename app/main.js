// Tallyhome entry point: holds the ledger, routes the hash to a view, and
// wires the controls (the budget calculator, the activity filter and the
// add-transaction form) after each render.

import { TRANSACTIONS } from './data.js';
import { activityView, billsView, budgetView, goalsView, guideView, overviewView, splitTable } from './views.js';

// The ledger starts as the household's real November and can grow while the
// page is open: adding a transaction re-renders the current page, and every
// other page reads the same list, so all totals stay in step.
const state = {
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  filter: 'all',
};

const view = document.getElementById('view');

const ROUTES = {
  '': 'overview',
  '/': 'overview',
  '/budget': 'budget',
  '/activity': 'activity',
  '/bills': 'bills',
  '/goals': 'goals',
  '/guide': 'guide',
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  return ROUTES[hash] ?? 'overview';
}

function render() {
  const route = currentRoute();
  const tx = state.transactions;
  if (route === 'overview') view.innerHTML = overviewView(tx);
  else if (route === 'budget') { view.innerHTML = budgetView(tx); wireBudget(tx); }
  else if (route === 'activity') { view.innerHTML = activityView(tx, state.filter); wireActivity(); }
  else if (route === 'bills') view.innerHTML = billsView();
  else if (route === 'goals') view.innerHTML = goalsView();
  else view.innerHTML = guideView(tx);

  document.querySelectorAll('.site-nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  window.scrollTo(0, 0);
}

// The 50/30/20 calculator: re-render its table on every keystroke.
function wireBudget(tx) {
  const input = document.getElementById('pay-input');
  const output = document.getElementById('split-output');
  const draw = () => { output.innerHTML = splitTable(Number(input.value) || 0, tx); };
  input.addEventListener('input', draw);
  draw();
}

// The activity page's filter and add form.
function wireActivity() {
  document.getElementById('filter-select').addEventListener('change', (event) => {
    state.filter = event.target.value;
    render();
  });
  document.getElementById('add-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const day = Number(document.getElementById('f-day').value);
    const payee = document.getElementById('f-payee').value.trim();
    const category = document.getElementById('f-category').value;
    const amount = Number(document.getElementById('f-amount').value);
    if (!payee || !(day >= 1 && day <= 30) || !(amount > 0)) return;
    state.transactions.push({ day, payee, category, amount });
    state.filter = 'all';
    render();
  });
}

window.addEventListener('hashchange', render);
render();
