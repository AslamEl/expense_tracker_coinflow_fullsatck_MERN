const Income = require('../models/Income');

// @desc    Get all incomes for authenticated user
// @route   GET /api/incomes
// @access  Private
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id })
      .populate('user', 'firstName lastName username')
      .sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Create new income
// @route   POST /api/incomes
// @access  Private
const createIncome = async (req, res) => {
  try {
    const { description, amount, category, isRecurring, recurringFrequency } = req.body;

    // Validate required fields
    if (!description || !amount || !category) {
      return res.status(400).json({
        message: 'Please provide description, amount, and category'
      });
    }

    // Validate amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be a positive number'
      });
    }

    // Validate category
    const validCategories = [
      'Freelance',
      'Part-time Job',
      'Investment',
      'Bonus',
      'Gift',
      'Rental',
      'Business',
      'Dividend',
      'Interest',
      'Side Hustle',
      'Commission',
      'Royalty',
      'Other'
    ];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Category must be one of the supported income categories'
      });
    }

    // Validate recurring frequency if income is recurring
    if (isRecurring && !recurringFrequency) {
      return res.status(400).json({
        message: 'Recurring frequency is required for recurring income'
      });
    }

    const income = await Income.create({
      user: req.user._id,
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : undefined
    });

    // Populate user data for response
    await income.populate('user', 'firstName lastName username');

    res.status(201).json(income);
  } catch (error) {
    console.error('Error creating income:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!income) {
      return res.status(404).json({ message: 'Income not found or unauthorized' });
    }

    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Income not found' });
    }
    
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Get income statistics
// @route   GET /api/incomes/stats
// @access  Private
const getIncomeStats = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    
    const totalAdditionalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    const categoryTotals = incomes.reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount;
      return acc;
    }, {});

    const stats = {
      totalAdditionalIncome,
      totalIncomeEntries: incomes.length,
      categoryTotals,
      averageIncomePerEntry: incomes.length > 0 ? totalAdditionalIncome / incomes.length : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting income stats:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

module.exports = {
  getIncomes,
  createIncome,
  deleteIncome,
  getIncomeStats
};