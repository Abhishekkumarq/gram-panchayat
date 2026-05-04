const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taxType: { type: String, enum: ['property', 'water'], required: true },
  amount: { type: Number, required: true },
  year: { type: Number, required: true },
  quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'] },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentDate: { type: Date },
  receiptNumber: { type: String, unique: true, sparse: true },
  propertyDetails: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tax', taxSchema);
