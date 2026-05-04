const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/', authenticate, complaintController.createComplaint);
router.get('/my', authenticate, complaintController.getMyComplaints);
router.get('/all', authenticate, authorize('admin', 'officer'), complaintController.getAllComplaints);
router.put('/:id', authenticate, authorize('admin', 'officer'), complaintController.updateComplaint);

module.exports = router;
