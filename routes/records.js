const express = require('express');
const router = express.Router();

const checkRole = require('../middleware/auth');
const recordService = require('../services/recordServices');
const CAT = require('../config/categories'); 

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

// Get all records with optional filtering
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

// Update a record by ID
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

// Soft delete a record (mark as deleted)
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

// Restore a deleted record
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

// Permanently delete a record (purge)
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