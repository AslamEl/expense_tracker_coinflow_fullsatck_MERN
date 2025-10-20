const express = require('express');
const router = express.Router();
const { getIncomes, createIncome, deleteIncome, getIncomeStats } = require('../controllers/incomeController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

// @route   GET /api/incomes
// @desc    Get all incomes for the authenticated user
// @access  Private
router.get('/', getIncomes);

// @route   POST /api/incomes
// @desc    Create a new income
// @access  Private
router.post('/', createIncome);

// @route   GET /api/incomes/stats
// @desc    Get income statistics
// @access  Private
router.get('/stats', getIncomeStats);

// @route   DELETE /api/incomes/:id
// @desc    Delete an income
// @access  Private
router.delete('/:id', deleteIncome);

module.exports = router;