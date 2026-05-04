const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyId: { type: Number },
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  csvOwnerId: { type: Number },
  wardNumber: { type: Number, required: true },
  landType: { type: String, required: true },
  landAreaAcres: { type: Number },
  pricePerAcre: { type: Number },
  estimatedValue: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
