const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['subsidy', 'loan', 'welfare', 'pension', 'insurance', 'scholarship', 'employment'], required: true },
  eligibilityCriteria: {
    minIncome: { type: Number },
    maxIncome: { type: Number },
    categories: [{ type: String }],
    minAge: { type: Number },
    maxAge: { type: Number },
    landHolding: { type: Number },
    gender: { type: String },
    requirement: { type: String },
    loanLimit: { type: Number },
    minEducationClass: { type: Number }
  },
  benefits: { type: String },
  applicationProcess: { type: String },
  documents: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', schemeSchema);
