const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/recommended', authenticate, schemeController.getRecommendedSchemes);
router.get('/', schemeController.getAllSchemes);
router.post('/', authenticate, authorize('admin'), schemeController.createScheme);
router.put('/:id', authenticate, authorize('admin'), schemeController.updateScheme);
router.delete('/:id', authenticate, authorize('admin'), schemeController.deleteScheme);

module.exports = router;
