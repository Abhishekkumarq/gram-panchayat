const Document = require('../model/document');
const path = require('path');
const fs = require('fs');

// Upload a document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { documentType, documentNumber } = req.body;
    const userId = req.user.id;

    // Validate document type
    const validTypes = ['aadhaar', 'pan', 'voter_id', 'driving_license', 'passport', 'birth_certificate', 'income_certificate', 'caste_certificate', 'residence_certificate', 'other'];
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    if (!documentNumber || documentNumber.trim() === '') {
      return res.status(400).json({ error: 'Document number is required' });
    }

    // Create document record
    const document = new Document({
      userId,
      documentType,
      documentNumber: documentNumber.trim(),
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      status: 'pending_verification'
    });

    await document.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        _id: document._id,
        documentType: document.documentType,
        documentNumber: document.documentNumber,
        fileName: document.fileName,
        uploadedAt: document.uploadedAt,
        status: document.status
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};

// Get user's documents
exports.getMyDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await Document.find({ userId })
      .select('-filePath')
      .sort({ uploadedAt: -1 });

    res.json({
      documents,
      total: documents.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific document by ID
exports.getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check authorization
    if (document.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check authorization
    if (document.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Send file
    res.download(document.filePath, document.fileName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check authorization
    if (document.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete file from disk
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete document from database
    await Document.findByIdAndDelete(documentId);

    res.json({ 
      success: true, 
      message: 'Document deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get document by type
exports.getDocumentByType = async (req, res) => {
  try {
    const { documentType } = req.params;
    const userId = req.user.id;

    const document = await Document.findOne({ userId, documentType })
      .select('-filePath')
      .sort({ uploadedAt: -1 });

    if (!document) {
      return res.json({ document: null });
    }

    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all documents for verification
exports.adminGetAllDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', documentType = '' } = req.query;

    const query = {};
    if (status) query.status = status;
    if (documentType) query.documentType = documentType;

    const skip = (page - 1) * limit;
    const documents = await Document.find(query)
      .select('-filePath')
      .populate('userId', 'name email phone')
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments(query);

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Verify document
exports.adminVerifyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, verificationNotes } = req.body;
    const adminId = req.user.id;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const document = await Document.findByIdAndUpdate(
      documentId,
      {
        status,
        verificationNotes: verificationNotes || null,
        verifiedBy: adminId,
        verifiedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      message: `Document ${status} successfully`,
      document
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get pending documents for verification
exports.adminGetPendingDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const documents = await Document.find({ status: 'pending_verification' })
      .select('-filePath')
      .populate('userId', 'name email phone aadhar')
      .sort({ uploadedAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments({ status: 'pending_verification' });

    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get document statistics
exports.getDocumentStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = {
      total: await Document.countDocuments({ userId }),
      pending: await Document.countDocuments({ userId, status: 'pending_verification' }),
      verified: await Document.countDocuments({ userId, status: 'verified' }),
      rejected: await Document.countDocuments({ userId, status: 'rejected' })
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
