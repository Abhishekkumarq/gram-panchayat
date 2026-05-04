const mongoose = require('mongoose');
require('dotenv').config();

const Scheme = require('./model/scheme');
const Fund = require('./model/fund');

const schemes = [
  {
    name: "PM-KISAN",
    description: "Direct income support to farmers",
    type: "subsidy",
    eligibilityCriteria: {
      maxIncome: 200000,
      landHolding: 5
    },
    benefits: "₹6000 per year in three installments",
    applicationProcess: "Apply online through PM-KISAN portal",
    documents: ["Aadhar", "Land Records", "Bank Details"],
    isActive: true
  },
  {
    name: "Pradhan Mantri Awas Yojana",
    description: "Housing for all scheme",
    type: "subsidy",
    eligibilityCriteria: {
      maxIncome: 300000,
      categories: ["EWS", "SC", "ST", "OBC"]
    },
    benefits: "Financial assistance for house construction",
    applicationProcess: "Apply through local Panchayat office",
    documents: ["Income Certificate", "Caste Certificate", "Aadhar"],
    isActive: true
  },
  {
    name: "National Social Assistance Programme",
    description: "Pension scheme for elderly and widows",
    type: "pension",
    eligibilityCriteria: {
      maxIncome: 100000,
      minAge: 60
    },
    benefits: "Monthly pension of ₹500-2000",
    applicationProcess: "Apply at Panchayat office",
    documents: ["Age Proof", "Income Certificate", "Bank Details"],
    isActive: true
  }
];

const funds = [
  {
    ward: "Ward 1",
    year: 2024,
    category: "infrastructure",
    allocated: 500000,
    spent: 350000,
    description: "Road construction and maintenance"
  },
  {
    ward: "Ward 1",
    year: 2024,
    category: "health",
    allocated: 200000,
    spent: 150000,
    description: "Primary health center upgrades"
  },
  {
    ward: "Ward 2",
    year: 2024,
    category: "education",
    allocated: 300000,
    spent: 200000,
    description: "School building repairs"
  },
  {
    ward: "Ward 2",
    year: 2024,
    category: "sanitation",
    allocated: 250000,
    spent: 180000,
    description: "Waste management system"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Scheme.deleteMany({});
    await Fund.deleteMany({});

    await Scheme.insertMany(schemes);
    await Fund.insertMany(funds);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
