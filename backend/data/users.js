const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by model pre-save hook? No, seeder usually inserts directly or uses model.create. 
        // If using Model.insertMany, pre-save hooks NOT fired. 
        // Better to use pre-hashed password or loop and save.
        // For simplicity in seeder.js, I will map and hash there or use create.
        role: 'admin',
    },
    {
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
    },
];

module.exports = users;
