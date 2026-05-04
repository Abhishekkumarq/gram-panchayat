const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import all models
const User = require('./model/user');
const Certificate = require('./model/certificate');
const Tax = require('./model/tax');
const Complaint = require('./model/complaint');
const Scheme = require('./model/scheme');
const Fund = require('./model/fund');
const SchemeApplication = require('./model/schemeApplication');

const seedAllData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB: gram-panchayat');

    // Clear all existing data
    console.log('\nClearing existing data...');
    await User.deleteMany({});
    await Certificate.deleteMany({});
    await Tax.deleteMany({});
    await Complaint.deleteMany({});
    await Scheme.deleteMany({});
    await SchemeApplication.deleteMany({});
    await Fund.deleteMany({});
    console.log('✓ All collections cleared');

    // Create Users (Citizens, Admin, Officers)
    console.log('\n--- Creating Users ---');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@panchayat.com',
        password: adminPassword,
        phone: '9000000001',
        role: 'admin',
        address: 'Main Office, Gram Panchayat',
        ward: 'Main Office',
        aadhar: '1111111111111111'
      },
      {
        name: 'Officer Sharma',
        email: 'officer@panchayat.com',
        password: hashedPassword,
        phone: '9000000002',
        role: 'officer',
        address: 'Office Ward 1',
        ward: 'Ward 1',
        aadhar: '2222222222222222'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'citizen',
        address: 'House No. 123, Ward 1',
        ward: 'Ward 1',
        aadhar: '3333333333333333',
        income: 150000,
        category: 'General',
        familySize: 4
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        password: hashedPassword,
        phone: '9876543211',
        role: 'citizen',
        address: 'House No. 45, Ward 2',
        ward: 'Ward 2',
        aadhar: '4444444444444444',
        income: 120000,
        category: 'SC',
        familySize: 3
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: hashedPassword,
        phone: '9876543212',
        role: 'citizen',
        address: 'Farm Plot 15, Ward 3',
        ward: 'Ward 3',
        aadhar: '5555555555555555',
        income: 180000,
        category: 'OBC',
        landHolding: 2.5,
        familySize: 5
      },
      {
        name: 'Sneha Verma',
        email: 'sneha@example.com',
        password: hashedPassword,
        phone: '9876543213',
        role: 'citizen',
        address: 'Apartment 201, Ward 1',
        ward: 'Ward 1',
        aadhar: '6666666666666666',
        income: 95000,
        category: 'ST',
        familySize: 2
      }
    ];

    const savedUsers = await User.insertMany(users);
    console.log(`✓ Created ${savedUsers.length} users`);
    const [admin, officer, rajesh, priya, amit, sneha] = savedUsers;

    // Create Certificates
    console.log('\n--- Creating Certificates ---');
    const certificates = [
      {
        userId: rajesh._id,
        type: 'birth',
        status: 'approved',
        applicationData: { 
          firstName: 'Rajesh',
          lastName: 'Kumar',
          dateOfBirth: '1985-05-15',
          fatherName: 'Ram Kumar',
          motherName: 'Lakshmi Devi',
          placeOfBirth: 'Government Hospital, Ward 1'
        },
        certificateNumber: 'CERT-2024-001',
        issuedDate: new Date('2024-01-15'),
        remarks: 'Approved and issued'
      },
      {
        userId: rajesh._id,
        type: 'income',
        status: 'approved',
        applicationData: { 
          applicantName: 'Rajesh Kumar',
          annualIncome: 150000,
          occupation: 'Farmer'
        },
        certificateNumber: 'CERT-2024-002',
        issuedDate: new Date('2024-02-20'),
        remarks: 'Income verified'
      },
      {
        userId: priya._id,
        type: 'caste',
        status: 'pending',
        applicationData: { 
          applicantName: 'Priya Singh',
          caste: 'SC',
          community: 'Scheduled Caste'
        },
        remarks: 'Under verification'
      },
      {
        userId: amit._id,
        type: 'residence',
        status: 'approved',
        applicationData: { 
          applicantName: 'Amit Patel',
          address: 'Farm Plot 15, Ward 3',
          yearsOfResidence: 10
        },
        certificateNumber: 'CERT-2024-003',
        issuedDate: new Date('2024-01-10')
      },
      {
        userId: sneha._id,
        type: 'domicile',
        status: 'rejected',
        applicationData: { 
          applicantName: 'Sneha Verma',
          state: 'Current State',
          yearsOfResidence: 1
        },
        remarks: 'Does not meet minimum 5 year residency requirement'
      }
    ];

    const savedCertificates = await Certificate.insertMany(certificates);
    console.log(`✓ Created ${savedCertificates.length} certificates`);

    // Create Taxes
    console.log('\n--- Creating Taxes ---');
    const taxes = [
      {
        userId: rajesh._id,
        taxType: 'property',
        amount: 5000,
        year: 2024,
        quarter: 'Q1',
        status: 'paid',
        paymentDate: new Date('2024-01-20'),
        receiptNumber: 'TAX-2024-001',
        propertyDetails: {
          propertyId: 'PROP-001',
          address: 'House No. 123, Ward 1',
          value: 500000
        }
      },
      {
        userId: rajesh._id,
        taxType: 'water',
        amount: 500,
        year: 2024,
        quarter: 'Q1',
        status: 'paid',
        paymentDate: new Date('2024-02-05'),
        receiptNumber: 'TAX-2024-002'
      },
      {
        userId: priya._id,
        taxType: 'property',
        amount: 3000,
        year: 2024,
        quarter: 'Q2',
        status: 'pending',
        propertyDetails: {
          propertyId: 'PROP-002',
          address: 'House No. 45, Ward 2',
          value: 300000
        }
      },
      {
        userId: amit._id,
        taxType: 'property',
        amount: 8000,
        year: 2024,
        quarter: 'Q1',
        status: 'paid',
        paymentDate: new Date('2024-01-25'),
        receiptNumber: 'TAX-2024-003',
        propertyDetails: {
          propertyId: 'PROP-003',
          address: 'Farm Plot 15, Ward 3',
          value: 800000
        }
      }
    ];

    const savedTaxes = await Tax.insertMany(taxes);
    console.log(`✓ Created ${savedTaxes.length} tax records`);

    // Create Complaints
    console.log('\n--- Creating Complaints ---');
    const complaints = [
      {
        userId: rajesh._id,
        title: 'Broken Water Pipe',
        description: 'Water pipe near my house is broken for 3 days. Need immediate repair.',
        category: 'water',
        priority: 'high',
        status: 'resolved',
        assignedTo: officer._id,
        department: 'Water Supply',
        location: 'House No. 123, Ward 1',
        resolution: 'Pipe repaired on 2024-02-15'
      },
      {
        userId: priya._id,
        title: 'Street Light Not Working',
        description: 'Street light near the market is not working for a week.',
        category: 'electricity',
        priority: 'medium',
        status: 'in-progress',
        assignedTo: officer._id,
        department: 'Electricity',
        location: 'Market Area, Ward 2'
      },
      {
        userId: amit._id,
        title: 'Road Pothole Hazard',
        description: 'Large pothole on the main road causing accidents.',
        category: 'road',
        priority: 'high',
        status: 'assigned',
        assignedTo: officer._id,
        department: 'Roads & Infrastructure',
        location: 'Main Road, Ward 3'
      },
      {
        userId: sneha._id,
        title: 'Drainage Issue',
        description: 'Stagnant water and poor drainage in the colony.',
        category: 'sanitation',
        priority: 'medium',
        status: 'pending',
        department: 'Sanitation',
        location: 'Apartment Complex, Ward 1'
      },
      {
        userId: rajesh._id,
        title: 'Primary Health Center Issue',
        description: 'Health center lacks basic medicines and staff.',
        category: 'health',
        priority: 'high',
        status: 'pending',
        department: 'Health',
        location: 'PHC, Ward 1'
      }
    ];

    const savedComplaints = await Complaint.insertMany(complaints);
    console.log(`✓ Created ${savedComplaints.length} complaints`);

    // Create Schemes
    console.log('\n--- Creating Schemes ---');
    const schemes = [
      {
        name: 'PM-KISAN Yojana',
        description: 'Direct income support to farmers with cultivable land',
        type: 'subsidy',
        eligibilityCriteria: {
          maxIncome: 500000,
          landHolding: 0.5,
          categories: ['General', 'OBC', 'SC', 'ST']
        },
        benefits: '₹6000 per year in three installments of ₹2000 each',
        applicationProcess: 'Apply online through PM-KISAN portal or Panchayat office',
        documents: ['Aadhar Card', 'Land Records', 'Bank Account Details', 'Income Certificate'],
        isActive: true
      },
      {
        name: 'Pradhan Mantri Awas Yojana',
        description: 'Housing for all - provides financial assistance for house construction',
        type: 'loan',
        eligibilityCriteria: {
          maxIncome: 300000,
          categories: ['EWS', 'LIG', 'MIG']
        },
        benefits: 'Subsidy up to ₹1-2.5 lakhs depending on category',
        applicationProcess: 'Apply at Panchayat office with verified credentials',
        documents: ['Income Certificate', 'Aadhar Card', 'Land Ownership Proof', 'Construction Plan'],
        isActive: true
      },
      {
        name: 'Indira Gandhi National Old Age Pension Scheme',
        description: 'Monthly pension for elderly citizens',
        type: 'pension',
        eligibilityCriteria: {
          maxIncome: 100000,
          minAge: 60
        },
        benefits: 'Monthly pension of ₹500-1200 depending on state',
        applicationProcess: 'Submit application at Panchayat with age proof',
        documents: ['Age Proof', 'Income Certificate', 'Aadhar Card', 'Bank Details'],
        isActive: true
      },
      {
        name: 'National Food Security Act (Public Distribution System)',
        description: 'Subsidized food grains for below poverty line families',
        type: 'welfare',
        eligibilityCriteria: {
          maxIncome: 150000,
          categories: ['BPL', 'APL']
        },
        benefits: 'Rice @ ₹3/kg, Wheat @ ₹2/kg, Sugar @ ₹13.50/kg',
        applicationProcess: 'Get ration card from Panchayat office',
        documents: ['Aadhar Card', 'Residence Proof', 'Income Certificate'],
        isActive: true
      },
      {
        name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
        description: 'Life insurance scheme for low income groups',
        type: 'insurance',
        eligibilityCriteria: {
          maxIncome: 300000,
          minAge: 18,
          maxAge: 50
        },
        benefits: 'Death coverage of ₹2 lakhs for annual premium of ₹436',
        applicationProcess: 'Apply through bank or Panchayat office',
        documents: ['Aadhar Card', 'Bank Account Details'],
        isActive: true
      },
      {
        name: 'Jan Dhan Yojana',
        description: 'Financial inclusion scheme providing basic savings account',
        type: 'welfare',
        eligibilityCriteria: {
          categories: ['General', 'OBC', 'SC', 'ST']
        },
        benefits: 'Free bank account with RuPay card and accidental insurance',
        applicationProcess: 'Open account at any nationalized bank',
        documents: ['Aadhar Card', 'Address Proof'],
        isActive: true
      },
      {
        name: 'Ayushman Bharat',
        description: 'National Health Insurance Scheme for senior citizens and low income groups',
        type: 'insurance',
        eligibilityCriteria: {
          maxIncome: 500000,
          categories: ['BPL', 'Below median income']
        },
        benefits: 'Health insurance coverage up to ₹5 lakhs per family per year',
        applicationProcess: 'Register through Panchayat or health centers',
        documents: ['Aadhar Card', 'Income Certificate', 'Caste Certificate'],
        isActive: true
      },
      {
        name: 'Soil Health Card Scheme',
        description: 'Provides soil testing and nutrient recommendations to farmers',
        type: 'subsidy',
        eligibilityCriteria: {
          categories: ['Farmers']
        },
        benefits: 'Free soil testing and personalized nutrient recommendations',
        applicationProcess: 'Contact Panchayat Agricultural Department or apply online',
        documents: ['Land Records', 'Farmer ID'],
        isActive: true
      },
      {
        name: 'Kisan Credit Card',
        description: 'Agricultural credit at concessional rate of interest',
        type: 'loan',
        eligibilityCriteria: {
          maxIncome: 1000000,
          minAge: 18,
          categories: ['Farmers']
        },
        benefits: 'Quick agricultural loans at 2% interest subsidy',
        applicationProcess: 'Apply at nearby bank with land records',
        documents: ['Land Records', 'Aadhar Card', 'Income Certificate', 'ID Proof'],
        isActive: true
      },
      {
        name: 'National Pension System',
        description: 'Government-backed pension scheme for retirement',
        type: 'pension',
        eligibilityCriteria: {
          minAge: 18,
          maxAge: 60
        },
        benefits: 'Employer + Employee contribution with tax benefits',
        applicationProcess: 'Enroll through employer or bank',
        documents: ['PAN Card', 'Aadhar Card', 'Bank Details'],
        isActive: true
      },
      {
        name: 'Ujjwala Yojana',
        description: 'LPG connection for below poverty line households',
        type: 'subsidy',
        eligibilityCriteria: {
          maxIncome: 150000,
          categories: ['BPL', 'SC', 'ST', 'Others']
        },
        benefits: 'Free LPG connection with cylinder subsidy',
        applicationProcess: 'Apply through Panchayat office',
        documents: ['BPL Card', 'Aadhar Card', 'Address Proof'],
        isActive: true
      },
      {
        name: 'Building and Construction Workers Welfare Scheme',
        description: 'Social security scheme for construction workers',
        type: 'welfare',
        eligibilityCriteria: {
          minAge: 18,
          categories: ['Construction Workers']
        },
        benefits: 'Disability benefit ₹1 lakh, Death benefit ₹3 lakh, Medical subsidy',
        applicationProcess: 'Register with State Labor Department and Panchayat',
        documents: ['Work Experience Certificate', 'Aadhar Card', 'Bank Details'],
        isActive: true
      },
      {
        name: 'Post Matric Scholarship',
        description: 'Scholarship for SC/ST/OBC students pursuing higher education',
        type: 'scholarship',
        eligibilityCriteria: {
          minAge: 16,
          categories: ['SC', 'ST', 'OBC', 'Minority'],
          requirement: 'Post-secondary education enrolled'
        },
        benefits: 'Tuition fees + maintenance allowance (₹300-550 per month)',
        applicationProcess: 'Apply through educational institution or Panchayat',
        documents: ['School Certificate', 'Caste Certificate', 'Income Certificate', 'Bank Details'],
        isActive: true
      },
      {
        name: 'National Scholarship Scheme',
        description: 'Merit and need-based scholarship for talented students',
        type: 'scholarship',
        eligibilityCriteria: {
          minAge: 14,
          requirement: '80%+ marks in previous exam'
        },
        benefits: 'Monthly scholarship up to ₹1000 for Class 9-12',
        applicationProcess: 'Apply through school or online portal',
        documents: ['School Certificate', 'Income Certificate', 'Mark Sheet'],
        isActive: true
      },
      {
        name: 'Startup India',
        description: 'Scheme to support and nurture new startups',
        type: 'subsidy',
        eligibilityCriteria: {
          minAge: 18,
          maxAge: 65,
          requirement: 'Innovative business idea'
        },
        benefits: 'Registration exemption, GST exemption (3 years), tax holiday',
        applicationProcess: 'Register on Startup India portal',
        documents: ['Business Plan', 'Aadhar Card', 'Bank Details', 'Certificate of Incorporation'],
        isActive: true
      },
      {
        name: 'Digital India Scholarship',
        description: 'Scholarship scheme for digital skill training',
        type: 'scholarship',
        eligibilityCriteria: {
          minAge: 10,
          maxAge: 45,
          requirement: 'Any educational qualification'
        },
        benefits: 'Free digital skill training and certification',
        applicationProcess: 'Enroll through designated training centers',
        documents: ['Age Proof', 'Educational Certificate', 'Aadhar Card'],
        isActive: true
      },
      {
        name: 'Pradhan Mantri Suraksha Bima Yojana',
        description: 'Accidental insurance scheme for low income groups',
        type: 'insurance',
        eligibilityCriteria: {
          maxIncome: 200000,
          minAge: 18,
          maxAge: 70
        },
        benefits: 'Accidental death coverage ₹2 lakhs, disability coverage ₹1 lakh',
        applicationProcess: 'Apply through bank or Panchayat office',
        documents: ['Aadhar Card', 'Bank Account Details'],
        isActive: true
      },
      {
        name: 'MGNREGA',
        description: 'Mahatma Gandhi National Rural Employment Guarantee Act',
        type: 'employment',
        eligibilityCriteria: {
          minAge: 18,
          requirement: 'Rural household willing to work'
        },
        benefits: '₹260/day for guaranteed 100 days employment per household per year',
        applicationProcess: 'Register at Panchayat office as MGNREGA worker',
        documents: ['Aadhar Card', 'Voter ID', 'Bank Account Details'],
        isActive: true
      },
      {
        name: 'Mudra Loan Scheme',
        description: 'Loans for micro, small and medium enterprises',
        type: 'loan',
        eligibilityCriteria: {
          minAge: 18,
          loanLimit: 1000000,
          requirement: 'Business proposal'
        },
        benefits: 'Loans up to ₹10 lakhs at competitive interest rates',
        applicationProcess: 'Apply to MUDRA scheme participating banks',
        documents: ['Business Plan', 'Aadhar Card', 'Bank Account Details', 'GST/PAN'],
        isActive: true
      },
      {
        name: 'Pradhan Mantri Shram Yogi Maandhan',
        description: 'Pension scheme for unorganized sector workers',
        type: 'pension',
        eligibilityCriteria: {
          minAge: 18,
          maxAge: 40,
          requirement: 'Unorganized sector worker'
        },
        benefits: 'Monthly pension of ₹3000 after age 60',
        applicationProcess: 'Register through Panchayat or Common Service Centers',
        documents: ['Work ID', 'Aadhar Card', 'Bank Account Details'],
        isActive: true
      },
      {
        name: 'PM SVANidhi',
        description: 'Loan scheme for street vendors and small business owners',
        type: 'loan',
        eligibilityCriteria: {
          loanLimit: 50000,
          requirement: 'Recognized street vendor'
        },
        benefits: 'Working capital loan up to ₹50,000 at 7% interest',
        applicationProcess: 'Apply through bank or UPI-linked application',
        documents: ['Vendor ID', 'Aadhar Card', 'Bank Account Details'],
        isActive: true
      },
      {
        name: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Comprehensive crop insurance scheme',
        type: 'insurance',
        eligibilityCriteria: {
          categories: ['Farmers'],
          requirement: 'Cultivable land holder'
        },
        benefits: 'Insurance coverage for crop loss due to natural calamities',
        applicationProcess: 'Enroll through banks at time of crop loan disbursement',
        documents: ['Land Records', 'Aadhar Card', 'Bank Loan Documents'],
        isActive: true
      }
    ];

    const savedSchemes = await Scheme.insertMany(schemes);
    console.log(`✓ Created ${savedSchemes.length} schemes`);

    // Create Funds
    console.log('\n--- Creating Funds ---');
    const funds = [
      {
        ward: 'Ward 1',
        year: 2024,
        category: 'infrastructure',
        allocated: 500000,
        spent: 350000,
        description: 'Road construction, water supply pipeline upgrade',
        projects: [
          {
            name: 'Main Road Resurfacing',
            amount: 200000,
            status: 'completed',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-28')
          },
          {
            name: 'Water Pipeline Extension',
            amount: 150000,
            status: 'in-progress',
            startDate: new Date('2024-02-15'),
            endDate: new Date('2024-04-30')
          }
        ]
      },
      {
        ward: 'Ward 1',
        year: 2024,
        category: 'health',
        allocated: 200000,
        spent: 150000,
        description: 'Primary health center upgrades and equipment',
        projects: [
          {
            name: 'PHC Equipment Purchase',
            amount: 150000,
            status: 'completed',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-03-15')
          }
        ]
      },
      {
        ward: 'Ward 2',
        year: 2024,
        category: 'education',
        allocated: 300000,
        spent: 200000,
        description: 'School building repairs and classroom renovation',
        projects: [
          {
            name: 'School Building Repair',
            amount: 200000,
            status: 'in-progress',
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-05-31')
          }
        ]
      },
      {
        ward: 'Ward 2',
        year: 2024,
        category: 'sanitation',
        allocated: 250000,
        spent: 180000,
        description: 'Waste management system and public toilets',
        projects: [
          {
            name: 'Public Toilet Construction',
            amount: 180000,
            status: 'completed',
            startDate: new Date('2024-01-20'),
            endDate: new Date('2024-03-20')
          }
        ]
      },
      {
        ward: 'Ward 3',
        year: 2024,
        category: 'infrastructure',
        allocated: 400000,
        spent: 250000,
        description: 'Agricultural access roads and irrigation upgrades',
        projects: [
          {
            name: 'Farm Road Construction',
            amount: 250000,
            status: 'in-progress',
            startDate: new Date('2024-02-10'),
            endDate: new Date('2024-06-30')
          }
        ]
      }
    ];

    const savedFunds = await Fund.insertMany(funds);
    console.log(`✓ Created ${savedFunds.length} fund records`);

    // Create Scheme Applications
    console.log('\n--- Creating Scheme Applications ---');
    const schemeApplications = [
      // PM-KISAN Applications (Scheme 0)
      {
        userId: rajesh._id,
        schemeId: savedSchemes[0]._id,
        status: 'approved',
        applicationData: { landHolding: 2.5, farmDetails: 'Two plots in Ward 1', harvestDetails: 'Wheat and Rice' },
        submittedDocuments: ['aadhar.pdf', 'land_records.pdf', 'bank_details.pdf'],
        remarks: 'Verified and approved',
        approvalDate: new Date('2024-02-01')
      },
      {
        userId: amit._id,
        schemeId: savedSchemes[0]._id,
        status: 'submitted',
        applicationData: { landHolding: 3.0, farmDetails: 'Three plots in Ward 3' },
        submittedDocuments: ['aadhar.pdf', 'land_records.pdf']
      },
      {
        userId: rajesh._id,
        schemeId: savedSchemes[0]._id,
        status: 'under-review',
        applicationData: { landHolding: 1.5, farmDetails: 'One plot in Ward 1' },
        submittedDocuments: ['aadhar.pdf', 'land_records.pdf']
      },
      
      // Awas Yojana Applications (Scheme 1)
      {
        userId: priya._id,
        schemeId: savedSchemes[1]._id,
        status: 'under-review',
        applicationData: { familySize: 3, housingDetails: 'Currently renting' },
        submittedDocuments: ['aadhar.pdf', 'income_certificate.pdf']
      },
      {
        userId: sneha._id,
        schemeId: savedSchemes[1]._id,
        status: 'approved',
        applicationData: { familySize: 2, housingDetails: 'Need new house', category: 'EWS' },
        submittedDocuments: ['aadhar.pdf', 'income_certificate.pdf', 'construction_plan.pdf'],
        remarks: 'EWS category verified',
        approvalDate: new Date('2024-02-15')
      },
      {
        userId: amit._id,
        schemeId: savedSchemes[1]._id,
        status: 'rejected',
        applicationData: { familySize: 5, housingDetails: 'Income exceeds limit' },
        remarks: 'Income exceeds maximum limit for scheme'
      },
      
      // Old Age Pension Applications (Scheme 2)
      {
        userId: sneha._id,
        schemeId: savedSchemes[2]._id,
        status: 'rejected',
        applicationData: { age: 45 },
        remarks: 'Does not meet minimum age of 60 years'
      },
      {
        userId: priya._id,
        schemeId: savedSchemes[2]._id,
        status: 'submitted',
        applicationData: { age: 62, income: 80000 },
        submittedDocuments: ['aadhar.pdf', 'age_proof.pdf']
      },
      
      // Food Security Act Applications (Scheme 3)
      {
        userId: rajesh._id,
        schemeId: savedSchemes[3]._id,
        status: 'approved',
        applicationData: { category: 'BPL', familySize: 4 },
        submittedDocuments: ['aadhar.pdf', 'ration_card.pdf'],
        remarks: 'BPL status verified',
        approvalDate: new Date('2024-01-25')
      },
      {
        userId: priya._id,
        schemeId: savedSchemes[3]._id,
        status: 'approved',
        applicationData: { category: 'SC', familySize: 3 },
        submittedDocuments: ['aadhar.pdf', 'ration_card.pdf'],
        remarks: 'SC category verified',
        approvalDate: new Date('2024-02-10')
      },
      {
        userId: amit._id,
        schemeId: savedSchemes[3]._id,
        status: 'under-review',
        applicationData: { category: 'OBC', familySize: 5 },
        submittedDocuments: ['aadhar.pdf', 'income_certificate.pdf']
      },
      {
        userId: sneha._id,
        schemeId: savedSchemes[3]._id,
        status: 'submitted',
        applicationData: { category: 'ST', familySize: 2 },
        submittedDocuments: ['aadhar.pdf']
      },
      
      // Insurance Scheme Applications (Scheme 4)
      {
        userId: rajesh._id,
        schemeId: savedSchemes[4]._id,
        status: 'approved',
        applicationData: { age: 38, income: 150000 },
        submittedDocuments: ['aadhar.pdf', 'bank_details.pdf'],
        remarks: 'Insurance coverage activated',
        approvalDate: new Date('2024-01-30')
      },
      {
        userId: priya._id,
        schemeId: savedSchemes[4]._id,
        status: 'approved',
        applicationData: { age: 35, income: 120000 },
        submittedDocuments: ['aadhar.pdf', 'bank_details.pdf'],
        remarks: 'Coverage started',
        approvalDate: new Date('2024-02-05')
      },
      {
        userId: amit._id,
        schemeId: savedSchemes[4]._id,
        status: 'submitted',
        applicationData: { age: 40, income: 180000 },
        submittedDocuments: ['aadhar.pdf', 'bank_details.pdf']
      },
      {
        userId: sneha._id,
        schemeId: savedSchemes[4]._id,
        status: 'under-review',
        applicationData: { age: 32, income: 95000 },
        submittedDocuments: ['aadhar.pdf']
      },
      
      // Multiple applications per scheme
      {
        userId: officer._id,
        schemeId: savedSchemes[3]._id,
        status: 'approved',
        applicationData: { category: 'General', familySize: 3 },
        submittedDocuments: ['aadhar.pdf'],
        remarks: 'Staff member verified',
        approvalDate: new Date('2024-02-01')
      },
      {
        userId: rajesh._id,
        schemeId: savedSchemes[1]._id,
        status: 'submitted',
        applicationData: { familySize: 4, housingDetails: 'Need house extension' },
        submittedDocuments: ['aadhar.pdf', 'income_certificate.pdf']
      },
      {
        userId: priya._id,
        schemeId: savedSchemes[0]._id,
        status: 'rejected',
        applicationData: { landHolding: 0.2 },
        remarks: 'Land holding below minimum requirement of 0.5 acre'
      },
      {
        userId: amit._id,
        schemeId: savedSchemes[2]._id,
        status: 'submitted',
        applicationData: { age: 68, income: 85000 },
        submittedDocuments: ['aadhar.pdf', 'age_proof.pdf', 'income_certificate.pdf']
      },
      {
        userId: sneha._id,
        schemeId: savedSchemes[0]._id,
        status: 'approved',
        applicationData: { landHolding: 1.0, farmDetails: 'One plot vegetable farming' },
        submittedDocuments: ['aadhar.pdf', 'land_records.pdf', 'bank_details.pdf'],
        remarks: 'Approved for subsidy',
        approvalDate: new Date('2024-02-12')
      },
      {
        userId: officer._id,
        schemeId: savedSchemes[4]._id,
        status: 'approved',
        applicationData: { age: 42, income: 180000 },
        submittedDocuments: ['aadhar.pdf', 'bank_details.pdf'],
        remarks: 'Approved',
        approvalDate: new Date('2024-02-08')
      },
      {
        userId: rajesh._id,
        schemeId: savedSchemes[2]._id,
        status: 'submitted',
        applicationData: { age: 65, income: 70000 },
        submittedDocuments: ['aadhar.pdf', 'age_proof.pdf']
      }
    ];

    const savedApplications = await SchemeApplication.insertMany(schemeApplications);
    console.log(`✓ Created ${savedApplications.length} scheme applications`);

    // Summary
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  🎉 ALL DATA SEEDED SUCCESSFULLY! 🎉  ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('\nDatabase Summary:');
    console.log(`  • Users (users): ${(await User.countDocuments())} records`);
    console.log(`  • Certificates (certificates): ${(await Certificate.countDocuments())} records`);
    console.log(`  • Taxes (taxes): ${(await Tax.countDocuments())} records`);
    console.log(`  • Complaints (complaints): ${(await Complaint.countDocuments())} records`);
    console.log(`  • Schemes (schemes): ${(await Scheme.countDocuments())} records`);
    console.log(`  • Scheme Applications (scheme_applications): ${(await SchemeApplication.countDocuments())} records`);
    console.log(`  • Funds (funds): ${(await Fund.countDocuments())} records`);

    console.log('\n📝 Test Login Credentials:');
    console.log('  Admin: admin@panchayat.com / password: admin123');
    console.log('  Officer: officer@panchayat.com / password: password123');
    console.log('  Citizen 1: rajesh@example.com / password: password123');
    console.log('  Citizen 2: priya@example.com / password: password123');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedAllData();
