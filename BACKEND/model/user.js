const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'admin', 'officer'], default: 'citizen' },
  address: { type: String },
  ward: { type: String },
  aadhar: { type: String },
  income: { type: Number },
  category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS'] },
  landHolding: { type: Number },
  familySize: { type: Number },
  familyMembers: [{
    name:   { type: String },
    age:    { type: Number },
    aadhar: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
