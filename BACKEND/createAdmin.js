const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./model/user');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'abhishek@02' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('abhi1234', 10);
    
    const admin = new User({
      name: 'Abhishek Kumar',
      email: 'abhishek@02',
      password: hashedPassword,
      phone: '9876543210',
      role: 'admin',
      address: 'Admin Office',
      ward: 'Central',
      aadhar: '1234-5678-9012',
      income: 0,
      category: 'General',
      landHolding: 0,
      familySize: 1
    });
    
    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: abhishek@02');
    console.log('Password: abhi1234');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
