const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId_documentType_timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${req.user.id}_${name}_${uniqueSuffix}${ext}`);
  }
});

// File filter for allowed document types
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  // Allowed MIME types
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`), false);
  }

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Only images and documents allowed`), false);
  }

  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Accepted document types
const ACCEPTED_DOCUMENTS = {
  aadhaar: { label: 'Aadhaar Card', required: false },
  pan: { label: 'PAN Card', required: false },
  voter_id: { label: 'Voter ID', required: false },
  driving_license: { label: 'Driving License', required: false },
  passport: { label: 'Passport', required: false },
  birth_certificate: { label: 'Birth Certificate', required: false },
  income_certificate: { label: 'Income Certificate', required: false },
  caste_certificate: { label: 'Caste Certificate', required: false },
  residence_certificate: { label: 'Residence Certificate', required: false },
  other: { label: 'Other Document', required: false }
};

module.exports = {
  upload: upload,
  uploadsDir: uploadsDir,
  ACCEPTED_DOCUMENTS: ACCEPTED_DOCUMENTS
};
