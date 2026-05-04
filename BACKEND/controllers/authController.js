const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const notify = require('../utils/notify');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, ward, aadhar, income, category, landHolding, familySize } = req.body;
    
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, email, password: hashedPassword, phone, role, address, ward, aadhar, income, category, landHolding, familySize
    });

    await user.save();

    await notify(user._id, {
      title: 'Welcome to Gram Panchayat E-Governance Portal',
      message: `Welcome, ${name}! Your citizen account has been created. You can now apply for certificates, pay taxes, register grievances, and explore government schemes.`,
      type: 'general',
      actionUrl: '/dashboard',
      priority: 'medium'
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Allow login with email OR phone number
    const user = await User.findOne(
      email.includes('@') ? { email } : { phone: email }
    );
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send scheme recommendation notification for citizens (once per day max)
    if (user.role === 'citizen') {
      try {
        const Scheme = require('../model/scheme');
        const Notification = require('../model/notification');
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentSchemeNotif = await Notification.findOne({
          userId: user._id, type: 'scheme',
          title: { $regex: /eligible/i },
          createdAt: { $gte: oneDayAgo }
        });
        if (!recentSchemeNotif) {
          const allSchemes = await Scheme.find({ isActive: true });
          const eligible = allSchemes.filter(scheme => {
            const c = scheme.eligibilityCriteria || {};
            if (c.minIncome && user.income < c.minIncome) return false;
            if (c.maxIncome && user.income > c.maxIncome) return false;
            if (c.categories?.length > 0 && !c.categories.includes(user.category)) return false;
            if (c.landHolding && user.landHolding > c.landHolding) return false;
            return true;
          });
          if (eligible.length > 0) {
            await notify(user._id, {
              title: `You are eligible for ${eligible.length} Government Scheme${eligible.length > 1 ? 's' : ''}`,
              message: `Based on your profile, you may be eligible for: ${eligible.slice(0, 3).map(s => s.name).join(', ')}${eligible.length > 3 ? `, and ${eligible.length - 3} more` : ''}. Visit the Schemes section to apply.`,
              type: 'scheme',
              actionUrl: '/schemes',
              priority: 'medium'
            });
          }
        }
      } catch (e) { /* non-critical */ }
    }

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
