<div align="center">

# Finance Management System API

A lightweight Node.js/Express-based API for managing financial records and user accounts with role-based access control.

</div>

## Features

- **User Management**: Register users with different roles (viewer, analyst, admin, master_admin)
- **Role-Based Access Control**: Restrict endpoints based on user roles
- **Record Management**: Create, read, update, and soft-delete financial records
- **Soft Delete**: Permanently delete, restore, and purge deleted records
- **Financial Summary**: Get dashboard analytics with income, expenses, and category breakdowns
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
  "username": "analyst1",
  "name": "John Analyst",
  "role": "analyst",
  "password": "123456"
}
```

### PUT /users/:id/approve
Toggle user approval status (admin or master_admin only)

**Example:** `PUT /users/11/approve`

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

## Dashboard & Analytics

### GET /dashboard/summary
Get financial summary and analytics

**Available for:** Admin, Analyst, Master Admin

Returns:
- Total income and expenses
- Net balance
- Category-wise totals
- Recent records and deleted records
- User and record counts
- Recent users (admin/master_admin only)

---

## User Roles & Permissions

| Role | Create Records | Update Records | Delete Records | View Records | Manage Users | View Deleted |
|------|:--:|:--:|:--:|:--:|:--:|:--:|
| **Viewer** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Analyst** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Master Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

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
```

### Analysts
```
Username: analyst1, analyst2, analyst3
Password: 1234
```

### Admins
```
Username: admin1, admin2, admin3
Password: 1234
```

---

## Example Usage with cURL

### Register a new user
```bash
curl -X POST http://localhost:3000/users \
  -H "Username: master" \
  -H "Password: master" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newanalyst",
    "name": "New Analyst",
    "role": "analyst",
    "password": "pass123"
  }'
```

### Create a record
```bash
curl -X POST http://localhost:3000/records \
  -H "Username: admin2" \
  -H "Password: 1234" \
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
  -H "Username: viewer1" \
  -H "Password: 1234"
```

### Get dashboard summary
```bash
curl -X GET http://localhost:3000/dashboard/summary \
  -H "Username: analyst1" \
  -H "Password: 1234"
```

### Update a record
```bash
curl -X PUT http://localhost:3000/records/1 \
  -H "Username: admin2" \
  -H "Password: 1234" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1200,
    "note": "Updated wage entry"
  }'
```

### Delete a record
```bash
curl -X DELETE http://localhost:3000/records/1 \
  -H "Username: admin2" \
  -H "Password: 1234"
```

### Restore a deleted record
```bash
curl -X PUT http://localhost:3000/records/1/restore \
  -H "Username: admin2" \
  -H "Password: 1234"
```

---

## Error Responses

### 400 Bad Request
Missing required fields or invalid input

### 401 Unauthorized
Invalid username or password

### 403 Forbidden
User lacks permission for this action or user status is inactive

### 404 Not Found
Resource (user or record) not found

---

## Notes

- Passwords are stored in plain text for demonstration purposes. In production, use bcrypt or similar hashing
- Authentication uses HTTP headers instead of JWT for simplicity
- Soft deletes preserve data history allowing for recovery
- Record types (income/expense) are derived automatically from the category selected
- All timestamps use ISO 8601 format
- Dates should be in YYYY-MM-DD format

## Project Structure

```
finance-backend/
├── index.js           # Main server with all routes and logic
├── package.json       # Dependencies
└── README.md          # This file
```

## Technologies Used

- **Express.js** (v5.2.1) - Web framework [Required]
- **Node.js** - Runtime environment
- **JavaScript** - Programming language

---


