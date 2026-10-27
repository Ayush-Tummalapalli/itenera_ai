/**
 * Local storage persistence and CSV exporter for Itinera AI Expense Tracker.
 */

const STORAGE_PREFIX = 'itinera_expenses_';

export const EXPENSE_CATEGORIES = [
  { id: 'Food', label: 'Dining & Food', color: '#D47D3B' },
  { id: 'Stay', label: 'Lodging & Hotel', color: '#E05A3A' },
  { id: 'Activities', label: 'Tours & Tickets', color: '#4B739B' },
  { id: 'Transit', label: 'Transit & Cabs', color: '#6A8D73' },
  { id: 'Shopping', label: 'Shopping & Souvenirs', color: '#8E6C88' },
  { id: 'Other', label: 'Tips & Misc', color: '#7E8287' }
];

export function getTripKey(itinerary) {
  if (!itinerary) return 'default_trip';
  return (itinerary.id || itinerary.tripTitle || 'trip')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 40);
}

export function getTripExpenses(tripKey) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${tripKey}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading trip expenses:', e);
    return [];
  }
}

export function saveTripExpenses(tripKey, expenses) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${tripKey}`, JSON.stringify(expenses));
  } catch (e) {
    console.error('Error saving trip expenses:', e);
  }
}

export function addTripExpense(tripKey, newExpense) {
  const current = getTripExpenses(tripKey);
  const expenseItem = {
    id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: newExpense.title || 'Expense',
    amount: Number(newExpense.amount) || 0,
    category: newExpense.category || 'Food',
    dayNumber: newExpense.dayNumber ? Number(newExpense.dayNumber) : null,
    date: newExpense.date || new Date().toISOString().split('T')[0],
    note: newExpense.note || ''
  };
  const updated = [expenseItem, ...current];
  saveTripExpenses(tripKey, updated);
  return updated;
}

export function deleteTripExpense(tripKey, expenseId) {
  const current = getTripExpenses(tripKey);
  const updated = current.filter(e => e.id !== expenseId);
  saveTripExpenses(tripKey, updated);
  return updated;
}

export function exportExpensesCSV(expenses = [], tripTitle = 'Trip Expenses', currency = 'USD') {
  if (typeof window === 'undefined') return;
  
  const headers = ['Date', 'Day', 'Category', 'Description', `Amount (${currency})`, 'Note'];
  const rows = expenses.map(e => [
    `"${e.date || ''}"`,
    `"${e.dayNumber ? `Day ${e.dayNumber}` : 'General'}"`,
    `"${e.category || 'Other'}"`,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    Number(e.amount || 0).toFixed(2),
    `"${(e.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${tripTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_expenses.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
