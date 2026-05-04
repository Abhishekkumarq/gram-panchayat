const SchemeApplication = require('../model/schemeApplication');
const Scheme = require('../model/scheme');
const notify = require('../utils/notify');

// Citizen applies for a scheme
exports.applyForScheme = async (req, res) => {
  try {
    const { schemeId, applicationData, submittedDocuments } = req.body;
    
    // Check if scheme exists
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    // Check if already applied
    const existingApp = await SchemeApplication.findOne({
      userId: req.user.id,
      schemeId
    });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this scheme' });
    }

    const application = new SchemeApplication({
      userId: req.user.id,
      schemeId,
      applicationData,
      submittedDocuments
    });

    await application.save();
    
    // Populate for response and broadcast
    await application.populate('userId', 'name email phone');
    await application.populate('schemeId', 'name description type');
    
    req.io.emit('application:new', application);

    await notify(req.user.id, {
      title: 'Scheme Application Submitted',
      message: `Your application for "${scheme.name}" has been submitted successfully and is pending review. You will be notified once a decision is made.`,
      type: 'scheme',
      relatedId: application._id,
      actionUrl: '/applications',
      priority: 'medium'
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Citizen views their scheme applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await SchemeApplication.find({ userId: req.user.id })
      .populate('schemeId', 'name description type')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin views all applications for a specific scheme (with pagination)
exports.getApplicationsForScheme = async (req, res) => {
  try {
    const { schemeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Get total count
    const totalCount = await SchemeApplication.countDocuments({ schemeId });
    
    // Get paginated data
    const applications = await SchemeApplication.find({ schemeId })
      .populate('userId', 'name email phone ward category income')
      .populate('schemeId', 'name description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      applications,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin views all applications across all schemes (with pagination)
exports.getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Get total count
    const totalCount = await SchemeApplication.countDocuments();
    
    // Get paginated data
    const applications = await SchemeApplication.find()
      .populate('userId', 'name email phone ward category income')
      .populate('schemeId', 'name description type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      applications,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin updates application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, remarks } = req.body;

    const application = await SchemeApplication.findByIdAndUpdate(
      applicationId,
      { 
        status, 
        remarks,
        updatedAt: new Date(),
        approvalDate: status === 'approved' ? new Date() : null
      },
      { new: true }
    ).populate('userId', 'name email').populate('schemeId', 'name');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    req.io.emit('application:updated', application);

    const schemeName = application.schemeId?.name || 'Scheme';
    if (status === 'approved') {
      await notify(application.userId._id || application.userId, {
        title: `Scheme Application Approved — ${schemeName}`,
        message: `Congratulations! Your application for "${schemeName}" has been approved.${remarks ? ` Note: ${remarks}` : ''} Benefits will be disbursed as per scheme guidelines.`,
        type: 'scheme',
        relatedId: application._id,
        actionUrl: '/applications',
        priority: 'high'
      });
    } else if (status === 'rejected') {
      await notify(application.userId._id || application.userId, {
        title: `Scheme Application Rejected — ${schemeName}`,
        message: `Your application for "${schemeName}" has been rejected.${remarks ? ` Reason: ${remarks}` : ''} Please contact the Panchayat office for assistance.`,
        type: 'scheme',
        relatedId: application._id,
        actionUrl: '/applications',
        priority: 'high'
      });
    } else if (status === 'under-review') {
      await notify(application.userId._id || application.userId, {
        title: `Application Under Review — ${schemeName}`,
        message: `Your application for "${schemeName}" is currently under review. We will notify you once a decision is made.`,
        type: 'scheme',
        relatedId: application._id,
        actionUrl: '/applications',
        priority: 'low'
      });
    }

    res.json({ message: 'Application updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
