/**
 * Group Controller
 * Handles all group-related operations with settlement and expense calculation
 */

const Group = require('../models/Group');
const User = require('../models/User');
const settlementService = require('../services/settlementService');
const expenseCalculator = require('../services/expenseCalculator');

/**
 * @desc    Get all groups for authenticated user
 * @route   GET /api/groups
 * @access  Private
 */
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id,
      isActive: true
    })
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    console.error('Error fetching groups:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching groups',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new group
 * @route   POST /api/groups
 * @access  Private
 */
const createGroup = async (req, res) => {
  try {
    const { name, description, currency = 'USD' } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    // Generate unique join key
    let joinKey;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      joinKey = Group.generateJoinKey();
      const existingGroup = await Group.findOne({ joinKey });
      if (!existingGroup) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate unique join key'
      });
    }

    // Create group
    const group = new Group({
      name: name.trim(),
      description: description ? description.trim() : '',
      joinKey,
      creator: req.user._id,
      currency,
      members: [{
        user: req.user._id,
        role: 'admin',
        joinedAt: new Date()
      }]
    });

    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username');

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: populatedGroup
    });
  } catch (error) {
    console.error('Error creating group:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating group',
      error: error.message
    });
  }
};

/**
 * @desc    Get specific group details with calculated balances and settlements
 * @route   GET /api/groups/:id
 * @access  Private
 */
const getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member
    const isMember = group.members.some(member =>
      member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Calculate balances using settlement service
    const groupData = {
      expenses: group.expenses,
      members: group.members
    };

    const settlement = settlementService.calculateGroupSettlement(groupData);

    res.json({
      success: true,
      data: {
        ...group.toObject(),
        balances: settlement.balances,
        settlementPlan: settlement.settlementPlan,
        totalTransactions: settlement.totalTransactions,
        totalAmount: settlement.totalAmount
      }
    });
  } catch (error) {
    console.error('Error fetching group:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching group',
      error: error.message
    });
  }
};

/**
 * @desc    Join group using join key
 * @route   POST /api/groups/join
 * @access  Private
 */
const joinGroup = async (req, res) => {
  try {
    const { joinKey } = req.body;

    if (!joinKey || joinKey.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Valid 6-character join key is required'
      });
    }

    const group = await Group.findOne({
      joinKey: joinKey.toUpperCase(),
      isActive: true
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is already a member
    const existingMember = group.members.find(member =>
      member.user.toString() === req.user._id.toString()
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    // Add user to group
    group.members.push({
      user: req.user._id,
      role: 'member',
      joinedAt: new Date()
    });

    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username');

    res.json({
      success: true,
      message: 'Successfully joined group',
      data: populatedGroup
    });
  } catch (error) {
    console.error('Error joining group:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error joining group',
      error: error.message
    });
  }
};

/**
 * @desc    Add expense to group with smart splitting
 * @route   POST /api/groups/:id/expenses
 * @access  Private
 */
const addExpense = async (req, res) => {
  try {
    const {
      description,
      amount,
      category,
      paidBy,
      splitAmong,
      splitMethod = 'equal',
      percentages,
      customAmounts,
      items,
      notes
    } = req.body;

    // Validation
    if (!description || !amount || !category || !splitAmong || splitAmong.length === 0 || !paidBy) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if requester is a member
    const isRequesterMember = group.members.some(member =>
      member.user.toString() === req.user._id.toString()
    );

    if (!isRequesterMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Validate paidBy is a group member
    const memberIds = group.members.map(member => member.user.toString());
    if (!memberIds.includes(paidBy)) {
      return res.status(400).json({
        success: false,
        message: 'paidBy must be a member of the group'
      });
    }

    // Validate all split members are group members
    const invalidMembers = splitAmong.filter(memberId => !memberIds.includes(memberId));
    if (invalidMembers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some selected members are not in this group'
      });
    }

    // Use expense calculator to validate and calculate splits
    const expenseData = {
      amount: parseFloat(amount),
      splitType: splitMethod,
      members: splitAmong,
      percentages,
      customAmounts,
      items
    };

    // Validate expense data
    const validation = expenseCalculator.validateExpenseData(expenseData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Calculate shares
    let splitDetails;
    try {
      splitDetails = expenseCalculator.calculateExpenseShares(expenseData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Error calculating expense shares'
      });
    }

    // Format split amounts for database
    const formattedSplits = splitDetails.map((share) => {
      return {
        user: share.user,
        amount: share.amount,
        percentage: share.percentage,
        isPaid: share.user === paidBy
      };
    });

    // Create expense
    const expense = {
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      paidBy,
      splitMethod,
      splitAmong: formattedSplits,
      notes: notes ? notes.trim() : '',
      date: new Date()
    };

    group.expenses.push(expense);
    group.totalExpenses = group.expenses.reduce((total, exp) => total + exp.amount, 0);

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username');

    // Calculate updated settlement
    const groupData = {
      expenses: updatedGroup.expenses,
      members: updatedGroup.members
    };

    const settlement = settlementService.calculateGroupSettlement(groupData);

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: {
        group: updatedGroup,
        balances: settlement.balances,
        settlementPlan: settlement.settlementPlan
      }
    });
  } catch (error) {
    console.error('Error adding expense:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error adding expense',
      error: error.message
    });
  }
};

/**
 * @desc    Get group balances
 * @route   GET /api/groups/:id/balances
 * @access  Private
 */
const getBalances = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'firstName lastName username');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member
    const isMember = group.members.some(member =>
      member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Calculate balances using service
    const groupData = {
      expenses: group.expenses,
      members: group.members
    };

    const settlement = settlementService.calculateGroupSettlement(groupData);

    res.json({
      success: true,
      data: {
        balances: settlement.balances,
        totalAmount: settlement.totalAmount,
        summary: {
          totalMembers: group.members.length,
          totalExpenses: group.expenses.length,
          totalAmount: settlement.totalAmount
        }
      }
    });
  } catch (error) {
    console.error('Error calculating balances:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error calculating balances',
      error: error.message
    });
  }
};

/**
 * @desc    Get settlement plan for group
 * @route   GET /api/groups/:id/settlement
 * @access  Private
 */
const getSettlement = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'firstName lastName username');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member
    const isMember = group.members.some(member =>
      member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Calculate settlement using service
    const groupData = {
      expenses: group.expenses,
      members: group.members
    };

    const settlement = settlementService.calculateGroupSettlement(groupData);

    // Format settlement for response
    const formattedSettlement = settlement.settlementPlan.map(transaction => {
      const fromUser = group.members.find(m => m.user._id.toString() === transaction.from.userId);
      const toUser = group.members.find(m => m.user._id.toString() === transaction.to.userId);

      return {
        from: {
          userId: transaction.from.userId,
          user: fromUser ? fromUser.user : null
        },
        to: {
          userId: transaction.to.userId,
          user: toUser ? toUser.user : null
        },
        amount: transaction.amount
      };
    });

    res.json({
      success: true,
      data: {
        settlements: formattedSettlement,
        totalTransactions: settlement.totalTransactions,
        totalAmount: settlement.totalAmount,
        currency: group.currency
      }
    });
  } catch (error) {
    console.error('Error calculating settlement:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error calculating settlement',
      error: error.message
    });
  }
};

/**
 * @desc    Delete expense from group
 * @route   DELETE /api/groups/:id/expenses/:expenseId
 * @access  Private
 */
const deleteExpense = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is a member
    const isMember = group.members.some(member =>
      member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Find the expense
    const expense = group.expenses.id(req.params.expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if user is the payer or admin
    const isExpensePayer = expense.paidBy.toString() === req.user._id.toString();
    const isAdmin = group.members.find(m => m.user.toString() === req.user._id.toString())?.role === 'admin';

    if (!isExpensePayer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the payer or admin can delete this expense'
      });
    }

    // Remove expense
    group.expenses.pull(req.params.expenseId);
    group.totalExpenses = group.expenses.reduce((total, exp) => total + exp.amount, 0);

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username');

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: updatedGroup
    });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
};

/**
 * @desc    Update group details
 * @route   PUT /api/groups/:id
 * @access  Private
 */
const updateGroup = async (req, res) => {
  try {
    const { name, description, currency } = req.body;

    // Populate members first to get proper user info
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'firstName lastName username');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is admin - compare user IDs properly
    const member = group.members.find(m => {
      const memberUserId = typeof m.user === 'object' ? m.user._id.toString() : m.user.toString();
      return memberUserId === req.user._id.toString();
    });

    if (!member || member.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can update group'
      });
    }

    // Validate currency if provided
    if (currency) {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'LKR'];
      if (!validCurrencies.includes(currency)) {
        return res.status(400).json({
          success: false,
          message: `Invalid currency. Supported currencies are: ${validCurrencies.join(', ')}`
        });
      }
      group.currency = currency;
    }

    if (name) group.name = name.trim();
    if (description !== undefined) group.description = description.trim();

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username');

    res.json({
      success: true,
      message: 'Group updated successfully',
      data: updatedGroup
    });
  } catch (error) {
    console.error('Error updating group:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating group',
      error: error.message
    });
  }
};

/**
 * @desc    Remove member from group
 * @route   DELETE /api/groups/:id/members/:memberId
 * @access  Private
 */
const removeMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is admin
    const adminMember = group.members.find(m =>
      m.user.toString() === req.user._id.toString() && m.role === 'admin'
    );

    if (!adminMember) {
      return res.status(403).json({
        success: false,
        message: 'Only admin can remove members'
      });
    }

    // Can't remove creator
    if (req.params.memberId === group.creator.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the group creator'
      });
    }

    // Remove member
    group.members = group.members.filter(m =>
      m.user.toString() !== req.params.memberId
    );

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username');

    res.json({
      success: true,
      message: 'Member removed successfully',
      data: updatedGroup
    });
  } catch (error) {
    console.error('Error removing member:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error removing member',
      error: error.message
    });
  }
};

/**
 * @desc    Mark settlement as received (reduces balance when money is received)
 * @route   POST /api/groups/:id/mark-settlement
 * @access  Private
 */
/**
 * @desc    Mark payment as paid (by debtor) - STEP 1
 * @route   POST /api/groups/:id/mark-payment-sent
 * @access  Private
 */
const markPaymentSent = async (req, res) => {
  try {
    const { debtorUserId, creditorUserId } = req.body;

    if (!debtorUserId || !creditorUserId) {
      return res.status(400).json({
        success: false,
        message: 'debtorUserId and creditorUserId are required'
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Only the debtor can mark payment as sent
    if (req.user._id.toString() !== debtorUserId) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark payment as sent for yourself'
      });
    }

    // Verify both users are group members
    const debtorExists = group.members.some(m => m.user.toString() === debtorUserId);
    const creditorExists = group.members.some(m => m.user.toString() === creditorUserId);

    if (!debtorExists || !creditorExists) {
      return res.status(400).json({
        success: false,
        message: 'Both debtor and creditor must be group members'
      });
    }

    // Mark all unpaid or pending splits as pending_confirmation (allows retry)
    let updatedCount = 0;

    for (const expense of group.expenses) {
      const relevantSplits = expense.splitAmong.filter(
        split => split.user.toString() === debtorUserId &&
                 expense.paidBy.toString() === creditorUserId &&
                 (split.paymentStatus === 'unpaid' || split.paymentStatus === 'pending_confirmation')
      );

      for (const split of relevantSplits) {
        split.paymentStatus = 'pending_confirmation';
        split.paymentRequestedAt = new Date();
        updatedCount++;
      }
    }

    if (updatedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'No outstanding payments found. All payments may already be confirmed.'
      });
    }

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username');

    const settlement = settlementService.calculateGroupSettlement({
      expenses: updatedGroup.expenses,
      members: updatedGroup.members
    });

    res.status(200).json({
      success: true,
      message: `Payment marked as sent to ${updatedCount} creditor(s). Awaiting confirmation.`,
      data: {
        group: updatedGroup,
        balances: settlement.balances,
        settlementPlan: settlement.settlementPlan
      }
    });
  } catch (error) {
    console.error('Error marking payment as sent:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error marking payment as sent',
      error: error.message
    });
  }
};

/**
 * @desc    Confirm payment received (by creditor) - STEP 2
 * @route   POST /api/groups/:id/mark-settlement
 * @access  Private
 */
const markSettlementReceived = async (req, res) => {
  try {
    const { debtorUserId, creditorUserId } = req.body;

    if (!debtorUserId || !creditorUserId) {
      return res.status(400).json({
        success: false,
        message: 'debtorUserId and creditorUserId are required'
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Only the creditor can confirm payment received
    if (req.user._id.toString() !== creditorUserId) {
      return res.status(403).json({
        success: false,
        message: 'You can only confirm payment for yourself as creditor'
      });
    }

    // Verify both users are group members
    const debtorExists = group.members.some(m => m.user.toString() === debtorUserId);
    const creditorExists = group.members.some(m => m.user.toString() === creditorUserId);

    if (!debtorExists || !creditorExists) {
      return res.status(400).json({
        success: false,
        message: 'Both debtor and creditor must be group members'
      });
    }

    // Mark all pending_confirmation splits as paid
    let settledCount = 0;
    let totalSettled = 0;

    for (const expense of group.expenses) {
      // Find splits where debtor is the one who owes to creditor and payment is pending
      const relevantSplits = expense.splitAmong.filter(
        split => split.user.toString() === debtorUserId &&
                 expense.paidBy.toString() === creditorUserId &&
                 split.paymentStatus === 'pending_confirmation'
      );

      for (const split of relevantSplits) {
        split.isPaid = true;
        split.paymentStatus = 'paid';
        settledCount++;
        totalSettled += split.amount;
      }
    }

    if (settledCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'No pending payments found to confirm'
      });
    }

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username');

    // Calculate updated settlement
    const groupData = {
      expenses: updatedGroup.expenses,
      members: updatedGroup.members
    };

    const settlement = settlementService.calculateGroupSettlement(groupData);

    res.json({
      success: true,
      message: 'Settlement marked as received',
      data: {
        group: updatedGroup,
        balances: settlement.balances,
        settlementPlan: settlement.settlementPlan
      }
    });
  } catch (error) {
    console.error('Error marking settlement received:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error marking settlement received',
      error: error.message
    });
  }
};

const disputePayment = async (req, res) => {
  try {
    const { debtorUserId, creditorUserId } = req.body;

    if (!debtorUserId || !creditorUserId) {
      return res.status(400).json({
        success: false,
        message: 'debtorUserId and creditorUserId are required'
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Only the creditor can dispute payment
    if (req.user._id.toString() !== creditorUserId) {
      return res.status(403).json({
        success: false,
        message: 'You can only dispute payment for yourself as creditor'
      });
    }

    // Verify both users are group members
    const debtorExists = group.members.some(m => m.user.toString() === debtorUserId);
    const creditorExists = group.members.some(m => m.user.toString() === creditorUserId);

    if (!debtorExists || !creditorExists) {
      return res.status(400).json({
        success: false,
        message: 'Both debtor and creditor must be group members'
      });
    }

    // Reset all pending_confirmation splits back to unpaid
    let resetCount = 0;
    let totalReset = 0;

    for (const expense of group.expenses) {
      // Find splits where debtor is the one who owes to creditor and payment is pending
      const relevantSplits = expense.splitAmong.filter(
        split => split.user.toString() === debtorUserId &&
                 expense.paidBy.toString() === creditorUserId &&
                 split.paymentStatus === 'pending_confirmation'
      );

      for (const split of relevantSplits) {
        split.isPaid = false;
        split.paymentStatus = 'unpaid';
        resetCount++;
        totalReset += split.amount;
      }
    }

    if (resetCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'No pending payments found to dispute'
      });
    }

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate('creator', 'firstName lastName username')
      .populate('members.user', 'firstName lastName username')
      .populate('expenses.paidBy', 'firstName lastName username')
      .populate('expenses.splitAmong.user', 'firstName lastName username');

    // Calculate updated settlement
    const groupData = {
      expenses: updatedGroup.expenses,
      members: updatedGroup.members
    };

    const settlement = settlementService.calculateGroupSettlement(groupData);

    res.json({
      success: true,
      message: 'Payment disputed and reset to unpaid status',
      data: {
        group: updatedGroup,
        balances: settlement.balances,
        settlementPlan: settlement.settlementPlan
      }
    });
  } catch (error) {
    console.error('Error disputing payment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error disputing payment',
      error: error.message
    });
  }
};

/**
 * @desc    Delete group permanently with all expenses
 * @route   DELETE /api/groups/:id
 * @access  Private (Admin only)
 */
const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Validate group exists
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Check if user is admin of the group
    const isAdmin = group.members.some(m =>
      m.user.toString() === req.user._id.toString() && m.role === 'admin'
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only group admin can delete the group'
      });
    }

    // Get group details before deletion (for logging/audit purposes)
    const expenseCount = group.expenses.length;
    const memberCount = group.members.length;

    // Delete all expenses and group data in one atomic operation
    await Group.findByIdAndDelete(groupId);

    res.json({
      success: true,
      message: 'Group and all associated data deleted successfully',
      data: {
        groupId: groupId,
        groupName: group.name,
        expensesDeleted: expenseCount,
        membersRemoved: memberCount,
        deletedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error deleting group:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting group',
      error: error.message
    });
  }
};

/**
 * @desc    Generate PDF report for group
 * @route   GET /api/groups/:id/pdf
 * @access  Private
 */
const generateGroupPDF = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const PDFDocument = require('pdfkit');

    // Fetch raw group data (no population) to avoid Mongoose/serialization issues
    const groupData = await Group.findById(groupId);
    
    if (!groupData) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Verify user is member of group
    const isMember = groupData.members.some(m =>
      m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this group'
      });
    }

    // Fetch populated data for display purposes and settlement calculation
    const group = await Group.findById(groupId)
      .populate('creator', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email')
      .populate('expenses.paidBy', 'firstName lastName email')
      .populate('expenses.splitAmong.user', 'firstName lastName email');

    // Build clean expense array for settlement calculation
    // This ensures we get plain data structures without Mongoose serialization issues
    const cleanExpenses = groupData.expenses.map(expense => ({
      _id: expense._id,
      amount: expense.amount,
      paidBy: expense.paidBy,
      splitAmong: expense.splitAmong.map(split => ({
        user: split.user,
        amount: split.amount,
        isPaid: split.isPaid,
        paymentStatus: split.paymentStatus
      }))
    }));

    // Build clean members array
    const cleanMembers = groupData.members.map(member => ({
      user: {
        _id: member.user,
        firstName: group.members.find(m => m.user._id.toString() === member.user.toString())?.user?.firstName || '',
        lastName: group.members.find(m => m.user._id.toString() === member.user.toString())?.user?.lastName || '',
        email: group.members.find(m => m.user._id.toString() === member.user.toString())?.user?.email || ''
      },
      role: member.role
    }));

    // Calculate balances and settlement plan with clean data
    const settlementData = settlementService.calculateGroupSettlement({
      expenses: cleanExpenses,
      members: cleanMembers
    });
    
    const balances = settlementData.balances || [];
    const settlementPlan = settlementData.settlementPlan || [];

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      bufferPages: false
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    const fileName = `${group.name.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Colors (RGB arrays for PDFKit)
    const colors = {
      primary: [99, 102, 241],
      secondary: [168, 85, 247],
      gray: [107, 114, 128]
    };

    // Title
    doc.fontSize(20)
      .font('Helvetica-Bold')
      .fillColor(...colors.primary)
      .text(group.name, { align: 'center' })
      .moveDown(0.2);

    doc.fontSize(11)
      .fillColor(...colors.gray)
      .text('Expense Report', { align: 'center' })
      .moveDown(0.5);

    // Metadata
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    doc.fontSize(9)
      .fillColor(...colors.gray)
      .font('Helvetica')
      .text(`Generated: ${reportDate} | Share Key: ${group.joinKey || 'N/A'}`, { align: 'center' })
      .moveDown(0.8);

    // Divider line
    doc.strokeColor(...colors.primary)
      .lineWidth(0.5)
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke()
      .moveDown(0.5);

    // Section 1: Overview
    doc.fontSize(13)
      .font('Helvetica-Bold')
      .fillColor(...colors.primary)
      .text('Overview', 40, doc.y)
      .moveDown(0.3);

    const totalAmount = group.expenses.reduce((sum, e) => sum + e.amount, 0);
    doc.fontSize(10)
      .fillColor(0, 0, 0)
      .font('Helvetica');
    
    doc.text(`Members: ${group.members.length}`, 50);
    doc.text(`Expenses: ${group.expenses.length}`, 50);
    doc.text(`Total: ${group.currency} ${totalAmount.toFixed(2)}`, 50);
    doc.moveDown(0.5);

    // Section 2: Members
    doc.fontSize(13)
      .font('Helvetica-Bold')
      .fillColor(...colors.primary)
      .text('Members', 40, doc.y)
      .moveDown(0.3);

    doc.fontSize(9)
      .fillColor(0, 0, 0)
      .font('Helvetica');

    group.members.forEach((member, idx) => {
      const userName = member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unknown';
      const joinDate = new Date(member.joinedAt).toLocaleDateString();
      doc.text(`${idx + 1}. ${userName} (${member.role}) - ${joinDate}`, 50);
    });
    doc.moveDown(0.5);

    // Section 3: Balances
    doc.fontSize(13)
      .font('Helvetica-Bold')
      .fillColor(...colors.primary)
      .text('Balances', 40, doc.y)
      .moveDown(0.3);

    doc.fontSize(9)
      .fillColor(0, 0, 0)
      .font('Helvetica');

    doc.fontSize(9)
      .fillColor(0, 0, 0)
      .font('Helvetica');

    if (balances && Array.isArray(balances) && balances.length > 0) {
      balances.forEach((balance) => {
        let userName = 'Unknown';
        
        // Handle different user object formats
        if (balance.user) {
          if (typeof balance.user === 'string') {
            userName = balance.user;
          } else if (balance.user.firstName && balance.user.lastName) {
            userName = `${balance.user.firstName} ${balance.user.lastName}`;
          } else if (balance.user.firstName) {
            userName = balance.user.firstName;
          }
        }
        
        const status = balance.netBalance > 0 ? 'owed' : balance.netBalance < 0 ? 'owes' : 'settled';
        const amount = Math.abs(balance.netBalance).toFixed(2);
        doc.text(`${userName}: ${group.currency} ${amount} (${status})`, 50);
      });
    } else {
      // Show all members as settled if no outstanding balances
      doc.fillColor(...colors.gray).text('All members are settled', 50);
    }
    doc.moveDown(0.5);

    // Section 4: Expenses
    if (group.expenses.length > 0) {
      doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(...colors.primary)
        .text('Expenses', 40, doc.y)
        .moveDown(0.3);

      doc.fontSize(9)
        .fillColor(0, 0, 0)
        .font('Helvetica');

      group.expenses.forEach((expense, idx) => {
        const paidByName = expense.paidBy ? `${expense.paidBy.firstName} ${expense.paidBy.lastName}` : 'Unknown';
        const expenseDate = new Date(expense.date).toLocaleDateString();

        doc.fontSize(10)
          .font('Helvetica-Bold')
          .fillColor(...colors.secondary)
          .text(`${idx + 1}. ${expense.description}`, 50, doc.y);

        doc.fontSize(9)
          .fillColor(0, 0, 0)
          .font('Helvetica')
          .text(`Amount: ${group.currency} ${expense.amount.toFixed(2)} | Paid by: ${paidByName}`, 60);

        doc.text(`Date: ${expenseDate} | Split: ${expense.splitMethod}`, 60);

        if (expense.splitAmong && expense.splitAmong.length > 0) {
          doc.fontSize(8)
            .fillColor(...colors.gray);
          expense.splitAmong.forEach(split => {
            const splitUser = split.user ? `${split.user.firstName} ${split.user.lastName}` : 'Unknown';
            doc.text(`- ${splitUser}: ${group.currency} ${split.amount.toFixed(2)}`, 70);
          });
        }
        doc.moveDown(0.3);
      });
    }

    // Section 5: Settlement Plan
    doc.fontSize(13)
      .font('Helvetica-Bold')
      .fillColor(...colors.primary)
      .text('Settlement Plan', 40, doc.y)
      .moveDown(0.3);

    doc.fontSize(9)
      .fillColor(0, 0, 0)
      .font('Helvetica');

    if (settlementPlan && settlementPlan.length > 0) {
      settlementPlan.forEach((settlement, idx) => {
        const fromName = settlement.from.user ? `${settlement.from.user.firstName} ${settlement.from.user.lastName}` : 'Unknown';
        const toName = settlement.to.user ? `${settlement.to.user.firstName} ${settlement.to.user.lastName}` : 'Unknown';
        doc.text(`${idx + 1}. ${fromName} pays ${group.currency} ${settlement.amount.toFixed(2)} to ${toName}`, 50);
      });
    } else {
      doc.fillColor(...colors.gray).text('No settlements needed - all balances are settled', 50);
    }
    doc.moveDown(0.5);

    doc.moveDown(1);

    // Footer
    doc.fontSize(8)
      .fillColor(...colors.gray)
      .font('Helvetica-Oblique')
      .text('Generated by Expense Tracker Application', { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error generating PDF',
        error: error.message
      });
    }
  }
};

module.exports = {
  getGroups,
  createGroup,
  getGroupDetails,
  joinGroup,
  addExpense,
  getBalances,
  getSettlement,
  deleteExpense,
  updateGroup,
  removeMember,
  markPaymentSent,
  markSettlementReceived,
  disputePayment,
  deleteGroup,
  generateGroupPDF
};
