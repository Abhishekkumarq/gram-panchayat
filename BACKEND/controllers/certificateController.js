const Certificate = require('../model/certificate');
const notify = require('../utils/notify');

exports.applyCertificate = async (req, res) => {
  try {
    const { type, applicationData } = req.body;
    const certificate = new Certificate({
      userId: req.user.id,
      type,
      applicationData
    });
    await certificate.save();

    const typeName = type.charAt(0).toUpperCase() + type.slice(1);
    await notify(req.user.id, {
      title: `${typeName} Certificate Application Submitted`,
      message: `Your application for ${typeName} Certificate has been received and is pending review. Reference: CERT-${certificate._id.toString().slice(-6).toUpperCase()}`,
      type: 'certificate',
      relatedId: certificate._id,
      actionUrl: '/applications',
      priority: 'medium'
    });

    res.status(201).json({ message: 'Certificate application submitted', certificate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCertificateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const certificate = await Certificate.findById(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.status = status;
    certificate.remarks = remarks;
    
    if (status === 'approved') {
      certificate.certificateNumber = `CERT-${Date.now()}`;
      certificate.issuedDate = new Date();
    }

    await certificate.save();

    const typeName = certificate.type.charAt(0).toUpperCase() + certificate.type.slice(1);
    if (status === 'approved') {
      await notify(certificate.userId, {
        title: `${typeName} Certificate Approved`,
        message: `Your ${typeName} Certificate application has been approved. Certificate No.: ${certificate.certificateNumber}. You can download it from My Applications.`,
        type: 'certificate',
        relatedId: certificate._id,
        actionUrl: '/applications',
        priority: 'high'
      });
    } else if (status === 'rejected') {
      await notify(certificate.userId, {
        title: `${typeName} Certificate Application Rejected`,
        message: `Your ${typeName} Certificate application has been rejected.${remarks ? ` Reason: ${remarks}` : ''} You may reapply with correct documents.`,
        type: 'certificate',
        relatedId: certificate._id,
        actionUrl: '/applications',
        priority: 'high'
      });
    } else {
      await notify(certificate.userId, {
        title: `${typeName} Certificate Status Updated`,
        message: `Your ${typeName} Certificate application status has been updated to: ${status}.`,
        type: 'certificate',
        relatedId: certificate._id,
        actionUrl: '/applications',
        priority: 'medium'
      });
    }

    res.json({ message: 'Certificate updated', certificate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
