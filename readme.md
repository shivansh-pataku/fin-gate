<div align="center">

# Finance Data Processing and Access Control Backend

A lightweight Node.js/Express-based API for managing financial records and user accounts with role-based access control.

</div>

## Features

- **User Management**: Register users with different roles (viewer, analyst, admin, master_admin)
- **Role-Based Access Control**: Restrict endpoints based on user roles
- **Record Management**: Create, read, update, and soft-delete financial records
- **Soft Delete**: Permanently delete, restore, and purge deleted records
- **Financial Dashboard**: Get analytics, trends, and category breakdowns
- **User Approval Workflow**: Admin approval required before users can access records

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone or download the project
2. Install dependencies (including Express):
```bash
npm install
```

This will install all required packages including Express v5.2.1

## Running the Server

```bash
node index.js
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

All endpoints (except the home route) require HTTP Basic Authentication via headers:
```
username: <username>
password: <password>
```

---

## User Management Endpoints

### POST /users
Register a new user (admin or master_admin only)

**Request Body:**
```json
{
  "username": "newuser",
  "name": "John Doe",
  "role": "viewer",
  "password": "secure123"
}
```

Valid roles: `viewer`, `analyst`, `admin`

### PUT /users/:id/approve
Toggle user approval status (admin or master_admin only)

**Example:** `PUT /users/11/approve`

**Note:** Admin users can only be approved by master_admin

### GET /users
Get all users (admin or master_admin only)

---

## Record Management Endpoints

### POST /records
Create a new financial record (admin or master_admin only)

**Request Body:**
```json
{
  "amount": 1500,
  "category": "LABOUR",
  "date": "2026-04-05",
  "note": "Monthly wages"
}
```

**Valid Categories:**
- **Expense**: LABOUR, RAW_MATERIAL, MAINTENANCE, PRODUCTION_COST, EXPOSURE_VISIT
- **Income**: PRODUCT_SALES, SERVICE_FEES, CONSULTING_FEES

### GET /records
Get all financial records

- **Viewers/Analysts**: See active records only
- **Admins/Master Admins**: See both active and deleted records

### PUT /records/:id
Update a record by ID (admin or master_admin only)

**Example:** `PUT /records/1`

### DELETE /records/:id
Soft delete a record (admin or master_admin only)

**Example:** `DELETE /records/5`

### PUT /records/:id/restore
Restore a soft-deleted record (admin or master_admin only)

**Example:** `PUT /records/5/restore`

### DELETE /records/:id/purge
Permanently delete a soft-deleted record (admin or master_admin only)

**Example:** `DELETE /records/5/purge`

---

## Dashboard & Analytics Endpoints

### GET /dashboard/summary
Get complete financial summary and analytics

**Available for:** Admin, Analyst, Master Admin, Viewer

**Returns:**
- Financial totals (income, expenses, balance)
- Category-wise breakdown
- Recent activity
- Monthly trends (admin/master_admin only)
- User stats (admin/master_admin only)

### GET /dashboard/totals
Get financial totals (income, expenses, net balance)

**Available for:** All roles

### GET /dashboard/categories
Get category-wise breakdown

**Available for:** All roles

### GET /dashboard/monthly
Get monthly financial summary and trends

**Available for:** All roles

### GET /dashboard/recent-activity
Get recent records

**Available for:** All roles

**Query Parameters:**
- `limit` - Number of recent records to return (default: 5)

### GET /dashboard/expense-breakdown
Get expense breakdown by category

**Available for:** All roles

### GET /dashboard/income-breakdown
Get income breakdown by category

**Available for:** All roles

---

## User Roles & Permissions

| Role | Create Records | Update Records | Delete Records | View Records | Manage Users | Access Dashboard | View Deleted |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Viewer** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Analyst** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Master Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Default Test Credentials

### Master Admin
```
Username: master
Password: master
```

### Viewers
```
Username: viewer1, viewer2, viewer3
Password: 1234
Status: active, active, inactive
```

### Analysts
```
Username: analyst1, analyst2, analyst3
Password: 1234
Status: active, active, inactive
```

### Admins
```
Username: admin1, admin2, admin3
Password: 1234
Status: active, active, inactive
```

---

## Example Usage with cURL

### Register a new user
```bash
curl -X POST http://localhost:3000/users \
  -H "username: master" \
  -H "password: master" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "name": "New User",
    "role": "viewer",
    "password": "pass123"
  }'
```

### Create a record (admin only)
```bash
curl -X POST http://localhost:3000/records \
  -H "username: admin2" \
  -H "password: 1234" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2000,
    "category": "RAW_MATERIAL",
    "date": "2026-04-05",
    "note": "Bulk material purchase"
  }'
```

### Get all records
```bash
curl -X GET http://localhost:3000/records \
  -H "username: viewer1" \
  -H "password: 1234"
```

### View dashboard summary (all roles)
```bash
curl -X GET http://localhost:3000/dashboard/summary \
  -H "username: viewer1" \
  -H "password: 1234"
```

### Get financial totals
```bash
curl -X GET http://localhost:3000/dashboard/totals \
  -H "username: analyst1" \
  -H "password: 1234"
```

### Get category breakdown
```bash
curl -X GET http://localhost:3000/dashboard/categories \
  -H "username: viewer2" \
  -H "password: 1234"
```

### Update a record (admin only)
```bash
curl -X PUT http://localhost:3000/records/1 \
  -H "username: admin2" \
  -H "password: 1234" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1200,
    "note": "Updated entry"
  }'
```

### Delete a record (admin only)
```bash
curl -X DELETE http://localhost:3000/records/1 \
  -H "username: admin2" \
  -H "password: 1234"
```

### Restore a deleted record (admin only)
```bash
curl -X PUT http://localhost:3000/records/1/restore \
  -H "username: admin2" \
  -H "password: 1234"
```

### Get recent activity
```bash
curl -X GET "http://localhost:3000/dashboard/recent-activity?limit=10" \
  -H "username: analyst1" \
  -H "password: 1234"
```

---

## Response Format

All responses follow a standardized format for better readability:

```json
{
  "status": "success",
  "message": "Description of what was returned",
  "data": {
    "financialSummary": {
      "totalIncome": 80500,
      "totalExpenses": 11150,
      "netBalance": 69350
    },
    "records": {
      "activeCount": 8,
      "deletedCount": 0
    },
    "categories": {...}
  },
  "timestamp": "2026-04-05T12:34:56.789Z"
}
```

---

## Error Responses

### 400 Bad Request
Missing required fields or invalid input

### 401 Unauthorized
Invalid username or password

### 403 Forbidden
- User lacks permission for this action
- User status is inactive (pending approval)
- Only master_admin can approve admin users

### 404 Not Found
Resource (user or record) not found

---

## Key Features

### Role-Based Access Control (RBAC)
- 4 distinct user roles with different permission levels
- Admins can only manage non-admin users
- Only master_admin can approve admin users
- Inactive users cannot access any resources

### Record Management
- **Create**: Admin and Master Admin only
- **Read**: All authenticated users (with filtering based on role)
- **Update**: Admin and Master Admin only
- **Delete**: Soft delete with permanent purge option
- **Restore**: Recover soft-deleted records

### Financial Analytics
- Total income and expense calculation
- Net balance computation
- Category-wise financial breakdown
- Monthly trend analysis
- Expense and income breakdowns
- Recent activity tracking

### Soft Delete Functionality
1. Soft delete marks record as deleted but preserves data
2. Deleted records hidden from viewers and analysts
3. Admins can see both active and deleted records
4. Soft-deleted records can be restored
5. Permanently purged records are removed from database

---

## Project Structure

```
finance-backend/
├── index.js                      # Main server entry point
├── package.json                  # Project dependencies
├── readme.md                     # This file
├── config/
│   └── categories.js             # Category definitions
├── data/
│   └── mockData.js               # Mock records and users
├── middleware/
│   └── auth.js                   # Authentication & RBAC
├── routes/
│   ├── records.js                # Record endpoints
│   ├── users.js                  # User endpoints
│   └── dashboard.js              # Dashboard endpoints
└── services/
    ├── recordServices.js         # Record business logic
    ├── user.services.js          # User management logic
    └── dashboardServices.js      # Analytics logic
```

---

## Technologies Used

- **Express.js** (v5.2.1) - Web framework [Required]
- **Node.js** - Runtime environment
- **JavaScript** - Programming language

---

## Important Notes

- Passwords are stored in plain text for demonstration. Use bcrypt in production
- Authentication uses HTTP headers for simplicity. Use JWT in production
- Data is stored in memory (in-memory arrays). Use a real database in production
- All dates use YYYY-MM-DD format
- Timestamps use ISO 8601 format
- Record type (income/expense) is auto-assigned based on category

---

## Workflow Examples

### Example 1: Creating and Managing Records
1. Admin logs in with `admin2/1234`
2. Admin creates a record via `POST /records`
3. Viewer logs in and views records via `GET /records`
4. Admin updates the record via `PUT /records/:id`
5. Admin deletes via `DELETE /records/:id`
6. Admin restores via `PUT /records/:id/restore`

### Example 2: User Registration and Approval
1. Admin registers new user via `POST /users`
2. New user created with `status: active`
3. User logs in and accesses records/dashboard
4. Admin can toggle user status via `PUT /users/:id/approve`

### Example 3: Dashboard Access
1. Any authenticated user can access dashboard
2. Viewers see: totals, categories, recent activity
3. Analysts see: same as viewers
4. Admins see: everything + monthly trends + user stats

---

**Built for learning and demonstration purposes.** ✨
