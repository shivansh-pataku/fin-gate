const express = require('express');
const router = express.Router();

const checkRole = require('../middleware/auth');
const recordService = require('../services/recordServices');
const CAT = require('../config/categories'); 


/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500
 *               category:
 *                 type: string
 *                 enum: [LABOUR, RAW_MATERIAL, MAINTENANCE, PRODUCTION_COST, EXPOSURE_VISIT, PRODUCT_SALES, SERVICE_FEES, CONSULTING_FEES]
 *                 example: "LABOUR"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-06"
 *               note:
 *                 type: string
 *                 example: "Monthly wages"
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Permission denied
 */



// Create a new record
router.post('/', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category are required' });
    }

    const newRecord = recordService.createRecord(amount, category, date, note);
    res.status(201).json({ message: 'Record created successfully', record: newRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all financial records
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type (income/expense)
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *     responses:
 *       200:
 *         description: List of records
 *       403:
 *         description: Viewers cannot access this endpoint
 */
router.get('/', checkRole(['admin', 'master_admin', 'analyst']), (req, res) => {
  try {
    const { category, type, dateFrom, dateTo } = req.query;
    const filters = { category, type, dateFrom, dateTo };

    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
  // Obove code step by step explanation:
  // 1. Extract query parameters for filtering (category, type, dateFrom, dateTo).
  // 2. Create a filters object containing these parameters.
  // 3. Remove any filters that are undefined (not provided in the query) to avoid passing unnecessary parameters to the service layer.
  // 4. && operator is used if filters[key] is undefined, it will evaluate to true and the delete operation will be executed, removing that key from the filters object.

    if (req.loggingUser.role === 'analyst') {
      const records = recordService.getRecords(filters);
      return res.json(records);
    }

    // Admin and master_admin see active and deleted records
    const activeRecords = recordService.getRecords(filters);
    const deleted = recordService.getDeletedRecordsList();
    
    res.json({
      activeRecords,
      deletedRecords: deleted
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update a financial record
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Record ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 *       403:
 *         description: Forbidden
 */
router.put('/:id', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { amount, date, note } = req.body;

    const updatedRecord = recordService.updateRecord(id, { amount, date, note });
    res.json({ message: 'Record updated successfully', record: updatedRecord });
  } catch (error) {
    if (error.message === 'Record not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Soft delete a record (mark as deleted, not permanently removed)
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedRecord = recordService.deleteRecord(id);
    res.json({ message: 'Record deleted successfully', record: deletedRecord });
  } catch (error) {
    if (error.message === 'Record not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /records/{id}/restore:
 *   put:
 *     summary: Restore a soft-deleted record
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record restored successfully
 *       404:
 *         description: Record not found
 *       403:
 *         description: Forbidden
 */
router.put('/:id/restore', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const restoredRecord = recordService.restoreRecord(id);
    res.json({ message: 'Record restored successfully', record: restoredRecord });
  } catch (error) {
    if (error.message === 'Record not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /records/{id}/purge:
 *   delete:
 *     summary: Permanently delete a record (cannot be restored)
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record purged successfully
 *       404:
 *         description: Record not found
 *       403:
 *         description: Forbidden
 */
router.delete('/:id/purge', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    recordService.purgeRecord(id);
    res.json({ message: 'Record purged successfully' });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;