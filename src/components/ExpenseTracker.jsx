'use client';

import { useState, useEffect } from 'react';
import { 
  getTripKey, 
  getTripExpenses, 
  addTripExpense, 
  deleteTripExpense, 
  exportExpensesCSV,
  EXPENSE_CATEGORIES 
} from '@/lib/expenseStorage';
import { convertCurrencyString, CURRENCIES } from '@/lib/currencyConverter';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart, 
  Receipt, 
  Filter,
  Coffee,
  Train,
  Utensils
} from 'lucide-react';

export default function ExpenseTracker({ itinerary, currency = 'USD' }) {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [dayNumber, setDayNumber] = useState('');
  const [note, setNote] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const tripKey = getTripKey(itinerary);

  useEffect(() => {
    setExpenses(getTripExpenses(tripKey));
  }, [tripKey]);

  // Parse estimated budget total from itinerary
  const parseEstimatedBudget = () => {
    if (!itinerary?.estimatedBudgetPerPax) return 350;
    const match = String(itinerary.estimatedBudgetPerPax).match(/\d+/);
    return match ? parseInt(match[0], 10) : 350;
  };

  const estimatedBudgetRaw = parseEstimatedBudget();
  // Format estimated budget according to active currency
  const currRate = CURRENCIES[currency]?.rate || 1;
  const currSymbol = CURRENCIES[currency]?.symbol || '$';
  const estimatedBudgetInCurr = Math.round(estimatedBudgetRaw * currRate);

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const remainingBudget = estimatedBudgetInCurr - totalSpent;
  const spentPercent = Math.min(Math.round((totalSpent / Math.max(estimatedBudgetInCurr, 1)) * 100), 100);

  const handleAddExpense = (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    const updated = addTripExpense(tripKey, {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      dayNumber: dayNumber ? parseInt(dayNumber, 10) : null,
      note: note.trim()
    });

    setExpenses(updated);
    setTitle('');
    setAmount('');
    setNote('');
  };

  const handleDeleteExpense = (id) => {
    const updated = deleteTripExpense(tripKey, id);
    setExpenses(updated);
  };

  const handleQuickAdd = (presetTitle, presetAmount, presetCategory) => {
    const adjustedAmount = Math.round(presetAmount * currRate);
    const updated = addTripExpense(tripKey, {
      title: presetTitle,
      amount: adjustedAmount,
      category: presetCategory,
      dayNumber: 1
    });
    setExpenses(updated);
  };

  // Category totals
  const categoryTotals = {};
  EXPENSE_CATEGORIES.forEach(cat => { categoryTotals[cat.id] = 0; });
  expenses.forEach(e => {
    const cat = e.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(e.amount) || 0);
  });

  const filteredExpenses = filterCategory === 'ALL'
    ? expenses
    : expenses.filter(e => e.category === filterCategory);

  return (
    <div className="rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] p-5 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E1D5]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E05A3A]">
            <Receipt className="w-4 h-4 text-[#E05A3A]" />
            <span>Field Expense & Budget Ledger</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#162842] mt-0.5">
            Real-Time Spending vs. Estimated Budget
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportExpensesCSV(expenses, itinerary.tripTitle, currency)}
            disabled={expenses.length === 0}
            className="px-3 py-1.5 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] hover:bg-[#F7F4EC] text-xs font-semibold text-[#162842] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Download CSV spreadsheet of logged expenses"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Card 1: Estimated Budget */}
        <div className="p-4 rounded-lg border border-[#E8E1D5] bg-[#FAF7F0] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#526685]">
            Estimated Baseline ({currency})
          </span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#162842]">
            {currSymbol}{estimatedBudgetInCurr.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#526685]">
            Based on AI recommendation
          </span>
        </div>

        {/* Card 2: Actual Spent */}
        <div className="p-4 rounded-lg border border-[#E8E1D5] bg-[#FAF7F0] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#526685]">
            Actual Logged Spending
          </span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#E05A3A]">
            {currSymbol}{totalSpent.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#526685]">
            {expenses.length} item{expenses.length === 1 ? '' : 's'} recorded
          </span>
        </div>

        {/* Card 3: Remaining Balance */}
        <div className={`p-4 rounded-lg border space-y-1 ${
          remainingBudget >= 0 
            ? 'border-emerald-200 bg-emerald-50/50 text-[#162842]' 
            : 'border-red-200 bg-red-50/50 text-red-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526685]">
              Remaining Funds
            </span>
            {remainingBudget >= 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> On Track
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3" /> Over Budget
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold">
            {remainingBudget < 0 ? '-' : ''}{currSymbol}{Math.abs(remainingBudget).toLocaleString()}
          </div>
          <span className="text-[11px] opacity-80">
            {remainingBudget >= 0 ? `${100 - spentPercent}% headroom remaining` : 'Exceeds target budget'}
          </span>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 p-3 rounded-lg border border-[#E8E1D5] bg-[#F7F4EC]">
        <div className="flex items-center justify-between text-xs font-semibold text-[#162842]">
          <span>Budget Burn Rate</span>
          <span>{spentPercent}% Allocated</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#E8E1D5] overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              spentPercent > 90 ? 'bg-red-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-[#E05A3A]'
            }`}
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>

      {/* Category Spend Distribution */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#526685]">
          Spending by Category
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {EXPENSE_CATEGORIES.map(cat => {
            const catTotal = categoryTotals[cat.id] || 0;
            return (
              <div 
                key={cat.id}
                className="p-2.5 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#162842] truncate">{cat.label}</span>
                </div>
                <div className="text-sm font-bold text-[#162842]">
                  {currSymbol}{catTotal.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Expense Form */}
      <form onSubmit={handleAddExpense} className="p-4 sm:p-5 rounded-lg border border-[#E8E1D5] bg-[#F7F4EC] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#162842] flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#E05A3A]" />
            Log New Expense
          </span>
          {/* Quick presets */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span className="text-[#526685] font-medium">Quick add:</span>
            <button
              type="button"
              onClick={() => handleQuickAdd('Coffee & Pastry', 5, 'Food')}
              className="px-2 py-0.5 rounded border border-[#E8E1D5] bg-[#FAF7F0] hover:border-[#E05A3A] text-[#162842]"
            >
              + Coffee ($5)
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd('Subway / Bus Pass', 10, 'Transit')}
              className="px-2 py-0.5 rounded border border-[#E8E1D5] bg-[#FAF7F0] hover:border-[#E05A3A] text-[#162842]"
            >
              + Transit ($10)
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd('Local Street Food Dinner', 20, 'Food')}
              className="px-2 py-0.5 rounded border border-[#E8E1D5] bg-[#FAF7F0] hover:border-[#E05A3A] text-[#162842]"
            >
              + Dinner ($20)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Title */}
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="Description (e.g. Sushi lunch, Metro card)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] text-xs font-medium text-[#162842] placeholder-[#8FA5C2] outline-none focus:border-[#E05A3A]"
              required
            />
          </div>

          {/* Amount */}
          <div className="sm:col-span-2">
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs font-semibold text-[#526685]">
                {currSymbol}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-6 pr-2 py-2 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] text-xs font-semibold text-[#162842] placeholder-[#8FA5C2] outline-none focus:border-[#E05A3A]"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="sm:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-2 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] text-xs font-medium text-[#162842] outline-none focus:border-[#E05A3A]"
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div className="sm:col-span-2">
            <select
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
              className="w-full px-2.5 py-2 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] text-xs font-medium text-[#162842] outline-none focus:border-[#E05A3A]"
            >
              <option value="">General</option>
              {(itinerary.days || []).map(d => (
                <option key={d.dayNumber} value={d.dayNumber}>
                  Day {d.dayNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <input
            type="text"
            placeholder="Optional note / location / vendor..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-2/3 px-3 py-1.5 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] text-xs font-normal text-[#162842] placeholder-[#8FA5C2] outline-none focus:border-[#E05A3A]"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </form>

      {/* Expenses Log List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526685]">
              Logged Entries ({filteredExpenses.length})
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] text-[#526685] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                filterCategory === 'ALL'
                  ? 'bg-[#162842] text-white'
                  : 'bg-[#FAF7F0] border border-[#E8E1D5] text-[#526685] hover:text-[#162842]'
              }`}
            >
              All
            </button>
            {EXPENSE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  filterCategory === cat.id
                    ? 'bg-[#162842] text-white'
                    : 'bg-[#FAF7F0] border border-[#E8E1D5] text-[#526685] hover:text-[#162842]'
                }`}
              >
                {cat.id}
              </button>
            ))}
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#E8E1D5] text-[#526685] space-y-1">
            <Receipt className="w-6 h-6 mx-auto text-[#8FA5C2]" />
            <p className="text-xs font-semibold">No expenses logged yet</p>
            <p className="text-[11px]">Use the form above or quick presets to log your trip expenses.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredExpenses.map((expense) => {
              const catObj = EXPENSE_CATEGORIES.find(c => c.id === expense.category);
              return (
                <div
                  key={expense.id}
                  className="p-3 rounded-md border border-[#E8E1D5] bg-[#FAF7F0] flex items-center justify-between gap-3 hover:border-[#162842] transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#162842]">
                        {expense.title}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#E8E1D5] text-[#162842]">
                        {expense.category}
                      </span>
                      {expense.dayNumber && (
                        <span className="text-[10px] font-medium text-[#E05A3A]">
                          Day {expense.dayNumber}
                        </span>
                      )}
                    </div>
                    {expense.note && (
                      <p className="text-[11px] text-[#526685] italic truncate">
                        "{expense.note}"
                      </p>
                    )}
                    <span className="text-[10px] text-[#8FA5C2] block">
                      {expense.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-serif text-sm font-bold text-[#162842]">
                      {currSymbol}{Number(expense.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-1.5 rounded text-[#8FA5C2] hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete expense entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
