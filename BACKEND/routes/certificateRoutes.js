const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/', authenticate, certificateController.applyCertificate);
router.get('/my', authenticate, certificateController.getMyCertificates);
router.get('/all', authenticate, authorize('admin', 'officer'), certificateController.getAllCertificates);
router.put('/:id', authenticate, authorize('admin', 'officer'), certificateController.updateCertificateStatus);

module.exports = router;
