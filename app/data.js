// Tallyhome data: the Reyes household, November 2026.
//
// This file is the site's single source of truth. Every figure the pages show
// — category actuals, the month's totals, the savings rate — is summed from
// these lists by the views, so the dashboard, the budget table and the
// activity page can never disagree with each other. Amounts are dollars.

export const HOUSEHOLD = {
  name: 'The Reyes household',
  members: 'Maya, Daniel and June (age 4)',
  monthLabel: 'November 2026',
  today: '2026-11-26', // the day this budget snapshot is taken
  daysInMonth: 30,
};

// Money in during November. `day` is the day of the month it landed.
export const INCOME = [
  { day: 2, source: 'Maya — salary, Northwind Studio', amount: 3240 },
  { day: 6, source: 'Daniel — salary, City Depot Logistics', amount: 2405 },
  { day: 9, source: 'Sold: stroller and baby gate', amount: 60 },
  { day: 16, source: 'Daniel — weekend overtime', amount: 155 },
];

// Budget categories. `group` is one of needs / wants / savings; `planned` is
// what the household assigned the category for November. Actual spending is
// never stored here — it is summed from TRANSACTIONS below.
export const CATEGORIES = [
  { id: 'rent', group: 'needs', label: 'Rent', planned: 1650, note: 'Flat on Alder Street, due the 1st' },
  { id: 'groceries', group: 'needs', label: 'Groceries', planned: 780, note: 'Weekly FreshMart shop plus top-ups' },
  { id: 'childcare', group: 'needs', label: 'Childcare', planned: 560, note: 'Little Sprouts, four days a week' },
  { id: 'transport', group: 'needs', label: 'Transport', planned: 268, note: 'Fuel, two transit passes, parking' },
  { id: 'utilities', group: 'needs', label: 'Utilities', planned: 214, note: 'Electric, water and heating gas' },
  { id: 'insurance', group: 'needs', label: 'Insurance', planned: 186, note: 'Car insurance, monthly slice' },
  { id: 'phone', group: 'needs', label: 'Phone & internet', planned: 143, note: 'Two mobile lines and fibre' },
  { id: 'eating-out', group: 'wants', label: 'Eating out', planned: 210, note: 'Takeaway and family dinners' },
  { id: 'fun', group: 'wants', label: 'Fun & outings', planned: 140, note: 'Zoo, cinema, park trips' },
  { id: 'clothes', group: 'wants', label: 'Clothes', planned: 110, note: 'June grows out of shoes fast' },
  { id: 'home-extras', group: 'wants', label: 'Home extras', planned: 85, note: 'Pharmacy, hardware, small fixes' },
  { id: 'subscriptions', group: 'wants', label: 'Subscriptions', planned: 57, note: 'Streaming, music, gym, cloud' },
  { id: 'emergency', group: 'savings', label: 'Emergency fund', planned: 700, note: 'Transfer on the 2nd, before spending starts' },
  { id: 'loan', group: 'savings', label: 'Extra loan payment', planned: 250, note: 'On top of the minimum, every month' },
  { id: 'holiday', group: 'savings', label: 'Holiday fund', planned: 220, note: 'Lisbon, July 2027' },
  { id: 'car-fund', group: 'savings', label: 'Car fund', planned: 120, note: 'Repairs first, replacement later' },
];

export const GROUP_LABELS = { needs: 'Needs', wants: 'Wants', savings: 'Savings & debt' };

// Money out during November, newest last. Savings transfers are listed too,
// under their savings category, so "actual" means the same thing everywhere:
// money that has left the current account on purpose.
export const TRANSACTIONS = [
  { day: 1, payee: 'Rent — Alder Street landlord', category: 'rent', amount: 1650 },
  { day: 2, payee: 'Transfer to emergency savings', category: 'emergency', amount: 700 },
  { day: 2, payee: 'Transfer to holiday fund', category: 'holiday', amount: 220 },
  { day: 3, payee: 'Extra payment — student loan', category: 'loan', amount: 250 },
  { day: 3, payee: 'Transfer to car fund', category: 'car-fund', amount: 120 },
  { day: 3, payee: 'FreshMart — weekly shop', category: 'groceries', amount: 132.46 },
  { day: 5, payee: 'Car insurance premium', category: 'insurance', amount: 186 },
  { day: 5, payee: 'Little Sprouts childcare', category: 'childcare', amount: 560 },
  { day: 6, payee: 'Fuel — Depot petrol station', category: 'transport', amount: 48.2 },
  { day: 7, payee: 'Streamly video', category: 'subscriptions', amount: 15.99 },
  { day: 7, payee: 'Musicbox', category: 'subscriptions', amount: 10.99 },
  { day: 8, payee: 'FreshMart — weekly shop', category: 'groceries', amount: 118.73 },
  { day: 9, payee: 'Pharmacy & household bits', category: 'home-extras', amount: 36.45 },
  { day: 10, payee: 'City Power — electric bill', category: 'utilities', amount: 96.4 },
  { day: 11, payee: 'Transit passes × 2', category: 'transport', amount: 68 },
  { day: 12, payee: 'Stack & Sons — burgers', category: 'eating-out', amount: 42.6 },
  { day: 13, payee: 'Metro Water — water bill', category: 'utilities', amount: 48.15 },
  { day: 14, payee: 'FreshMart — weekly shop', category: 'groceries', amount: 141.28 },
  { day: 15, payee: "Nonna's Table — family dinner", category: 'eating-out', amount: 86.4 },
  { day: 15, payee: 'Kids shoes for June', category: 'clothes', amount: 54.99 },
  { day: 16, payee: 'Cloud storage', category: 'subscriptions', amount: 2.99 },
  { day: 17, payee: 'Fuel — Depot petrol station', category: 'transport', amount: 44.65 },
  { day: 18, payee: 'Gym membership', category: 'subscriptions', amount: 29 },
  { day: 19, payee: 'Pizza night', category: 'eating-out', amount: 38.25 },
  { day: 20, payee: 'FreshMart — weekly shop', category: 'groceries', amount: 126.54 },
  { day: 21, payee: 'Zoo tickets × 3', category: 'fun', amount: 46 },
  { day: 22, payee: 'Hardware store — tap washers', category: 'home-extras', amount: 28.3 },
  { day: 23, payee: 'Sushi takeaway', category: 'eating-out', amount: 57.8 },
  { day: 24, payee: 'FreshMart — top-up shop', category: 'groceries', amount: 58.9 },
  { day: 24, payee: 'Wiper blades', category: 'transport', amount: 24.99 },
  { day: 24, payee: 'Parking — hospital visit', category: 'transport', amount: 18.5 },
  { day: 25, payee: 'Mobile phones — two lines', category: 'phone', amount: 84 },
  { day: 25, payee: 'Fuel — motorway services', category: 'transport', amount: 52.3 },
];

// Recurring bills and subscriptions. `status` is paid or upcoming for
// November; subscriptions carry their monthly price so the page can show the
// yearly cost of keeping them.
export const BILLS = [
  { name: 'Rent — Alder Street', amount: 1650, due: '1st', status: 'paid', detail: 'Paid Nov 1 by standing order' },
  { name: 'Little Sprouts childcare', amount: 560, due: '5th', status: 'paid', detail: 'Paid Nov 5' },
  { name: 'Car insurance', amount: 186, due: '5th', status: 'paid', detail: 'Paid Nov 5' },
  { name: 'Electric — City Power', amount: 96.4, due: '10th', status: 'paid', detail: 'Paid Nov 10, actual meter reading' },
  { name: 'Water — Metro Water', amount: 48.15, due: '13th', status: 'paid', detail: 'Paid Nov 13' },
  { name: 'Mobile phones — two lines', amount: 84, due: '25th', status: 'paid', detail: 'Paid Nov 25' },
  { name: 'Internet — Fiberline fibre', amount: 59.99, due: '27th', status: 'upcoming', detail: 'Direct debit lands Nov 27' },
  { name: 'Heating gas — City Power', amount: 52, due: '28th', status: 'upcoming', detail: 'Estimated; last November was $54.10' },
];

export const SUBSCRIPTIONS = [
  { name: 'Gym membership', monthly: 29, detail: 'Both adults, off-peak' },
  { name: 'Streamly video', monthly: 15.99, detail: 'Family plan, shared with Maya’s sister' },
  { name: 'Musicbox', monthly: 10.99, detail: 'One account, two phones' },
  { name: 'Cloud storage', monthly: 2.99, detail: 'Photo backup — the non-negotiable one' },
];

// Savings goals. `monthly` is what the budget sends each month (the matching
// category above), so the months-to-goal figure on the goals page is computed
// from these numbers, not typed in.
export const GOALS = [
  {
    name: 'Emergency fund',
    saved: 7850,
    target: 10000,
    monthly: 700,
    note: 'Three months of needs ($3,801) would be $11,403; $10,000 is the first finish line.',
  },
  {
    name: 'Lisbon holiday, July 2027',
    saved: 640,
    target: 2400,
    monthly: 220,
    note: 'Flights for three, a week in Alfama, and one very planned seafood dinner.',
  },
  {
    name: 'Car replacement',
    saved: 2300,
    target: 6000,
    monthly: 120,
    note: 'The current car is 11 years old. The fund covers repairs first, replacement when it must.',
  },
];

// The student loan, shown on the goals page as a payoff countdown.
export const LOAN = { balance: 8940, minimum: 118, extra: 250, rateLabel: '4.9% APR', goneEarlyBy: '14 months', debtFreeLabel: 'June 2028' };

// Income vs money out for the last five finished months, for the dashboard
// bars. November is computed live from INCOME and TRANSACTIONS instead.
export const HISTORY = [
  { month: 'Jun', income: 5720, out: 5310 },
  { month: 'Jul', income: 5810, out: 5495 },
  { month: 'Aug', income: 5860, out: 5602 },
  { month: 'Sep', income: 5790, out: 5388 },
  { month: 'Oct', income: 5905, out: 5517 },
];
