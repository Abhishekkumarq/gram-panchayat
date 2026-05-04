const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./model/user');

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create a test user with hashed password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = new User({
      name: 'Test Login User',
      email: 'login@test.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'citizen'
    });

    await testUser.save();
    console.log('Test login user created');

    // Generate JWT token
    const token = jwt.sign(
      { id: testUser._id, email: testUser.email, role: testUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login credentials:');
    console.log('Email: login@test.com');
    console.log('Password: password123');
    console.log('Token:', token);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();