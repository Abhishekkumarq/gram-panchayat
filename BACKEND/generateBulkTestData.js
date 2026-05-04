const mongoose = require('mongoose');
const User = require('./model/user');
const Scheme = require('./model/scheme');
const SchemeApplication = require('./model/schemeApplication');
require('dotenv').config();

async function generateBulkApplications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Get all schemes and users
    const schemes = await Scheme.find();
    const users = await User.find({ role: 'citizen' });

    if (schemes.length === 0 || users.length === 0) {
      console.log('❌ No schemes or users found. Please run seedAllData.js first.');
      process.exit(1);
    }

    console.log(`Found ${schemes.length} schemes and ${users.length} users`);

    // Generate 700+ applications
    const applications = [];
    const statuses = ['submitted', 'under-review', 'approved', 'rejected'];
    const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

    console.log('Generating 750 bulk applications...');

    for (let i = 0; i < 750; i++) {
      const randomScheme = schemes[i % schemes.length];
      const randomUser = users[i % users.length];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomWard = wards[Math.floor(Math.random() * wards.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      applications.push({
        userId: randomUser._id,
        schemeId: randomScheme._id,
        status: randomStatus,
        applicationData: {
          ward: randomWard,
          category: randomCategory,
          familySize: Math.floor(Math.random() * 8) + 1,
          income: Math.floor(Math.random() * 500000) + 30000,
          details: `Application #${i + 1} - Generated test data for ${randomScheme.name}`
        },
        submittedDocuments: ['aadhar.pdf', 'income_certificate.pdf'],
        remarks: randomStatus === 'rejected' ? 'Does not meet criteria' : randomStatus === 'approved' ? 'Verified and approved' : 'Under processing',
        approvalDate: randomStatus === 'approved' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      });
    }

    // Delete existing applications
    await SchemeApplication.deleteMany({});
    console.log('✓ Cleared existing applications');

    // Insert bulk applications
    const result = await SchemeApplication.insertMany(applications);
    console.log(`✓ Created ${result.length} bulk applications`);

    // Get stats
    const stats = {
      total: await SchemeApplication.countDocuments(),
      submitted: await SchemeApplication.countDocuments({ status: 'submitted' }),
      underReview: await SchemeApplication.countDocuments({ status: 'under-review' }),
      approved: await SchemeApplication.countDocuments({ status: 'approved' }),
      rejected: await SchemeApplication.countDocuments({ status: 'rejected' })
    };

    console.log('\n✅ Bulk Applications Generated Successfully!');
    console.log('========================');
    console.log(`Total Applications: ${stats.total}`);
    console.log(`Submitted: ${stats.submitted}`);
    console.log(`Under Review: ${stats.underReview}`);
    console.log(`Approved: ${stats.approved}`);
    console.log(`Rejected: ${stats.rejected}`);
    console.log('========================\n');

    // Test pagination
    console.log('Testing pagination...');
    const page1 = await SchemeApplication.find()
      .populate('userId', 'name email')
      .populate('schemeId', 'name')
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(50);

    console.log(`✓ Page 1 loaded: ${page1.length} records`);
    console.log(`✓ Pagination Working: Total pages will be ${Math.ceil(stats.total / 50)} (with 50 per page)`);

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateBulkApplications();
