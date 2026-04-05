const { records } = require('../data/mockData');
const { getActiveRecords, getDeletedRecords } = require('./recordServices');

// Calculate total income and expenses
const calculateTotals = () => {
  const activeRecords = getActiveRecords();
  let totalIncome = 0;
  let totalExpenses = 0;

  activeRecords.forEach(r => {
    if (r.type === 'income') {
      totalIncome += r.amount;
    } else if (r.type === 'expense') {
      totalExpenses += r.amount;
    }
  });

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses
  };
};

// Get category-wise totals
const getCategoryTotals = () => {
  const activeRecords = getActiveRecords();
  const categoryTotals = {};

  activeRecords.forEach(r => {
    if (!categoryTotals[r.category]) {
      categoryTotals[r.category] = 0;
    }
    categoryTotals[r.category] += r.amount;
  });

  return categoryTotals;
};

// Get monthly summaries (aggregated by month)
//if we use database, we can do this with a single query using GROUP BY and date functions, and even can be calculated automatically with materialized views or scheduled jobs. But since we are using in-memory data, we need to calculate it manually by iterating through the records and grouping them by month.
const getMonthlySummary = () => {
  const activeRecords = getActiveRecords();
  const monthlySummary = {};

  activeRecords.forEach(r => {
    const month = r.date.substring(0, 7); // YYYY-MM format
    if (!monthlySummary[month]) {
      monthlySummary[month] = { income: 0, expense: 0 };
    }
    if (r.type === 'income') {
      monthlySummary[month].income += r.amount;
    } else {
      monthlySummary[month].expense += r.amount;
    }
  });

  return monthlySummary;
};

// Get recent records
const getRecentActivity = (limit = 5) => {
  const activeRecords = getActiveRecords();
  return activeRecords.slice(-limit).reverse(); // Most recent first
};

// Get summary for admin/analyst dashboard
const getDashboardSummary = (userRole) => {
  const totals = calculateTotals();
  const categoryTotals = getCategoryTotals();
  const recentRecords = getRecentActivity(5);
  const activeRecords = getActiveRecords();

  const summary = {
    ...totals,
    categoryTotals,
    recordCount: activeRecords.length
  };

  // Admin and master_admin get additional details
  if (userRole === 'admin' || userRole === 'master_admin') {
    summary.recentRecords = recentRecords;
    summary.recentDeletedRecords = getDeletedRecords().slice(-5);
    summary.monthlySummary = getMonthlySummary();
  }

  return summary;
};

// Get expense breakdown by category
const getExpenseBreakdown = () => {
  const activeRecords = getActiveRecords();
  const expenses = activeRecords.filter(r => r.type === 'expense');
  const breakdown = {};

  expenses.forEach(r => {
    if (!breakdown[r.category]) {
      breakdown[r.category] = { count: 0, total: 0 };
    }
    breakdown[r.category].count += 1;
    breakdown[r.category].total += r.amount;
  });

  return breakdown;
};

// Get income breakdown by category
const getIncomeBreakdown = () => {
  const activeRecords = getActiveRecords();
  const incomes = activeRecords.filter(r => r.type === 'income');
  const breakdown = {};

  incomes.forEach(r => {
    if (!breakdown[r.category]) {
      breakdown[r.category] = { count: 0, total: 0 };
    }
    breakdown[r.category].count += 1;
    breakdown[r.category].total += r.amount;
  });

  return breakdown;
};

module.exports = {
  calculateTotals,
  getCategoryTotals,
  getMonthlySummary,
  getRecentActivity,
  getDashboardSummary,
  getExpenseBreakdown,
  getIncomeBreakdown
};