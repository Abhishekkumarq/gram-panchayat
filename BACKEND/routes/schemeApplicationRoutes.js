const express = require('express');
const router = express.Router();
const schemeApplicationController = require('../controllers/schemeApplicationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Citizen routes
router.post('/', authenticate, schemeApplicationController.applyForScheme);
router.get('/my', authenticate, schemeApplicationController.getMyApplications);

// Admin routes
router.get('/all', authenticate, authorize('admin', 'officer'), schemeApplicationController.getAllApplications);
router.get('/scheme/:schemeId', authenticate, authorize('admin', 'officer'), schemeApplicationController.getApplicationsForScheme);
router.put('/:applicationId/status', authenticate, authorize('admin', 'officer'), schemeApplicationController.updateApplicationStatus);

module.exports = router;
