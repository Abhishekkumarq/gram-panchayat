const express = require('express');
const router = express.Router();
const { authenticate: authMiddleware } = require('../middleware/authMiddleware');
const { upload } = require('../config/multerConfig');
const documentController = require('../controllers/documentController');

// User routes (protected)
// Upload a document
router.post(
  '/upload',
  authMiddleware,
  upload.single('document'),
  documentController.uploadDocument
);

// Get user's documents
router.get('/my', authMiddleware, documentController.getMyDocuments);

// Get document statistics
router.get('/stats', authMiddleware, documentController.getDocumentStats);

// Get document by type
router.get('/type/:documentType', authMiddleware, documentController.getDocumentByType);

// Get specific document
router.get('/:documentId', authMiddleware, documentController.getDocument);

// Download document
router.get('/:documentId/download', authMiddleware, documentController.downloadDocument);

// Delete document
router.delete('/:documentId', authMiddleware, documentController.deleteDocument);

// Admin routes (protected + admin check)
// Get all documents for admin (with filters)
router.get(
  '/admin/all',
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  },
  documentController.adminGetAllDocuments
);

// Get pending documents for verification
router.get(
  '/admin/pending',
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  },
  documentController.adminGetPendingDocuments
);

// Verify/Reject document
router.put(
  '/:documentId/verify',
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  },
  documentController.adminVerifyDocument
);

module.exports = router;
