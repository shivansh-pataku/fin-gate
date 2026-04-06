const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '💰 Finance Management System API',
      version: '1.0.0',
      description: `
        A comprehensive Node.js/Express API for managing financial records with role-based access control.
        
        **Features:**
        - 👥 User Management: Register users with different roles (viewer, analyst, admin, master_admin)
        - 🔐 Role-Based Access Control: Restrict endpoints based on user roles
        - 📊 Record Management: Create, read, update, and soft-delete financial records
        - 📈 Financial Dashboard: Get analytics, trends, and category breakdowns
        - 🗑️ Soft Delete: Permanently delete, restore, and purge deleted records
        
        **Authentication:** All endpoints use HTTP Basic Authentication (except /api-docs)
        
        **Test Credentials:**
        - Admin: username: \`admin2\`, password: \`1234\`
        - Viewer: username: \`viewer1\`, password: \`1234\`
        - Analyst: username: \`analyst1\`, password: \`1234\`
        - Master Admin: username: \`master\`, password: \`master\`
      `,
      contact: {
        name: 'Finance Backend',
        url: 'http://localhost:3000',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'HTTP Basic Authentication with username and password\n\nFormat: username:password (base64 encoded)',
        },
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Scans all files in routes folder for JSDoc comments
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };