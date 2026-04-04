const express = require('express');
const app = express();

// middleware (important)
app.use(express.json());




// Initialize records storage array
const records = [
    {"id":1,"amount":100,"type":"expense","category":"food","date":"2026-04-02","note":"lunch"},
    {"id":2,"amount":200,"type":"expense","category":"books","date":"2026-04-02","note":"lunch"},
    {"id":3,"amount":300,"type":"expense","category":"maintainance","date":"2026-04-02","note":"lunch"},
    {"id":4,"amount":400,"type":"expense","category":"farms","date":"2026-04-02","note":"lunch"},
    {"id":5,"amount":100,"type":"expense","category":"visits","date":"2026-04-02","note":"lunch"},
    {"id":6,"amount":50000,"type":"earn","category":"job","date":"2026-04-02","note":"lunch"},
    {"id":7,"amount":300,"type":"earn","category":"farms","date":"2026-04-02","note":"lunch"},
    {"id":8,"amount":400,"type":"earn","category":"art","date":"2026-04-02","note":"lunch"}
]; // functional records only for testing purposes

// Initialize users storage array 

const users = [
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

const master_admins = [{ id:0,username:'master', name:'master', password: 'master', role: 'master_admin', status: 'active'},]; // pre-create master_admin user with all access, this user cannot be created by anyone else, only system admin can create this user, this user has all access to records and user management, can create other admins, analysts, and viewers; also inaccessible to any user except master admin even that for update/modification purpose only

users.push(...master_admins); // add master admins to users array for authentication, so that master always available for authentication and can also not be viewed, deleted or modified in any way - ... three dots is used to spread the master_admins array into the users array


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


    if (!candidate){
        return res.status(404).send('User not found');
    }

    if(candidate.status === 'active') {
        return res.status(400).send('User already active')
    }

    candidate.status = 'active';

    res.json({
        message: 'User approved successfully',
        candidate
    });
});
    

// User registration route
app.post('/users', (req, res) => {


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
            userStatus = 'inactive'; // pending approval from admin, complete access to records once approved
        }else{
            return res.status(400).send('Invalid role ! Role must be either analyst, viewer, or admin');
        }

    const newUser = {
        id: users.length + 1,
        username,
        name,
        role,
        password, // include password in the new user object
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
app.post('/records', checkRole(['analyst', 'admin', 'master_admin']), (req, res) => {

    if (!req.body) {
        return res.status(400).send('Invalid JSON body');
    }

    const { amount, type, category, date, note } = req.body;

    if (!amount || !type) {
        return res.status(400).send('Amount and type are required');
    }

    const newRecord = {
        id: records.length + 1,
        amount,
        type,
        category,
        date,
        note
    };

    records.push(newRecord);

    return res.status(201).json({
        message: 'Record created successfully',
        newRecord
    });
});

// Record update route by id
app.put('/records/:id', checkRole(['analyst', 'admin', 'master_admin']), (req, res) =>{
    const id = parseInt(req.params.id);
    const record = records.find (r => r.id === id);

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
app.delete('/records/:id', checkRole(['admin', 'master_admin', 'analyst']), (req, res) => {

    const id = parseInt(req.params.id);

    const index = records.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).send('Record not found');
    }

    const deletedRecord = records.splice(index, 1); // remove the record from the array where index is found up to 1 record
    return res.status(200).json({
        message: 'Record deleted successfully',
        deletedRecord
    });
});


///////////////////////////////////// browser routes ////////////////////////////////////////////


// Home route
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Finance Management System API</h1>
        <p>Use the following endpoints to manage records and users:</p>
        <ul>
            <li>POST /users - Register a new user (requires username, name, role, and password in the request body)</li>
            <li>PUT /users/:id/approve - Approve a user by ID (admin or master_admin only)</li>
            <li>POST /records - Create a new record (analyst, admin, or master_admin only)</li>
            <li>PUT /records/:id - Update a record by ID (analyst, admin, or master_admin only)</li>
            <li>DELETE /records/:id - Delete a record by ID (analyst, admin, or master_admin only)</li>
            <li>GET /records - Get all records (admin, master_admin, analyst, or viewer only)</li>
            <li>GET /users - Get all users (admin or master_admin only)</li>
        </ul>
    `);
});

// Records route
app.get('/records', checkRole(['admin', 'master_admin', 'analyst', 'viewer']), (req, res) => {
    res.json(records);
});

// Users route
app.get('/users', checkRole(['admin', 'master_admin']), (req, res) => {

    if (req.loggingUser.role === 'admin') { // if the logging user is an admin, they can only see non-admin users
        const nonAdminUsers = users.filter(u => u.role !== 'admin' && u.role !== 'master_admin'); // if the logging user is an admin, they can only see non-admin users, this is to prevent admins from seeing other admins and master admins, which could lead to security issues if they see other admins and master admins and try to impersonate them or gain access to their accounts
        return res.json(nonAdminUsers);
    }   
    
    res.json(users);
});

// start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

