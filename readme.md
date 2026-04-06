<div align="center">

# 💰 Finance Data Processing and Access Control Backend

A lightweight Node.js/Express-based API for managing financial records and user accounts with role-based access control.

</div>

---

## ✨ Features

- **👥 User Management**: Register users with different roles (viewer, analyst, admin, master_admin)
- **🔐 Role-Based Access Control**: Restrict endpoints based on user roles
- **📊 Record Management**: Create, read, update, and soft-delete financial records
- **🗑️ Soft Delete**: Permanently delete, restore, and purge deleted records
- **📈 Financial Dashboard**: Get analytics, trends, and category breakdowns
- **✅ User Approval Workflow**: Admin approval required before users can access records

---

## 📋 Prerequisites

- **Node.js** v14 or higher
- **npm** (Node Package Manager)
- Basic understanding of REST APIs
- A tool to make HTTP requests (cURL, Postman, or similar)

---

## 🚀 Installation & Setup

### Installation

1. Clone or download the project
2. Install dependencies (including Express and Swagger):
```bash
npm install
```

This will install all required packages including Express v5.2.1, swagger-jsdoc, and swagger-ui-express

### Running the Server

```bash
node index.js
```

The server will start on `http://localhost:3000`

### Access API Documentation

- **📚 Interactive Swagger UI**: `http://localhost:3000/api-docs` ⭐ (Recommended)
  - Test all 21 endpoints directly in your browser
  - Interactive request/response testing
  - Built-in HTTP Basic Authentication
  - See live examples and schema validation

- **📖 Homepage Documentation**: `http://localhost:3000/`
  - Quick reference guide

### Verify Installation

```bash
# Test the API
curl http://localhost:3000/

# You should see the API documentation homepage
```

---

## 🛠️ Using Swagger UI

### Step 1: Open Swagger UI
```
http://localhost:3000/api-docs
```

### Step 2: Authorize (Click "Authorize" Button)
Add your credentials:
- **Username:** `admin2`
- **Password:** `1234`

Or use any of these test accounts:
- Viewer: `viewer1` / `1234`
- Analyst: `analyst1` / `1234`
- Master Admin: `master` / `master`

### Step 3: Test Endpoints
1. Click on any endpoint (Users, Records, Dashboard)
2. Click **"Try it out"**
3. Fill in any required parameters
4. Click **"Execute"**
5. See the response below

### Alternative: Manual Header Authorization
If Authorize doesn't work, add this header manually:
```
Authorization: Basic YWRtaW4yOjEyMzQ=
```
(This is base64 encoded: admin2:1234)

---

## 📡 API Documentation

### 📚 Swagger UI (Interactive API Reference)

The API comes with **interactive Swagger UI documentation** that allows you to:
- ✅ View all 21 endpoints organized by category (Users, Records, Dashboard)
- ✅ Test endpoints directly in your browser
- ✅ See request/response schemas
- ✅ Try different authentication credentials
- ✅ View live code examples (cURL, Python, JavaScript, etc.)

**Access it at:** `http://localhost:3000/api-docs`

### Base URL
```
http://localhost:3000
```

### 🔐 Authentication

All endpoints (except the home route and Swagger docs) require HTTP Basic Authentication via headers:
```
username: <username>
password: <password>
```

Supported authentication methods:
1. **Swagger UI Authorization** - Click "Authorize" button and enter credentials
2. **HTTP Basic Auth Header** - `Authorization: Basic <base64(username:password)>`
3. **Custom Headers** - `username` and `password` headers

---

## 📋 Complete API Endpoints Overview

**Total Endpoints: 21** (All tested and documented in Swagger UI)

### 👤 User Management (7 endpoints)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/users` | Register new user | admin, master_admin |
| GET | `/users` | Get all users | admin, master_admin |
| GET | `/users/:id` | Get specific user | admin, master_admin |
| PUT | `/users/:id/approve` | Toggle user status | admin, master_admin |
| GET | `/users/role/:role` | Filter users by role | admin, master_admin |
| GET | `/users/status/active` | Get active users | admin, master_admin |
| GET | `/users/status/inactive` | Get inactive users | admin, master_admin |

### 📝 Record Management (7 endpoints)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/records` | Create record | admin, master_admin |
| GET | `/records` | Get all records | analyst, admin, master_admin |
| PUT | `/records/:id` | Update record | admin, master_admin |
| DELETE | `/records/:id` | Soft delete record | admin, master_admin |
| PUT | `/records/:id/restore` | Restore deleted record | admin, master_admin |
| DELETE | `/records/:id/purge` | Permanently delete | admin, master_admin |

### 📊 Dashboard & Analytics (7 endpoints)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard/summary` | Complete summary | All roles |
| GET | `/dashboard/totals` | Income/expense totals | All roles |
| GET | `/dashboard/categories` | Category breakdown | All roles |
| GET | `/dashboard/monthly` | Monthly trends | All roles |
| GET | `/dashboard/recent-activity` | Recent transactions | All roles |
| GET | `/dashboard/expense-breakdown` | Expense by category | All roles |
| GET | `/dashboard/income-breakdown` | Income by category | All roles |

**👉 View all endpoints with examples in Swagger UI** at `http://localhost:3000/api-docs`

---

## 👤 User Management Endpoints

#### POST /users
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

---

#### PUT /users/:id/approve
Toggle user approval status (admin or master_admin only)

**Example:** `PUT /users/11/approve`

**Note:** Admin users can only be approved by master_admin

---

#### GET /users
Get all users (admin or master_admin only)

---

## 📝 Record Management Endpoints

#### POST /records
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

---

#### GET /records
Get all financial records (**analyst, admin, master_admin only**)

**Important**: Viewers **CANNOT** access individual records via this endpoint. They can only view aggregated data through the Dashboard endpoints.

- **Analysts/Admins/Master Admins**: See active records (Admins/Master Admins also see deleted records)

---

#### PUT /records/:id
Update a record by ID (admin or master_admin only)

**Example:** `PUT /records/1`

---

#### DELETE /records/:id
Soft delete a record (admin or master_admin only)

**Example:** `DELETE /records/5`

---

#### PUT /records/:id/restore
Restore a soft-deleted record (admin or master_admin only)

**Example:** `PUT /records/5/restore`

---

#### DELETE /records/:id/purge
Permanently delete a soft-deleted record (admin or master_admin only)

**Example:** `DELETE /records/5/purge`

---

## 📊 Dashboard & Analytics Endpoints

#### GET /dashboard/summary
Get complete financial summary and analytics

**Available for:** All authenticated users (viewer, analyst, admin, master_admin)

**Returns:**
- Financial totals (income, expenses, balance)
- Category-wise breakdown
- Recent activity
- Monthly trends (admin/master_admin only)
- User stats (admin/master_admin only)

**Note**: This is the primary endpoint for viewers to access financial data and analytics.

---

#### GET /dashboard/totals
Get financial totals (income, expenses, net balance)

**Available for:** All authenticated users

---

#### GET /dashboard/categories
Get category-wise breakdown

**Available for:** All authenticated users

---

#### GET /dashboard/monthly
Get monthly financial summary and trends

**Available for:** All authenticated users

---

#### GET /dashboard/recent-activity
Get recent records

**Available for:** All authenticated users

**Query Parameters:**
- `limit` - Number of recent records to return (default: 5)

---

#### GET /dashboard/expense-breakdown
Get expense breakdown by category

**Available for:** All authenticated users

---

#### GET /dashboard/income-breakdown
Get income breakdown by category

**Available for:** All authenticated users

---

## 🔑 User Roles & Permissions

| Feature | Viewer | Analyst | Admin | Master Admin |
|---------|:------:|:-------:|:-----:|:------------:|
| **Create Records** | ❌ | ❌ | ✅ | ✅ |
| **View Records** (GET /records) | ❌ | ✅ | ✅ | ✅ |
| **Update Records** | ❌ | ❌ | ✅ | ✅ |
| **Delete Records** (Soft/Purge) | ❌ | ❌ | ✅ | ✅ |
| **View Deleted Records** | ❌ | ❌ | ✅ | ✅ |
| **Manage Users** | ❌ | ❌ | ✅ | ✅ |
| **Access Dashboard** | ✅ | ✅ | ✅ | ✅ |

---

### 📌 Important Permission Notes

- **Viewers** 👁️: Can access dashboard analytics and reports, but **CANNOT** access the individual records list
- **Analysts** 📊: Can view individual records but **CANNOT** create, update, or delete them
- **Admins** ⚙️: Can manage records and users (except cannot approve other admins)
- **Master Admin** 👑: Full unrestricted access to all features

---

## 🔐 Test Credentials

### Master Admin 👑
```
Username: master
Password: master
```

### Viewers 👁️
```
Username: viewer1, viewer2, viewer3
Password: 1234
Status: active, active, inactive
```

### Analysts 📊
```
Username: analyst1, analyst2, analyst3
Password: 1234
Status: active, active, inactive
```

### Admins ⚙️
```
Username: admin1, admin2, admin3
Password: 1234
Status: active, active, inactive
```

---

## 💻 Example Usage with cURL

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

---

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

---

### Get all records (analyst/admin only)
```bash
curl -X GET http://localhost:3000/records \
  -H "username: analyst1" \
  -H "password: 1234"
```

---

### View dashboard summary (all roles - recommended for viewers)
```bash
curl -X GET http://localhost:3000/dashboard/summary \
  -H "username: viewer1" \
  -H "password: 1234"
```

**Note**: Viewers cannot access GET /records endpoint, but can access all /dashboard/* endpoints for analytics.

---

### Get financial totals
```bash
curl -X GET http://localhost:3000/dashboard/totals \
  -H "username: analyst1" \
  -H "password: 1234"
```

---

### Get category breakdown
```bash
curl -X GET http://localhost:3000/dashboard/categories \
  -H "username: viewer2" \
  -H "password: 1234"
```

---

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

---

### Delete a record (admin only)
```bash
curl -X DELETE http://localhost:3000/records/1 \
  -H "username: admin2" \
  -H "password: 1234"
```

---

### Restore a deleted record (admin only)
```bash
curl -X PUT http://localhost:3000/records/1/restore \
  -H "username: admin2" \
  -H "password: 1234"
```

---

### Get recent activity
```bash
curl -X GET "http://localhost:3000/dashboard/recent-activity?limit=10" \
  -H "username: analyst1" \
  -H "password: 1234"
```

---

## ⚠️ Error Responses

### 🔴 400 Bad Request
Missing required fields or invalid input

**Scenarios:**
- Missing required fields in request body
- Invalid data format or type
- Invalid category for records

---

### 🔴 401 Unauthorized
Invalid username or password

**Scenarios:**
- Username does not exist
- Incorrect password
- Missing authentication headers

---

### 🔴 403 Forbidden
User lacks permission or account inactive

**Scenarios:**
- User lacks permission for this action
- User status is inactive (pending approval)
- Only master_admin can approve admin users
- Viewers/Analysts cannot create or update records

---

### 🔴 404 Not Found
Resource not found in the system

**Scenarios:**
- User ID does not exist
- Record ID does not exist
- Attempting to restore non-existent or active record

---

## 🎯 Key Features

### 🔐 Role-Based Access Control (RBAC)
- 4 distinct user roles with different permission levels
- Admins can only manage non-admin users
- Only master_admin can approve admin users
- Inactive users cannot access any resources

### 📝 Record Management
- **Create**: Admin and Master Admin only
- **Read**: All authenticated users (with filtering based on role)
- **Update**: Admin and Master Admin only
- **Delete**: Soft delete with permanent purge option
- **Restore**: Recover soft-deleted records

### 📈 Financial Analytics
- Total income and expense calculation
- Net balance computation
- Category-wise financial breakdown
- Monthly trend analysis
- Expense and income breakdowns
- Recent activity tracking

### 🗑️ Soft Delete Functionality
1. Soft delete marks record as deleted but preserves data
2. Deleted records hidden from viewers and analysts
3. Admins can see both active and deleted records
4. Soft-deleted records can be restored
5. Permanently purged records are removed from database

---

## 📁 Project Structure

```
finance-backend/
├── index.js                      # Main server entry point
├── package.json                  # Project dependencies
├── readme.md                     # Documentation
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

## 🛠️ Technologies Used

- **Express.js** (v5.2.1) - Web framework [Required]
- **Node.js** - Runtime environment
- **JavaScript** - Programming language

---

## 📚 Workflow Examples

### 1️⃣ Creating and Managing Records

```
Admin logs in → Create record → Viewer views → Admin updates → Admin deletes → Admin restores
```

Step-by-step:
1. Admin logs in with `admin2/1234`
2. Admin creates a record via `POST /records`
3. Viewer logs in and views records via `GET /records`
4. Admin updates the record via `PUT /records/:id`
5. Admin deletes via `DELETE /records/:id`
6. Admin restores via `PUT /records/:id/restore`

---

### 2️⃣ User Registration and Approval

```
Register → Create User → User logs in → Can access records
```

Step-by-step:
1. Admin registers new user via `POST /users`
2. New user created with `status: active`
3. User logs in and accesses records/dashboard
4. Admin can toggle user status via `PUT /users/:id/approve`

---

### 3️⃣ Dashboard Access by Role

```
Any authenticated user → Access dashboard → View analytics
```

**What each role can do:**
- **Viewer** 👁️: 
  - ✅ Access all dashboard endpoints (/summary, /totals, /categories, /monthly, /recent-activity, etc.)
  - ❌ CANNOT view individual records via GET /records
  - ❌ CANNOT create/update/delete records
  - ❌ CANNOT manage users

- **Analyst** 📊: 
  - ✅ Access all dashboard endpoints
  - ✅ View individual records via GET /records
  - ❌ CANNOT create/update/delete records
  - ❌ CANNOT manage users

- **Admin** ⚙️:
  - ✅ Full access to records (create, view, update, delete, restore, purge)
  - ✅ Access all dashboard endpoints
  - ✅ Can manage users (register, approve)
  - ❌ CANNOT approve other admin users (only master_admin can)

- **Master Admin** 👑: 
  - ✅ Unrestricted access to everything
  - ✅ Can approve admin users

---

## 🎓 Learning Notes

- Passwords are stored in **plain text** for demonstration. Use bcrypt in production
- Authentication uses **HTTP headers** for simplicity. Use JWT in production
- Data is stored in **memory** (in-memory arrays). Use a real database in production
- All dates use **YYYY-MM-DD** format
- Timestamps use **ISO 8601** format
- Record type (income/expense) is **auto-assigned** based on category

---


