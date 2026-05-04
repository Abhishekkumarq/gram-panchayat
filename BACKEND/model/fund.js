const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  ward: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, enum: ['infrastructure', 'health', 'education', 'sanitation', 'welfare', 'other'], required: true },
  allocated: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  description: { type: String },
  projects: [{ 
    name: String, 
    amount: Number, 
    status: String,
    startDate: Date,
    endDate: Date
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fund', fundSchema);
