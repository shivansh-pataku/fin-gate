const express = require('express');
const app = express();

// middleware (important)
app.use(express.json());



// Categories and subcategories for records
const CAT = Object.freeze({
  E: { // expense categories
    LABOUR: "LABOUR",
    RAW_MATERIAL: "RAW_MATERIAL",
    MAINTENANCE: "MAINTENANCE",
    PRODUCTION: "PRODUCTION_COST",
    TRAVEL: "EXPOSURE_VISIT"
  },
  I: { // income categories
    SALES: "PRODUCT_SALES",
    SERVICE: "SERVICE_FEES",
    CONSULTING: "CONSULTING_FEES"
  }
});

// Initialize records storage array CAT.E.LABOUR, CAT.E.RAW_MATERIAL, CAT.E.MAINTENANCE, CAT.E.PRODUCTION, CAT.E.TRAVEL, CAT.I.SALES, CAT.I.SERVICE, CAT.I.CONSULTING
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

// Initialize users storage array 

const users = [
    {"id": 0, "username": "master", "name": "Master Administrator", "role": "master_admin", "password": "master", "status": "active"},
    {"id": 1, "username": "viewer1", "name": "Priya Sharma", "role": "viewer", "password": "1234", "status": "active"},
    {"id": 2, "username": "viewer2", "name": "Arjun Kumar", "role": "viewer", "password": "1234", "status": "active"},
    {"id": 3, "username": "viewer3", "name": "Anjali Patel", "role": "viewer", "password": "1234", "status": "inactive"},
    {"id": 4, "username": "admin1", "name": "Vikram Singh", "role": "admin", "password": "1234", "status": "active"},
    {"id": 5, "username": "admin2", "name": "Neha Gupta", "role": "admin", "password": "1234", "status": "active"},
    {"id": 6, "username": "admin3", "name": "Roshan", "role": "admin", "password": "1234", "status": "inactive"},
    {"id": 7, "username": "analyst1", "name": "Sneha", "role": "analyst", "password": "1234", "status": "active"},
    {"id": 8, "username": "analyst2", "name": "Arun", "role": "analyst", "password": "1234", "status": "active"},
    {"id": 9, "username": "analyst3", "name": "Divya", "role": "analyst", "password": "1234", "status": "inactive"},
    {"id": 10, "username": "viewer_pending", "name": "Rajesh Verma", "role": "viewer", "password": "1234", "status": "inactive"},
    {"id": 11, "username": "analyst_pending", "name": "Meera", "role": "analyst", "password": "1234", "status": "inactive"}
]; // functional users for testing - includes both active and inactive (pending approval) users



const getActiveRecords = () => records.filter(r => !r.isDeleted);
const getDeletedRecords = () => records.filter(r => r.isDeleted);




const master_admins = [{ id:0,username:'master', name:'master', password: 'master', role: 'master_admin', status: 'active'},]; // pre-create master_admin user with all access, this user cannot be created by anyone else, only system admin can create this user, this user has all access to records and user management, can create other admins, analysts, and viewers; also inaccessible to any user except master admin even that for update/modification purpose only

//users.push(...master_admins); // add master admins to users array for authentication, so that master always available for authentication and can also not be viewed, deleted or modified in any way - ... three dots is used to spread the master_admins array into the users array


const userRoles = ['admin', 'analyst', 'viewer']; // define user roles; another role MASTER ADMIN is not allowed to be created by users, only by system admin, master admin has all access to records and user management, can create other admins, analysts, and viewers

// role middleware to check if user has required role to access certain routes
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const { username, password } = req.headers;

        if (!username || !password) {
            return res.status(400).send('Username and password headers are required');
        }

        // Check if user exists with correct credentials
        const loggingUser = users.find(u => u.username === username && u.password === password); // find the user in the users array with matching username and password from the request headers, this is a simple authentication mechanism for demonstration purposes, in a real application we would use a more secure method of authentication such as JWT or sessions
        if (!loggingUser) {
            return res.status(401).send('Invalid username or password');
        }

        // Check if user is active
        if (loggingUser.status === 'inactive') {
            return res.status(403).send('User has not been approved yet. Please contact admin.');
        }

        // Check if user's role has permission for this endpoint
        if (!allowedRoles.includes(loggingUser.role)) {
            return res.status(403).send('Access denied - insufficient permissions for this action');
        }

        // Attach the logging user to the request object so it can be accessed in route handlers
        req.loggingUser = loggingUser;

        next(); // move to actual route
    };
};

////////////////////////////////////////////// API routes ////////////////////////////////////////////

// User approval route by id, only admin and master admin can approve users, once approved user status changes from inactive to active and they can access records based on their role
app.put('/users/:id/approve', checkRole(['admin', 'master_admin']), (req, res) => {

    const id = parseInt(req.params.id);
    const candidate = users.find(u => u.id === id);

    // const candidateRole = users.find(c => c.id === id)?.role; // find the role of the candaite being approved using id by admin or master admin
    
    // if(candidate.role === 'admin' && loggingUser.role !== 'master_admin'){ // only master admin can approve admin users
    //     return res.status(403).send('Only master admin can approve admin users');
    // }

    if (candidate.role === 'admin' && req.loggingUser.role !== 'master_admin') { // only master admin can approve admin users
        return res.status(403).send('Only master admin can approve admin users');
    }


    if (!candidate){
        return res.status(404).send('User not found');
    }

    if(candidate.status === 'inactive') {
            candidate.status = 'active';

    }

    if(candidate.status === 'active') {
        candidate.status = 'inactive';
    }


    res.json({
        message: 'User access status updated successfully',
        candidate
    });
});
    

// User registration route
app.post('/users', checkRole(['admin', 'master_admin']), (req, res) => {


    let userStatus; // declare userStatus variable

    let { username, name, role, password } = req.body;

        if(!name || !role || !username || !password){
        return res.status(400).send('Username, Name, Role, and Password must be provided');
        }
    role = role.toLowerCase().trim(); // convert role to lowercase and remove whitespace
    username = username.toLowerCase().trim(); // convert username to lowercase and remove whitespace
    name = name.trim(); // remove whitespace from name

    const existingUser = users.find(u => u.username === username);

        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        if(userRoles.includes(role)){ 
            userStatus = 'active'; // pending approval from admin, complete access to records once approved
        }else{
            return res.status(400).send('Invalid role ! Role must be either analyst, viewer, or admin');
        }

    const newUser = {
        id: Date.now(), // generate new user id based on the current timestamp, this is a simple way to generate unique ids for demonstration purposes, in a real application we would use a more robust method of generating unique ids such as UUIDs
        username,
        name,
        role,
        password, // password is stored in plain text for demonstration purposes, in a real application we would hash the password before storing it for security 
        status: userStatus
    };

    users.push(newUser);

    return res.status(201).json({
        message: 'User registered, admin approval pending!',
        user: users.find(u => u.username === username) // return and verifies the newly created user object
    });
 
});



/////////--------- record management routes (create, update, delete) - only analyst, admin, and master admin can manage records, viewers can only view records

// Record creation with json body
app.post('/records', checkRole(['admin', 'master_admin']), (req, res) => {

    if (!req.body) {
        return res.status(400).send('Invalid JSON body');
    }

    let { amount, type, category, date, note } = req.body;

    if (!amount || !category) {
        return res.status(400).send('Amount and category are required');
    }

    // Validate category and set type automatically
    if (Object.values(CAT.E).includes(category)) {
        type = 'expense';
    } else if (Object.values(CAT.I).includes(category)) {
        type = 'income';
    } else {
        return res.status(400).send('Undefined category');
    }

    const NewID = records.length > 0 ? records[records.length - 1].id + 1 : 1;

    const newRecord = {
        id: NewID,
        amount,
        type,
        category,
        date : date || new Date().toISOString().split('T')[0], // split T removes time part from ISO string, and [0] means we only want the date part only - if date is not provided, use current date in YYYY-MM-DD format
        note: note || '', // if note is not provided, use empty string
        isDeleted: false, // flag to indicate if the record is deleted, this is used to implement soft delete functionality, when a record is deleted, we set this flag to true instead of actually removing the record from the array, this allows us to keep a history of deleted records and also allows us to restore deleted records if needed
        deletedAt: null // timestamp to store when the record was deleted, this is used in conjunction with the isDeleted flag to implement soft delete functionality, when a record is deleted, we set this timestamp to the current date and time, this allows us to keep track of when records were deleted and also allows us to implement features such as showing recently deleted records or restoring records that were deleted within a certain time frame
    };

    records.push(newRecord);

    return res.status(201).json({
        message: 'Record created successfully',
        newRecord
    });
});

// Record update route by id
app.put('/records/:id', checkRole(['admin', 'master_admin']), (req, res) =>{
    const id = parseInt(req.params.id);
    const record = records.find (r => r.id === id && !r.isDeleted); // find the record by id and also check if it's not deleted, this is to prevent updating a record that has been marked as deleted, since deleted records are not actually removed from the array but are just marked as deleted using the isDeleted flag, we need to check this flag when updating records to ensure that we don't accidentally update a record that has been deleted


    if (!record) {
        return res.status(404).send('Record not found');
    }

    const {amount, type, category, date, note} = req.body;

    if (amount !==  undefined) record.amount = amount; // update amount if provided
    if (type !== undefined) record.type = type;
    if (category !== undefined) record.category = category;
    if (date !== undefined) record.date = date;
    if (note !== undefined) record.note = note;

    return res.status(200).json({
        message: 'Record updated successfully',
        record
    });
    

});

// Record delete route by id
app.delete('/records/:id', checkRole(['admin', 'master_admin']), (req, res) => {

    const record = records.find(r => r.id === parseInt(req.params.id) && !r.isDeleted);

    if (!record) {
        return res.status(404).send('Record not found');
    }

    record.isDeleted = true; 
    record.deletedAt = new Date().toISOString(); 

    return res.status(200).json({
        message: 'Record deleted successfully',
        'deletedRecord' : record
    });
});

// Restore deleted record by id
app.put('/records/:id/restore', checkRole(['admin', 'master_admin']), (req, res) => {
    const record = records.find(r => r.id === parseInt(req.params.id));
    
    if (!record) return res.status(404).send('Record not found');
    if (!record.isDeleted) return res.status(400).send('Record is not deleted');
    
    record.isDeleted = false;
    record.deletedAt = null;
    
    res.json({ message: 'Record restored successfully', record });
});


app.delete('/records/:id/purge', checkRole(['admin', 'master_admin']), (req, res) => {
    const recordIndex = records.findIndex(r => r.id === parseInt(req.params.id) && r.isDeleted); // only allow purging of records that are marked as deleted, this is to prevent accidental purging of active records, since purging is a permanent action that cannot be undone, we want to ensure that only records that have been marked as deleted can be purged, this adds an extra layer of safety to the record management process
    if (recordIndex === -1) {
        return res.status(404).send('Record not found deletable');
    }
    records.splice(recordIndex, 1);
    res.json({ message: 'Record purged successfully' });
});

///////////////////////////////////// browser routes ////////////////////////////////////////////


// Home route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Finance Management System API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                ul { line-height: 1.8; }
                .user-endpoints { color: #0066cc; }
                .record-endpoints { color: #009900; }
                .dashboard-endpoints { color: #ff6600; }
            </style>
        </head>
        <body>
            <h1>Welcome to the Finance Management System API</h1>
            <p>Use the following endpoints to manage records and users:</p>
            
            <h2 class="user-endpoints">User Management</h2>
            <ul>
                <li><strong>POST /users</strong> - Register a new user (requires username, name, role, and password in the request body) [Admin or Master Admin only]</li>
                <li><strong>PUT /users/:id/approve</strong> - Toggle user approval status by ID [Admin or Master Admin only]</li>
                <li><strong>GET /users</strong> - Get all users [Admin or Master Admin only]</li>
            </ul>

            <h2 class="record-endpoints">Record Management</h2>
            <ul>
                <li><strong>POST /records</strong> - Create a new record (requires amount, category; optional: type, date, note) [Admin or Master Admin only]</li>
                <li><strong>PUT /records/:id</strong> - Update a record by ID [Admin or Master Admin only]</li>
                <li><strong>GET /records</strong> - Get all records (viewers/analysts see active only; admins see both active and deleted) [Admin, Master Admin, Analyst, or Viewer only]</li>
                <li><strong>DELETE /records/:id</strong> - Soft delete a record by ID (marks as deleted, data preserved) [Admin or Master Admin only]</li>
                <li><strong>PUT /records/:id/restore</strong> - Restore a deleted record by ID [Admin or Master Admin only]</li>
                <li><strong>DELETE /records/:id/purge</strong> - Permanently delete a record (only for soft-deleted records) [Admin or Master Admin only]</li>
            </ul>

            <h2 class="dashboard-endpoints">Dashboard & Analytics</h2>
            <ul>
                <li><strong>GET /dashboard/summary</strong> - Get financial summary (income, expenses, balance, category totals) [Admin, Analyst, or Master Admin only]</li>
            </ul>
        </body>
        </html>
    `);
});

// Records route
app.get('/records', checkRole(['admin', 'master_admin', 'analyst', 'viewer']), (req, res) => {

    if (req.loggingUser.role === 'viewer' || req.loggingUser.role === 'analyst') { // if the logging user is a viewer or analyst, they can only see non-deleted records, this is to prevent viewers from seeing deleted records which could be sensitive or irrelevant to them, and also to keep the interface clean for viewers who are only interested in active records
        const activeRecords = getActiveRecords();

        return res.json(activeRecords);
    }

     return res.json({        
        'activeRecords' : getActiveRecords(),
        'deletedRecords' : getDeletedRecords() 
    });

});

// Users route
app.get('/users', checkRole(['admin', 'master_admin']), (req, res) => {

    if (req.loggingUser.role === 'admin') { // if the logging user is an admin, they can only see non-admin users
        const nonAdminUsers = users.filter(u => u.role !== 'admin' && u.role !== 'master_admin'); // if the logging user is an admin, they can only see non-admin users, this is to prevent admins from seeing other admins and master admins, which could lead to security issues if they see other admins and master admins and try to impersonate them or gain access to their accounts
        return res.json(nonAdminUsers);
    }   
    
    res.json(users);
});


// dashboard summary
app.get('/dashboard/summary', checkRole(['admin', 'analyst', 'master_admin']), (req, res) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};
    const activeRecords = getActiveRecords(); // only consider non-deleted records for dashboard summary

    activeRecords.forEach(r => {

        if (r.type === 'income') {
            totalIncome += r.amount;
        } else if (r.type === 'expense') {
            totalExpenses += r.amount;
        }

        if (!categoryTotals[r.category]) {
            categoryTotals[r.category] = 0;
        }
        categoryTotals[r.category] += r.amount;
    });

    const netBalance = totalIncome - totalExpenses;

        if (req.loggingUser.role === 'master_admin' || req.loggingUser.role === 'admin') {
        return res.json({
        'totalIncome': totalIncome,
        'totalExpenses': totalExpenses,
        'netBalance': netBalance,
        'categoryTotals': categoryTotals,
        'recentRecords': activeRecords.slice(-5), // show the 5 most recent records for master admin and admin users, this is to provide them with a quick overview of recent activity in the system, while also keeping the dashboard summary concise and focused on key metrics
        'recentDeletedRecords': getDeletedRecords().slice(-5), // show the 5 most recent deleted records for master admin and admin users, this is to provide them with visibility into recent deletions in the system, which could be important for auditing and monitoring purposes, while also keeping the dashboard summary concise and focused on key metrics
        'recentRestoredRecords': getActiveRecords().filter(r => r.deletedAt !== null).slice(-5), // deleted at null means the record has never been deleted, so we filter active records to find those that have a deletedAt timestamp, which indicates they were deleted and then restored, showing the 5 most recent of these for master admin and admin users provides them with visibility into recent restorations in the system, which could be important for auditing and monitoring purposes, while also keeping the dashboard summary concise and focused on key metrics
        'recordCount': getActiveRecords().length, // show the total count of non-deleted records for master admin and admin users, this is to provide them with a quick overview of the total number of active records in the system, which could be important for capacity planning and monitoring purposes, while also keeping the dashboard summary concise and focused on key metrics
        'userCount': users.length, // show the total count of users for master admin and admin users, this is to provide them with a quick overview of the total number of users in the system, which could be important for capacity planning and monitoring purposes, while also keeping the dashboard summary concise and focused on key metrics
        'recentUsers': users.slice(-5) // show the 5 most recent users for master admin and admin users, this is to provide them with visibility into recent user registrations in the system, which could be important for auditing and monitoring purposes, while also keeping the dashboard summary concise and focused on key metrics
        })
    }

        return res.json({
            'totalIncome': totalIncome,
            'totalExpenses': totalExpenses,
            'netBalance': netBalance,
            'categoryTotals': categoryTotals
        });


});

// start server
app.listen(3000, () => {
    console.log('Server running on port 3000');

});

