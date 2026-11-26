// Tallyhome main — routing and state.
// The site is three hash pages (#/, #/budget, #/activity). State is the month's
// ledger from data.js plus the household's own changes, kept in localStorage:
// budget tweaks, added expenses and removed ones. Nothing leaves the device.

(function () {
  var STORAGE_KEY = 'tallyhome-v1';
  var app = document.getElementById('app');

  function loadState() {
    var state = {
      household: TallyData.household,
      place: TallyData.place,
      month: TallyData.month,
      monthLabel: TallyData.monthLabel,
      daysInMonth: TallyData.daysInMonth,
      dayToday: TallyData.dayToday,
      income: TallyData.income,
      categories: TallyData.categories.map(function (c) { return Object.assign({}, c); }),
      transactions: TallyData.transactions.map(function (t, i) {
        return Object.assign({ id: 't' + i }, t);
      }),
      bills: TallyData.bills,
      goals: TallyData.goals,
    };
    try {
      var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) {
        if (saved.budgets) {
          state.categories.forEach(function (c) {
            if (typeof saved.budgets[c.id] === 'number') c.budget = saved.budgets[c.id];
          });
        }
        if (Array.isArray(saved.added)) state.transactions = state.transactions.concat(saved.added);
        if (Array.isArray(saved.removed)) {
          state.transactions = state.transactions.filter(function (t) {
            return saved.removed.indexOf(t.id) === -1;
          });
        }
      }
    } catch (e) { /* a broken saved state just means: start from the ledger */ }
    return state;
  }

  function saveState(state, added, removed) {
    var budgets = {};
    state.categories.forEach(function (c) { budgets[c.id] = c.budget; });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        budgets: budgets,
        added: added,
        removed: removed,
      }));
    } catch (e) { /* private mode: the site still works for this visit */ }
  }

  var state = loadState();
  var added = state.transactions.filter(function (t) { return String(t.id).indexOf('u') === 0; });
  var removed = [];
  try {
    var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && Array.isArray(saved.removed)) removed = saved.removed;
  } catch (e) {}

  var filter = 'all';
  var query = '';

  function currentRoute() {
    var hash = window.location.hash || '#/';
    if (hash.indexOf('#/budget') === 0) return 'budget';
    if (hash.indexOf('#/activity') === 0) return 'activity';
    return 'overview';
  }

  function render() {
    var route = currentRoute();
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('href') === '#/' + (route === 'overview' ? '' : route));
    });
    if (route === 'budget') app.innerHTML = TallyViews.budget(TallyData, state);
    else if (route === 'activity') app.innerHTML = TallyViews.activity(TallyData, state, filter, query);
    else app.innerHTML = TallyViews.overview(TallyData, state);
    window.scrollTo(0, 0);
  }

  // One delegated listener covers the whole page: budget tweaks, filters,
  // removals and the search box all live inside #app.
  app.addEventListener('click', function (event) {
    var adjust = event.target.closest('[data-adjust]');
    if (adjust) {
      var parts = adjust.getAttribute('data-adjust').split(':');
      var cat = state.categories.find(function (c) { return c.id === parts[0]; });
      if (cat) {
        cat.budget = Math.max(0, cat.budget + Number(parts[1]));
        saveState(state, added, removed);
        render();
      }
      return;
    }
    var chip = event.target.closest('[data-filter]');
    if (chip) {
      filter = chip.getAttribute('data-filter');
      render();
      return;
    }
    var remove = event.target.closest('[data-remove]');
    if (remove) {
      var id = remove.getAttribute('data-remove');
      state.transactions = state.transactions.filter(function (t) { return t.id !== id; });
      added = added.filter(function (t) { return t.id !== id; });
      removed.push(id);
      saveState(state, added, removed);
      render();
    }
  });

  app.addEventListener('input', function (event) {
    if (event.target.id === 'tx-search') {
      query = event.target.value;
      var list = app.querySelector('.txs');
      if (list) {
        // Re-render only the list so the search box keeps focus and its text.
        var html = TallyViews.activity(TallyData, state, filter, query);
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var fresh = tmp.querySelector('.txs');
        if (fresh) list.innerHTML = fresh.innerHTML;
        var count = tmp.querySelector('.hero-sub');
        var shown = app.querySelector('.hero-sub');
        if (count && shown) shown.textContent = count.textContent;
      }
    }
  });

  app.addEventListener('submit', function (event) {
    if (event.target.id !== 'add-tx') return;
    event.preventDefault();
    var form = event.target;
    var amount = Math.round(Number(form.amount.value) * 100);
    if (!amount || amount <= 0) return;
    var tx = {
      id: 'u' + Date.now(),
      date: form.date.value || '2026-11-26',
      category: form.category.value,
      merchant: form.merchant.value.trim(),
      note: 'Added by the household',
      amount: amount,
    };
    state.transactions.push(tx);
    added.push(tx);
    saveState(state, added, removed);
    render();
  });

  window.addEventListener('hashchange', render);
  render();
})();
