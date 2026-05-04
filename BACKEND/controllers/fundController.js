const Fund = require('../model/fund');

exports.createFund = async (req, res) => {
  try {
    const fund = new Fund(req.body);
    await fund.save();
    res.status(201).json({ message: 'Fund allocation created', fund });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllFunds = async (req, res) => {
  try {
    const { ward, year, category } = req.query;
    const filter = {};
    if (ward) filter.ward = ward;
    if (year) filter.year = year;
    if (category) filter.category = category;

    const funds = await Fund.find(filter).sort({ createdAt: -1 });
    res.json(funds);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateFund = async (req, res) => {
  try {
    const fund = await Fund.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true }
    );
    res.json({ message: 'Fund updated', fund });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFundAnalytics = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = year ? { year: parseInt(year) } : {};
    
    const funds = await Fund.find(filter);
    
    const analytics = {
      totalAllocated: funds.reduce((sum, f) => sum + f.allocated, 0),
      totalSpent: funds.reduce((sum, f) => sum + f.spent, 0),
      byCategory: {},
      byWard: {},
      utilizationRate: 0
    };

    funds.forEach(fund => {
      if (!analytics.byCategory[fund.category]) {
        analytics.byCategory[fund.category] = { allocated: 0, spent: 0 };
      }
      analytics.byCategory[fund.category].allocated += fund.allocated;
      analytics.byCategory[fund.category].spent += fund.spent;

      if (!analytics.byWard[fund.ward]) {
        analytics.byWard[fund.ward] = { allocated: 0, spent: 0 };
      }
      analytics.byWard[fund.ward].allocated += fund.allocated;
      analytics.byWard[fund.ward].spent += fund.spent;
    });

    analytics.utilizationRate = analytics.totalAllocated > 0 
      ? ((analytics.totalSpent / analytics.totalAllocated) * 100).toFixed(2) 
      : 0;

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
