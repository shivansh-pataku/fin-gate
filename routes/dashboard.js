const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/auth');
const dashboardService = require('../services/dashboardServices');
const { getRecentUsers, getUserCount } = require('../services/user.services');

// Get dashboard summary
router.get('/summary', checkRole(['admin', 'analyst', 'master_admin'], 'viewer'), (req, res) => {
  try {
    const summary = dashboardService.getDashboardSummary(req.loggingUser.role);
    
    // Add user stats for admin and master_admin
    if (req.loggingUser.role === 'admin' || req.loggingUser.role === 'master_admin') {
      summary.userCount = getUserCount();
      summary.recentUsers = getRecentUsers(5);
    }

    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get totals (income, expenses, net balance)
router.get('/totals', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const totals = dashboardService.calculateTotals();
    res.json(totals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get category-wise totals
router.get('/categories', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const categoryTotals = dashboardService.getCategoryTotals();
    res.json({ categoryTotals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get monthly summary (trends)
router.get('/monthly', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const monthlySummary = dashboardService.getMonthlySummary();
    res.json({ monthlySummary });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get recent activity
router.get('/recent-activity', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const recentActivity = dashboardService.getRecentActivity(limit);
    res.json({ recentActivity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get expense breakdown by category
router.get('/expense-breakdown', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const breakdown = dashboardService.getExpenseBreakdown();
    res.json({ expenseBreakdown: breakdown });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get income breakdown by category
router.get('/income-breakdown', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const breakdown = dashboardService.getIncomeBreakdown();
    res.json({ incomeBreakdown: breakdown });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;