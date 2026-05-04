const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fundController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/', authenticate, authorize('admin'), fundController.createFund);
router.get('/', fundController.getAllFunds);
router.get('/analytics', fundController.getFundAnalytics);
router.put('/:id', authenticate, authorize('admin'), fundController.updateFund);

module.exports = router;
