const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Certificate = require('./model/certificate');
const User = require('./model/user');

const addTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create a test user first
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      phone: '1234567890',
      role: 'citizen'
    });
    
    const savedUser = await testUser.save();
    console.log('Test user created:', savedUser._id);

    // Create test certificates
    const testCertificates = [
      {
        userId: savedUser._id,
        type: 'birth',
        status: 'approved',
        applicationData: { name: 'John Doe', dob: '1990-01-01' },
        certificateNumber: 'CERT-001',
        issuedDate: new Date()
      },
      {
        userId: savedUser._id,
        type: 'income',
        status: 'pending',
        applicationData: { name: 'Jane Doe', income: '50000' }
      }
    ];

    const savedCertificates = await Certificate.insertMany(testCertificates);
    console.log('Test certificates created:', savedCertificates.length);

    // Verify data
    const count = await Certificate.countDocuments();
    console.log('Total certificates in database:', count);

    const allCerts = await Certificate.find();
    console.log('All certificates:', allCerts);

    mongoose.connection.close();
    console.log('Test data added successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addTestData();