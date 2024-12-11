// backend/models.js
const mongoose = require('mongoose');

// JWT Secret
const JWT_SECRET = 'your_jwt_secret';

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Export User and JWT_SECRET
module.exports = { User, JWT_SECRET };
