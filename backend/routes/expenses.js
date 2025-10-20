const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getExpenses,
  createExpense,
  deleteExpense
} = require('../controllers/expenseController');

// All expense routes require authentication
router.use(authenticateToken);

// @route  GET /api/expenses
router.get('/', getExpenses);

// @route  POST /api/expenses
router.post('/', createExpense);

// @route  DELETE /api/expenses/:id
router.delete('/:id', deleteExpense);

module.exports = router;