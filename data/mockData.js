const CAT = require('../config/categories');

// Mock data for financial records and users
const records = [
  { id: 1, amount: 850, type: "expense", category: CAT.E.LABOUR, date: "2026-04-01", note: "Daily wages for 2 workers,", isDeleted: false, deletedAt: null },
  { id: 2, amount: 3200, type: "expense", category: CAT.E.RAW_MATERIAL, date: "2026-04-01", note: "Cement and sand purchase", isDeleted: false, deletedAt: null },
  { id: 3, amount: 1200, type: "expense", category: CAT.E.MAINTENANCE, date: "2026-04-02", note: "Machine servicing and oil change", isDeleted: false, deletedAt: null },
  { id: 4, amount: 5400, type: "expense", category: CAT.E.PRODUCTION, date: "2026-04-03", note: "Electricity and production overhead", isDeleted: false, deletedAt: null },
  { id: 5, amount: 1500, type: "expense", category: CAT.E.TRAVEL, date: "2026-04-04", note: "Site visit transportation cost", isDeleted: false, deletedAt: null },
  { id: 6, amount: 68000, type: "income", category: CAT.I.SALES, date: "2026-04-03", note: "Bulk product sale to local distributor", isDeleted: false, deletedAt: null },
  { id: 7, amount: 4500, type: "income", category: CAT.I.SERVICE, date: "2026-04-04", note: "Installation and service charges", isDeleted: false, deletedAt: null },
  { id: 8, amount: 8000, type: "income", category: CAT.I.CONSULTING, date: "2026-04-05", note: "Process optimization consulting fee", isDeleted: false, deletedAt: null }
]; // functional records only for testing purposes

// Mock data for users
const users = [
    { id: 0,username:'master', name:'master', password: 'master', role: 'master_admin', status: 'active'},
    {"id":1,"username":"viewer1","name":"viewer","role":"viewer","password":"1234","status":"inactive"},
    {"id":2,"username":"viewer2","name":"viewer","role":"viewer","password":"1234","status":"active"},
    {"id":3,"username":"viewer3","name":"viewer","role":"viewer","password":"1234","status":"active"},
    {"id":4,"username":"admin1","name":"admin1","role":"admin","password":"1234","status":"inactive"},
    {"id":5,"username":"admin2","name":"admin2","role":"admin","password":"1234","status":"active"},
    {"id":6,"username":"admin3","name":"admin1","role":"admin","password":"1234","status":"active"},
    {"id":7,"username":"analyst1","name":"analyst1","role":"analyst","password":"1234","status":"inactive"},
    {"id":8,"username":"analyst2","name":"analyst2","role":"analyst","password":"1234","status":"active"},
    {"id":9,"username":"analyst3","name":"analyst3","role":"analyst","password":"1234","status":"active"},
    {"id":11,"username":"new1","name":"new1","role":"viewer","password":"1234","status":"inactive"},
    {"id":12,"username":"new11","name":"new11","role":"admin","password":"1234","status":"inactive"},
    {"id":13,"username":"new111","name":"new111","role":"analyst","password":"1234","status":"inactive"},
    {"id":14,"username":"new1111","name":"new1111","role":"analyst","password":"1234","status":"inactive"}
]; // functional users only for testing purposes

const userRoles = ['admin', 'analyst', 'viewer'];

module.exports = {
  records,
  users,
  userRoles
};