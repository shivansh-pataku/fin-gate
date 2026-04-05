const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/auth');
const userService = require('../services/user.services');

// Create a new user (admin/master_admin only)
router.post('/', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const { username, name, role, password } = req.body;

    if (!username || !name || !role || !password) {
      return res.status(400).json({ error: 'Username, Name, Role, and Password are required' });
    }

    const newUser = userService.createUser(username, name, role, password);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users (with role-based filtering)
router.get('/', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const users = userService.getUsers(req.loggingUser);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific user by ID
router.get('/:id', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

// Toggle user status (approve/disapprove)
router.put('/:id/approve', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updatedUser = userService.toggleUserStatus(userId, req.loggingUser);
    res.json({ message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(403).json({ error: error.message });
  }
});

// Get users by role (admin/master_admin only)
router.get('/role/:role', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const role = req.params.role.toLowerCase();
    const users = userService.getUsersByRole(role);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get active users
router.get('/status/active', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const activeUsers = userService.getActiveUsers();
    res.json(activeUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get inactive users
router.get('/status/inactive', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const inactiveUsers = userService.getInactiveUsers();
    res.json(inactiveUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;