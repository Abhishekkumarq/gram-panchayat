const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  householdId: { type: Number },
  headUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  csvUserId: { type: Number },
  wardNumber: { type: Number, required: true },
  houseType: { type: String, enum: ['Kutcha', 'Pucca', 'Semi-Pucca'], required: true },
  familySize: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Household', householdSchema);
