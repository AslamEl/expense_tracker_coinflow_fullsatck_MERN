const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense
} = require('../controllers/expenseController');

// All expense routes require authentication
router.use(authenticateToken);

// @route  GET /api/expenses
router.get('/', getExpenses);

// @route  POST /api/expenses
router.post('/', createExpense);

// @route  PUT /api/expenses/:id
router.put('/:id', updateExpense);

// @route  DELETE /api/expenses/:id
router.delete('/:id', deleteExpense);

module.exports = router;