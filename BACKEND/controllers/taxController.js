const Tax = require('../model/tax');

exports.createTax = async (req, res) => {
  try {
    const { taxType, amount, year, quarter, propertyDetails } = req.body;
    const tax = new Tax({
      userId: req.user.id,
      taxType,
      amount,
      year,
      quarter,
      propertyDetails
    });
    await tax.save();
    res.status(201).json({ message: 'Tax record created', tax });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.payTax = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);
    
    if (!tax) {
      return res.status(404).json({ message: 'Tax record not found' });
    }

    if (tax.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    tax.status = 'paid';
    tax.paymentDate = new Date();
    tax.receiptNumber = `RCP-${Date.now()}`;
    
    await tax.save();
    res.json({ message: 'Tax paid successfully', tax });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(taxes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(taxes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.calculateTax = async (req, res) => {
  try {
    const { taxType, propertyArea, propertyType } = req.body;
    let amount = 0;

    if (taxType === 'property') {
      const rates = { residential: 5, commercial: 10, industrial: 15 };
      amount = propertyArea * (rates[propertyType] || 5);
    } else if (taxType === 'water') {
      amount = 500; // Flat rate
    }

    res.json({ amount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
