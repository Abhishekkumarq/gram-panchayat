const mongoose = require('mongoose');

const schemeApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  status: { type: String, enum: ['submitted', 'under-review', 'approved', 'rejected'], default: 'submitted' },
  applicationData: { type: Object },
  submittedDocuments: [{ type: String }],
  remarks: { type: String },
  approvalDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SchemeApplication', schemeApplicationSchema, 'scheme_applications');
