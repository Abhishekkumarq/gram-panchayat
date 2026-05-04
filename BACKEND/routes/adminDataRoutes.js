const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const User = require('../model/user');
const Certificate = require('../model/certificate');
const GramSabha = require('../model/gramSabha');
const Household = require('../model/household');
const Property = require('../model/property');
const Complaint = require('../model/complaint');
const Tax = require('../model/tax');
const Fund = require('../model/fund');
const Scheme = require('../model/scheme');
const SchemeApplication = require('../model/schemeApplication');

const adminOnly = [authenticate, authorize('admin', 'officer')];

// Citizens
router.get('/citizens', ...adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'citizen' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Death certificates
router.get('/death-certificates', ...adminOnly, async (req, res) => {
  try {
    const certs = await Certificate.find({ type: 'death' }).populate('userId', 'name email phone ward').sort({ createdAt: -1 });
    res.json(certs);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Gram Sabha meetings
router.get('/gram-sabha', ...adminOnly, async (req, res) => {
  try {
    const meetings = await GramSabha.find({}).sort({ meetingDate: -1 });
    res.json(meetings);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Households
router.get('/households', ...adminOnly, async (req, res) => {
  try {
    const hh = await Household.find({}).populate('headUserId', 'name email phone').sort({ wardNumber: 1 });
    res.json(hh);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Properties
router.get('/properties', ...adminOnly, async (req, res) => {
  try {
    const props = await Property.find({}).populate('ownerUserId', 'name email phone').sort({ wardNumber: 1 });
    res.json(props);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Dashboard stats (all counts)
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [citizens, birthCerts, deathCerts, complaints, taxes, funds, schemes, applications, meetings, households, properties] = await Promise.all([
      User.countDocuments({ role: 'citizen' }),
      Certificate.countDocuments({ type: 'birth' }),
      Certificate.countDocuments({ type: 'death' }),
      Complaint.countDocuments(),
      Tax.countDocuments(),
      Fund.countDocuments(),
      Scheme.countDocuments(),
      SchemeApplication.countDocuments(),
      GramSabha.countDocuments(),
      Household.countDocuments(),
      Property.countDocuments()
    ]);
    const taxRevenue = await Tax.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    res.json({
      citizens, birthCerts, deathCerts, complaints, taxes,
      funds, schemes, applications, meetings, households, properties,
      taxRevenue: taxRevenue[0]?.total || 0
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update gram sabha status
router.put('/gram-sabha/:id', ...adminOnly, async (req, res) => {
  try {
    const meeting = await GramSabha.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meeting);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update death certificate status
router.put('/death-certificates/:id', ...adminOnly, async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cert);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
