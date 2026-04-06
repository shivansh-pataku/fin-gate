const {users, userRoles} = require('../data/mockData');

// role middleware to check if user has required role to access certain routes
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        let username, password;

        // Check for HTTP Basic Authentication (Authorization header)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Basic ')) {
            // Decode Basic Auth: "Basic <base64(username:password)>"
            const base64Credentials = authHeader.slice(6); // Remove "Basic " prefix
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
            const [user, pass] = credentials.split(':');
            username = user;
            password = pass;
        } else {
            // Fall back to custom headers (username and password)
            username = req.headers.username;
            password = req.headers.password;
        }

        if (!username || !password) {
            return res.status(400).send('Username and password headers are required');
        }

        // Check if user exists with correct credentials
        const loggingUser = users.find(u => u.username === username && u.password === password); /// find the user in the users array with matching username and password from the request headers, this is a simple authentication mechanism for demonstration purposes, in a real application we would use a more secure method of authentication such as JWT or sessions
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

module.exports = checkRole;