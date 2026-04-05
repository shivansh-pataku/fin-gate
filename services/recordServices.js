const CAT = require('../config/categories');
const { records } = require('../data/mockData');

// Helper functions
const getActiveRecords = () => records.filter(r => !r.isDeleted);
const getDeletedRecords = () => records.filter(r => r.isDeleted);
const getNextId = () => records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;

// Create a new record
const createRecord = (amount, category, date, note) => {
  // Validate category and set type automatically
  let type;
  if (Object.values(CAT.E).includes(category)) {
    type = 'expense';
  } else if (Object.values(CAT.I).includes(category)) {
    type = 'income';
  } else {
    throw new Error('Undefined category');
  }

  const newRecord = {
    id: getNextId(),
    amount,
    type,
    category,
    date: date || new Date().toISOString().split('T')[0],
    note: note || '',
    isDeleted: false,
    deletedAt: null
  };

  records.push(newRecord);
  return newRecord;
};

// Get all records (with optional filtering)
const getRecords = (filters = {}) => {
  let result = getActiveRecords();

  if (filters.category) {
    result = result.filter(r => r.category === filters.category);
  }
  if (filters.type) {
    result = result.filter(r => r.type === filters.type);
  }
  if (filters.dateFrom) {
    result = result.filter(r => r.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    result = result.filter(r => r.date <= filters.dateTo);
  }

  return result;
};

// Update a record by ID
const updateRecord = (id, updates) => {
  const record = records.find(r => r.id === id && !r.isDeleted);
  if (!record) throw new Error('Record not found');

  if (updates.amount !== undefined) record.amount = updates.amount;
  if (updates.date !== undefined) record.date = updates.date;
  if (updates.note !== undefined) record.note = updates.note;

  return record;
};

// Soft delete a record
const deleteRecord = (id) => {
  const record = records.find(r => r.id === id && !r.isDeleted);
  if (!record) throw new Error('Record not found');

  record.isDeleted = true;
  record.deletedAt = new Date().toISOString();
  
  return record;
};

// Restore a deleted record
const restoreRecord = (id) => {
  const record = records.find(r => r.id === id);
  if (!record) throw new Error('Record not found');
  if (!record.isDeleted) throw new Error('Record is not deleted');

  record.isDeleted = false;
  record.deletedAt = null;
  
  return record;
};

// Permanently delete a record (purge)
const purgeRecord = (id) => {
  const index = records.findIndex(r => r.id === id && r.isDeleted);
  if (index === -1) throw new Error('Record not found or not soft deleted');
  
  records.splice(index, 1);
};

// Get deleted records
const getDeletedRecordsList = () => getDeletedRecords();

// Get recently modified records
const getRecentRecords = (limit = 5) => getActiveRecords().slice(-limit); 

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  restoreRecord,
  purgeRecord,
  getActiveRecords,
  getDeletedRecords,
  getDeletedRecordsList,
  getRecentRecords
};