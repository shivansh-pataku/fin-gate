const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/auth');
const dashboardService = require('../services/dashboardServices');
const { getRecentUsers, getUserCount } = require('../services/user.services');


/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get complete financial summary and analytics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard summary data
 *       401:
 *         description: Unauthorized
 */


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

/**
 * @swagger
 * /dashboard/totals:
 *   get:
 *     summary: Get financial totals (income, expenses, net balance)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Financial totals
 *       401:
 *         description: Unauthorized
 */
router.get('/totals', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const totals = dashboardService.calculateTotals();
    res.json(totals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /dashboard/categories:
 *   get:
 *     summary: Get category-wise breakdown of income and expenses
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Category totals
 *       401:
 *         description: Unauthorized
 */
router.get('/categories', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const categoryTotals = dashboardService.getCategoryTotals();
    res.json({ categoryTotals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /dashboard/monthly:
 *   get:
 *     summary: Get monthly financial trends and summary
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Monthly summary data
 *       401:
 *         description: Unauthorized
 */
router.get('/monthly', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const monthlySummary = dashboardService.getMonthlySummary();
    res.json({ monthlySummary });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /dashboard/recent-activity:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records to return (default 5)
 *     responses:
 *       200:
 *         description: Recent activity list
 *       401:
 *         description: Unauthorized
 */
router.get('/recent-activity', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const recentActivity = dashboardService.getRecentActivity(limit);
    res.json({ recentActivity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /dashboard/expense-breakdown:
 *   get:
 *     summary: Get expense breakdown by category
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Expense breakdown data
 *       401:
 *         description: Unauthorized
 */
router.get('/expense-breakdown', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const breakdown = dashboardService.getExpenseBreakdown();
    res.json({ expenseBreakdown: breakdown });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /dashboard/income-breakdown:
 *   get:
 *     summary: Get income breakdown by category
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Income breakdown data
 *       401:
 *         description: Unauthorized
 */
router.get('/income-breakdown', checkRole(['admin', 'analyst', 'master_admin', 'viewer']), (req, res) => {
  try {
    const breakdown = dashboardService.getIncomeBreakdown();
    res.json({ incomeBreakdown: breakdown });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;