const mongoose = require('mongoose');

const gramSabhaSchema = new mongoose.Schema({
  meetingId: { type: Number },
  wardNumber: { type: Number, required: true },
  meetingTitle: { type: String, required: true },
  meetingDate: { type: Date, required: true },
  meetingLocation: { type: String, default: 'Gram Panchayat Hall' },
  agenda: { type: String },
  meetingDurationMinutes: { type: Number },
  status: { type: String, enum: ['Completed', 'Ongoing', 'Scheduled'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GramSabha', gramSabhaSchema);
