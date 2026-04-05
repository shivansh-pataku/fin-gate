const { users, userRoles } = require('../data/mockData');

// Get next user ID based on timestamp
const getNewUserId = () => Date.now();

// Create a new user (admin/master_admin only)
const createUser = (username, name, role, password) => {
  // Validate inputs
  if (!username || !name || !role || !password) {
    throw new Error('Username, Name, Role, and Password are required');
  }

  // Normalize inputs
  role = role.toLowerCase().trim(); 
  username = username.toLowerCase().trim();
  name = name.trim();

  // Check if username already exists
  if (users.find(u => u.username === username)) {
    throw new Error('Username already exists');
  }

  // Validate role
  if (!userRoles.includes(role)) {
    throw new Error('Invalid role. Must be: admin, analyst, or viewer');
  }

  const newUser = {
    id: getNewUserId(),
    username,
    name,
    role,
    password, // Note: In production, should be hashed
    status: 'active'
  };

  users.push(newUser);
  return newUser;
};

// Approve/Disapprove a user (toggle status)
const toggleUserStatus = (userId, requestingUser) => {
  const candidate = users.find(u => u.id === userId);
  if (!candidate) throw new Error('User not found');

  // Only master_admin can approve admin users
  if (candidate.role === 'admin' && requestingUser.role !== 'master_admin') {
    throw new Error('Only master admin can approve admin users');
  }

  // Toggle user status
  candidate.status = candidate.status === 'active' ? 'inactive' : 'active';
  return candidate;
};

// Get all users (with role-based filtering)
const getUsers = (requestingUser) => {
  if (requestingUser.role === 'admin') {
    // Admins can only see non-admin users
    return users.filter(u => u.role !== 'admin' && u.role !== 'master_admin');
  }
  // Master admin sees all users
  return users;
};

// Get a specific user by ID
const getUserById = (userId) => {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');
  return user;
};

// Get users by role
const getUsersByRole = (role) => {
  return users.filter(u => u.role === role);
};

// Get active users
const getActiveUsers = () => {
  return users.filter(u => u.status === 'active');
};

// Get inactive users
const getInactiveUsers = () => {
  return users.filter(u => u.status === 'inactive');
};

// Get total user count
const getUserCount = () => users.length;

// Get recent users
const getRecentUsers = (limit = 5) => {
  return users.slice(-limit);
};

module.exports = {
  createUser,
  toggleUserStatus,
  getUsers,
  getUserById,
  getUsersByRole,
  getActiveUsers,
  getInactiveUsers,
  getUserCount,
  getRecentUsers
};