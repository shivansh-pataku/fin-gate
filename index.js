const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Swagger setup for API documentation
const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



//fUNCTIONALITY IMPORTS
// Importing Routes for records, users, and dashboard, to utilize the functionality defined in those route files
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');
const dashboardRoutes = require('./routes/dashboard');
//above imports the route handlers for respective purposes and will be stored in the respective variables to be used in the app.
//use() method below to define the base routes for each functionality



//INITIALIZATION OF ROUTES
// API Routes for records, users, and dashboard; to handle requests related to financial records, user management, and dashboard analytics
app.use('/records', recordRoutes); 
app.use('/users', userRoutes);
app.use('/dashboard', dashboardRoutes);
//the above routes are listened by the express app
//if the request starts with any of above routes then it will be handled by the respective route files and the functionality defined for specific routes defined in them







// Home route with Uage Instructions
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Finance Management System API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          h2 { color: #5e4f4f; }

        </style>
      </head>
      <body>
        <h1>Finance Data Processing and Access Control</h1>
        <p>A backend system for managing financial records with role-based access control.</p>

        <h2>🔐 Authentication</h2>
        <p>All endpoints require authentication via headers:</p>
        <ul>
          <li>username (header) - Login username</li>
          <li>password (header) - Login password</li>
        </ul>
        <p><strong>Test Credentials:</strong> username: <code>admin2</code>, password: <code>1234</code></p>

        <h2>↗️ Record Management Endpoints</h2>
        <div><strong>POST /records</strong> - Create a new record (analyst, admin, master_admin)</div>
        <div><strong>GET /records</strong> - Get all records with optional filtering (all authorized users)</div>
        <ul>Query params: <code>category</code>, <code>type</code>, <code>dateFrom</code>, <code>dateTo</code></ul>
        <div><strong>PUT /records/:id</strong> - Update a record (analyst, admin, master_admin)</div>
        <div><strong>DELETE /records/:id</strong> - Soft delete a record (admin, master_admin)</div>
        <div><strong>PUT /records/:id/restore</strong> - Restore deleted record (admin, master_admin)</div>
        <div><strong>DELETE /records/:id/purge</strong> - Permanently delete record (admin, master_admin)</div>

        <h2>↗️ User Management Endpoints</h2>
        <div><strong>POST /users</strong> - Create new user (admin, master_admin)</div>
        <div><strong>GET /users</strong> - Get all users (admin, master_admin)</div>
        <div><strong>GET /users/:id</strong> - Get specific user (admin, master_admin)</div>
        <div><strong>PUT /users/:id/approve</strong> - Toggle user status (admin, master_admin)</div>
        <div><strong>GET /users/role/:role</strong> - Get users by role (admin, master_admin)</div>
        <div><strong>GET /users/status/active</strong> - Get active users (admin, master_admin)</div>
        <div><strong>GET /users/status/inactive</strong> - Get inactive users (admin, master_admin)</div>

        <h2>↗️ Dashboard & Analytics Endpoints</h2>
        <div><strong>GET /dashboard/summary</strong> - Get complete dashboard summary (admin, analyst, master_admin)</div>
        <div><strong>GET /dashboard/totals</strong> - Get income, expenses, net balance (admin, analyst, master_admin)</div>
        <div><strong>GET /dashboard/categories</strong> - Get category-wise totals (admin, analyst, master_admin)</div>
        <div><strong>GET /dashboard/monthly</strong> - Get monthly trends (admin, analyst, master_admin)</div>
        <div><strong>GET /dashboard/recent-activity</strong> - Get recent records (admin, analyst, master_admin)</div>
        <div><strong>GET /dashboard/expense-breakdown</strong> - Get expense breakdown by category (admin, analyst, master_admin)</div>
        <div><strong>GET /dashboard/income-breakdown</strong> - Get income breakdown by category (admin, analyst, master_admin)</div>

        <h2>👤 Role-Based Access</h2>
        <ul>
          <li><strong>Viewer:</strong> View records and dashboard data (read-only)</li>
          <li><strong>Analyst:</strong> View records, dashboard data, and access analytics</li>
          <li><strong>Admin:</strong> Full access to records, users, and analytics</li>
          <li><strong>Master Admin:</strong> Complete system access (cannot be modified)</li>
        </ul>

        <h2>🪶Features</h2>
        <ul>
          <li>User & role management with approval workflow</li>
          <li>Financial record CRUD with soft delete</li>
          <li>Record filtering by category, type, and date range</li>
          <li>Dashboard with income/expense summaries</li>
          <li>Monthly trends and analytics</li>
          <li>Category-wise expense & income breakdown</li>
          <li>Role-based access control</li>
          <li>Audit trail with soft deletes and restore</li>
        </ul>
      </body>
    </html>
  `);
});






// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
});
