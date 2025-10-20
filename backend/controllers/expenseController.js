const Expense = require('../models/Expense');

// @desc    Get all expenses for authenticated user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate('user', 'firstName lastName username')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { description, amount, category } = req.body;

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
    const validCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Travel', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Category must be one of: Food, Transport, Shopping, Bills, Education, Travel, Other'
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      description: description.trim(),
      amount: parseFloat(amount),
      category
    });

    // Populate user data for response
    await expense.populate('user', 'firstName lastName username');

    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense
};