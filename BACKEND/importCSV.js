const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

// Import your models
const User = require('./model/user');
const Certificate = require('./model/certificate');
const Tax = require('./model/tax');
const Complaint = require('./model/complaint');
const Scheme = require('./model/scheme');
const Fund = require('./model/fund');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to import CSV
async function importCSV(filePath, Model, transformFunction) {
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const transformedData = transformFunction ? transformFunction(data) : data;
        results.push(transformedData);
      })
      .on('end', async () => {
        try {
          await Model.insertMany(results);
          console.log(`✓ Imported ${results.length} records from ${filePath}`);
          resolve();
        } catch (err) {
          console.error(`✗ Error importing ${filePath}:`, err.message);
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error(`✗ Error reading ${filePath}:`, err.message);
        reject(err);
      });
  });
}

// Main import function
async function importAllData() {
  try {
    // Add CSV import logic here
    // Structure: await importCSV(filePath, Model, rowTransformer)
    process.exit(0);
  } catch (err) {
    console.error('\n✗ Import failed:', err);
    process.exit(1);
  }
}

// Run the import
importAllData();
