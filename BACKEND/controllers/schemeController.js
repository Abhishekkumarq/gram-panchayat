const Scheme = require('../model/scheme');
const User = require('../model/user');

// Data-driven scheme recommender using association rules
exports.getRecommendedSchemes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const allSchemes = await Scheme.find({ isActive: true });
    
    const recommendedSchemes = allSchemes.filter(scheme => {
      const criteria = scheme.eligibilityCriteria;
      
      // Income check
      if (criteria.minIncome && user.income < criteria.minIncome) return false;
      if (criteria.maxIncome && user.income > criteria.maxIncome) return false;
      
      // Category check
      if (criteria.categories && criteria.categories.length > 0) {
        if (!criteria.categories.includes(user.category)) return false;
      }
      
      // Land holding check
      if (criteria.landHolding && user.landHolding > criteria.landHolding) return false;
      
      return true;
    });

    res.json(recommendedSchemes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createScheme = async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json({ message: 'Scheme created', scheme });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Scheme updated', scheme });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteScheme = async (req, res) => {
  try {
    await Scheme.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Scheme deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
