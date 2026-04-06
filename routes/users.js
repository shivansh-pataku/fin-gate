const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/auth');
const userService = require('../services/user.services');


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - name
 *               - role
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               role:
 *                 type: string
 *                 enum: [viewer, analyst, admin]
 *                 example: "viewer"
 *               password:
 *                 type: string
 *                 example: "pass123"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Permission denied
 */



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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const users = userService.getUsers(req.loggingUser);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /users/{id}/approve:
 *   put:
 *     summary: Toggle user approval status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status updated
 *       404:
 *         description: User not found
 *       403:
 *         description: Cannot approve admin users (only master_admin can)
 */
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

/**
 * @swagger
 * /users/role/{role}:
 *   get:
 *     summary: Get users filtered by role
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [viewer, analyst, admin, master_admin]
 *         description: User role
 *     responses:
 *       200:
 *         description: List of users with specified role
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Forbidden
 */
router.get('/role/:role', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const role = req.params.role.toLowerCase();
    const users = userService.getUsersByRole(role);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/status/active:
 *   get:
 *     summary: Get all active (approved) users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of active users
 *       403:
 *         description: Forbidden
 */
router.get('/status/active', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const activeUsers = userService.getActiveUsers();
    res.json(activeUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /users/status/inactive:
 *   get:
 *     summary: Get all inactive (pending approval) users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of inactive users
 *       403:
 *         description: Forbidden
 */
router.get('/status/inactive', checkRole(['admin', 'master_admin']), (req, res) => {
  try {
    const inactiveUsers = userService.getInactiveUsers();
    res.json(inactiveUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;