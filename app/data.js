// Tallyhome data — the Alder household, November 2026.
// Every figure on the site is computed from this file: category totals are the
// sum of their transactions, so nothing on screen can disagree with the ledger.
// Money is stored in cents (integers) to keep the arithmetic exact.

const TallyData = {
  household: 'The Alder Family',
  place: 'Maplewood',
  month: 'November 2026',
  monthLabel: 'Nov 2026',
  // The month runs Nov 1-30; the site is rendered as of Nov 26, so 4 days remain.
  daysInMonth: 30,
  dayToday: 26,

  income: [
    { source: "Maya's salary", amount: 340000, note: 'Paid Nov 1' },
    { source: "Tom's salary", amount: 225000, note: 'Paid Nov 1' },
    { source: 'Weekend tutoring', amount: 20000, note: 'Maya, Nov 8 + 22' },
  ],

  // budget = the envelope for the month, in cents. spent is derived from
  // transactions below; colour is the envelope's own colour on charts.
  categories: [
    { id: 'housing', name: 'Housing', budget: 165000, colour: '#1f4d3a', group: 'needs' },
    { id: 'groceries', name: 'Groceries', budget: 72000, colour: '#3e7d5b', group: 'needs' },
    { id: 'utilities', name: 'Utilities', budget: 31000, colour: '#7ba05b', group: 'needs' },
    { id: 'transport', name: 'Transport', budget: 42000, colour: '#b98a2f', group: 'needs' },
    { id: 'kids', name: 'Kids & school', budget: 38000, colour: '#c96f4a', group: 'needs' },
    { id: 'health', name: 'Health', budget: 21000, colour: '#8a6fb8', group: 'needs' },
    { id: 'dining', name: 'Dining out', budget: 24000, colour: '#d6455b', group: 'wants' },
    { id: 'fun', name: 'Fun & treats', budget: 18000, colour: '#e8a13a', group: 'wants' },
    { id: 'clothing', name: 'Clothing', budget: 12000, colour: '#5b8a8a', group: 'wants' },
    { id: 'home', name: 'Home & garden', budget: 15000, colour: '#a0714f', group: 'wants' },
    { id: 'giving', name: 'Giving', budget: 12000, colour: '#7d8aa0', group: 'wants' },
    { id: 'savings', name: 'Savings', budget: 90000, colour: '#2e6f8e', group: 'savings' },
    { id: 'buffer', name: 'Buffer', budget: 45000, colour: '#9aa38f', group: 'buffer' },
  ],

  // date is an ISO day in November 2026; amount is cents, always positive here.
  transactions: [
    { date: '2026-11-01', category: 'housing', merchant: 'Alder Home Loan', note: 'Mortgage, automatic', amount: 145000 },
    { date: '2026-11-01', category: 'housing', merchant: 'Home insurance escrow', note: 'Monthly escrow share', amount: 20000 },
    { date: '2026-11-01', category: 'savings', merchant: 'Transfer to emergency fund', note: 'Automatic, payday', amount: 60000 },
    { date: '2026-11-01', category: 'savings', merchant: 'Transfer to summer trip', note: 'Automatic, payday', amount: 30000 },
    { date: '2026-11-02', category: 'groceries', merchant: 'GreenMart', note: 'Weekly shop', amount: 14820 },
    { date: '2026-11-03', category: 'utilities', merchant: 'City Power', note: 'Electric, October usage', amount: 9680 },
    { date: '2026-11-03', category: 'kids', merchant: 'School lunch top-up', note: 'June + Leo', amount: 9600 },
    { date: '2026-11-04', category: 'transport', merchant: 'Shell Station', note: 'Petrol', amount: 4210 },
    { date: '2026-11-05', category: 'groceries', merchant: 'GreenMart', note: 'Top-up shop', amount: 6240 },
    { date: '2026-11-05', category: 'health', merchant: 'Pharmacy', note: 'Cold medicine', amount: 3240 },
    { date: '2026-11-06', category: 'utilities', merchant: 'Water utility', note: 'Water + sewer', amount: 5820 },
    { date: '2026-11-06', category: 'fun', merchant: 'Cinema', note: 'Family movie, 4 tickets', amount: 4800 },
    { date: '2026-11-07', category: 'transport', merchant: 'Metro Transit', note: 'Monthly passes', amount: 5600 },
    { date: '2026-11-07', category: 'dining', merchant: 'Pasta House', note: 'Anniversary dinner', amount: 8640 },
    { date: '2026-11-08', category: 'utilities', merchant: 'Northline Internet', note: 'Broadband, monthly', amount: 6500 },
    { date: '2026-11-08', category: 'kids', merchant: 'Soccer fees', note: "June's winter term", amount: 8500 },
    { date: '2026-11-09', category: 'groceries', merchant: 'GreenMart', note: 'Weekly shop', amount: 15475 },
    { date: '2026-11-09', category: 'giving', merchant: 'Food bank', note: 'Monthly donation', amount: 6000 },
    { date: '2026-11-10', category: 'dining', merchant: 'Taco truck', note: 'Lunch, Tom', amount: 2460 },
    { date: '2026-11-10', category: 'clothing', merchant: "Kids' winter jackets", note: 'June + Leo', amount: 6499 },
    { date: '2026-11-11', category: 'transport', merchant: 'Shell Station', note: 'Petrol', amount: 3875 },
    { date: '2026-11-12', category: 'groceries', merchant: 'Corner Market', note: 'Bread, milk, eggs', amount: 3860 },
    { date: '2026-11-12', category: 'health', merchant: 'Dentist', note: 'Check-up copay, Leo', amount: 4500 },
    { date: '2026-11-13', category: 'fun', merchant: 'Bookshop', note: 'Two paperbacks', amount: 2785 },
    { date: '2026-11-13', category: 'kids', merchant: 'Art supplies', note: 'School project', amount: 4235 },
    { date: '2026-11-14', category: 'transport', merchant: 'Car wash + oil', note: 'Top-up + wash', amount: 2490 },
    { date: '2026-11-14', category: 'dining', merchant: 'Pizza night', note: 'Takeaway, Friday', amount: 3820 },
    { date: '2026-11-15', category: 'utilities', merchant: 'Northline Mobile', note: 'Two phone lines', amount: 4844 },
    { date: '2026-11-16', category: 'groceries', merchant: 'GreenMart', note: 'Weekly shop', amount: 14130 },
    { date: '2026-11-16', category: 'home', merchant: 'Plumber', note: 'Fix kitchen leak', amount: 14200 },
    { date: '2026-11-17', category: 'dining', merchant: 'Sushi takeaway', note: 'Tuesday treat', amount: 5475 },
    { date: '2026-11-18', category: 'transport', merchant: 'Shell Station', note: 'Petrol', amount: 4120 },
    { date: '2026-11-18', category: 'giving', merchant: "Neighbour's fundraiser", note: 'School bake sale fund', amount: 4000 },
    { date: '2026-11-19', category: 'groceries', merchant: 'Farmers market', note: 'Vegetables + honey', amount: 2750 },
    { date: '2026-11-19', category: 'kids', merchant: 'School trip', note: "Leo's museum visit", amount: 6800 },
    { date: '2026-11-20', category: 'health', merchant: 'Vitamins', note: 'Pharmacy', amount: 880 },
    { date: '2026-11-20', category: 'fun', merchant: 'Board game', note: 'Birthday gift for June', amount: 3450 },
    { date: '2026-11-21', category: 'transport', merchant: 'Parking downtown', note: 'Saturday market', amount: 1800 },
    { date: '2026-11-21', category: 'home', merchant: 'Garden centre', note: 'Spring bulbs', amount: 4540 },
    { date: '2026-11-22', category: 'dining', merchant: 'Café brunch', note: 'Sunday, all four', amount: 3140 },
    { date: '2026-11-23', category: 'groceries', merchant: 'GreenMart', note: 'Weekly shop', amount: 6143 },
    { date: '2026-11-23', category: 'fun', merchant: 'Streaming', note: 'Monthly subscription', amount: 1200 },
    { date: '2026-11-24', category: 'transport', merchant: 'Shell Station', note: 'Petrol', amount: 3680 },
    { date: '2026-11-24', category: 'kids', merchant: 'Library + craft kit', note: 'Books and supplies', amount: 5075 },
    { date: '2026-11-25', category: 'transport', merchant: 'Metro Transit', note: 'Top-up cards', amount: 4400 },
    { date: '2026-11-25', category: 'dining', merchant: 'Burger joint', note: 'Quick dinner', amount: 2325 },
    { date: '2026-11-26', category: 'fun', merchant: 'Ice cream shop', note: 'After-school treat', amount: 2000 },
  ],

  // Bills that fall due in the next two weeks; estimate: true means the figure
  // is last month's amount and the real bill is not in yet.
  bills: [
    { due: '2026-12-01', name: 'Mortgage', amount: 145000, estimate: false },
    { due: '2026-12-03', name: 'City Power', amount: 11000, estimate: true },
    { due: '2026-12-05', name: 'Northline Internet', amount: 6500, estimate: false },
    { due: '2026-12-12', name: 'Car insurance', amount: 11800, estimate: false },
    { due: '2026-12-15', name: 'Water utility', amount: 6200, estimate: true },
    { due: '2026-12-18', name: 'Northline Mobile', amount: 4844, estimate: false },
    { due: '2026-12-20', name: 'School lunch top-up', amount: 9600, estimate: false },
  ],

  goals: [
    { name: 'Emergency fund', saved: 420000, target: 600000, note: '$600 a month, automatic' },
    { name: 'Summer trip', saved: 115000, target: 240000, note: '$300 a month, automatic' },
    { name: "Leo's bike", saved: 18000, target: 32000, note: 'Birthday in March' },
  ],
};
