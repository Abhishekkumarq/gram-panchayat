const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/', authenticate, authorize('admin', 'officer'), taxController.createTax);
router.post('/calculate', authenticate, taxController.calculateTax);
router.put('/:id/pay', authenticate, taxController.payTax);
router.get('/my', authenticate, taxController.getMyTaxes);
router.get('/all', authenticate, authorize('admin', 'officer'), taxController.getAllTaxes);

module.exports = router;
