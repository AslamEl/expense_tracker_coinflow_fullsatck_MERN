const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const groupController = require('../controllers/groupController');

// All group routes require authentication
router.use(authenticateToken);

// @route   GET /api/groups
// @desc    Get all groups for the authenticated user
// @access  Private
router.get('/', groupController.getGroups);

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post('/', groupController.createGroup);

// @route   POST /api/groups/join
// @desc    Join a group using join key
// @access  Private
router.post('/join', groupController.joinGroup);

// Specific routes BEFORE :id routes to prevent route matching issues
// @route   GET /api/groups/:id/balances
// @desc    Get balance calculations for group
// @access  Private
router.get('/:id/balances', groupController.getBalances);

// @route   GET /api/groups/:id/settlement
// @desc    Get optimal settlement plan for group
// @access  Private
router.get('/:id/settlement', groupController.getSettlement);

// @route   POST /api/groups/:id/mark-settlement
// @desc    Mark a settlement as received to reduce owed balance
// @access  Private
router.post('/:id/mark-settlement', groupController.markSettlementReceived);

// @route   POST /api/groups/:id/dispute-payment
// @desc    Dispute a pending payment and reset it to unpaid
// @access  Private
router.post('/:id/dispute-payment', groupController.disputePayment);

// @route   POST /api/groups/:id/mark-payment-sent
// @desc    Mark payment as sent (debtor initiates) - Step 1
// @access  Private
router.post('/:id/mark-payment-sent', groupController.markPaymentSent);

// @route   GET /api/groups/:id/pdf
// @desc    Generate and download PDF report for group
// @access  Private
router.get('/:id/pdf', groupController.generateGroupPDF);

// @route   DELETE /api/groups/:id/expenses/:expenseId
// @desc    Delete expense from group
// @access  Private
router.delete('/:id/expenses/:expenseId', groupController.deleteExpense);

// @route   PUT /api/groups/:id
// @desc    Update group details (admin only)
// @access  Private
router.put('/:id', groupController.updateGroup);

// @route   DELETE /api/groups/:id/members/:memberId
// @desc    Remove member from group (admin only)
// @access  Private
router.delete('/:id/members/:memberId', groupController.removeMember);

// @route   DELETE /api/groups/:id
// @desc    Delete group permanently (admin only)
// @access  Private
router.delete('/:id', groupController.deleteGroup);

// General :id route LAST
// @route   GET /api/groups/:id
// @desc    Get specific group details
// @access  Private
router.get('/:id', groupController.getGroupDetails);

// @route   POST /api/groups/:id/expenses
// @desc    Add expense to group with advanced splitting methods
// @access  Private
router.post('/:id/expenses', groupController.addExpense);

module.exports = router;