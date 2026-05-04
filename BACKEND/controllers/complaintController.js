const Complaint = require('../model/complaint');
const User = require('../model/user');
const notify = require('../utils/notify');

// Smart routing based on category
const routeComplaint = (category) => {
  const routing = {
    water: { department: 'Water Supply', priority: 'high' },
    electricity: { department: 'Electricity Board', priority: 'high' },
    road: { department: 'Public Works', priority: 'medium' },
    sanitation: { department: 'Sanitation', priority: 'high' },
    health: { department: 'Health Services', priority: 'high' },
    education: { department: 'Education', priority: 'medium' },
    other: { department: 'General Administration', priority: 'low' }
  };
  return routing[category] || routing.other;
};

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, attachments } = req.body;
    
    const routing = routeComplaint(category);
    
    const complaint = new Complaint({
      userId: req.user.id,
      title,
      description,
      category,
      location,
      attachments,
      department: routing.department,
      priority: routing.priority
    });

    await complaint.save();

    await notify(req.user.id, {
      title: 'Grievance Registered Successfully',
      message: `Your grievance "${title}" has been registered and routed to ${routing.department}. Priority: ${routing.priority.toUpperCase()}. We will update you on the progress.`,
      type: 'complaint',
      relatedId: complaint._id,
      actionUrl: '/complaints',
      priority: routing.priority === 'high' ? 'high' : 'medium'
    });

    res.status(201).json({ message: 'Complaint registered and routed', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { status, assignedTo, resolution } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (resolution) complaint.resolution = resolution;
    complaint.updatedAt = new Date();
    await complaint.save();

    const statusMessages = {
      resolved:    `Your grievance "${complaint.title}" has been resolved.${resolution ? ` Resolution: ${resolution}` : ''} Thank you for your patience.`,
      'in-progress': `Your grievance "${complaint.title}" is now being actively worked on by ${complaint.department}.`,
      'under-review': `Your grievance "${complaint.title}" is under review by ${complaint.department}.`,
      closed:      `Your grievance "${complaint.title}" has been closed.${resolution ? ` Note: ${resolution}` : ''}`
    };

    if (status && statusMessages[status]) {
      await notify(complaint.userId, {
        title: `Grievance ${status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
        message: statusMessages[status],
        type: 'complaint',
        relatedId: complaint._id,
        actionUrl: '/complaints',
        priority: status === 'resolved' ? 'high' : 'medium'
      });
    }

    res.json({ message: 'Complaint updated', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
