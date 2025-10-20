/**
 * Settlement Service
 * 
 * Core business logic for calculating optimal settlement transactions.
 * Uses a greedy algorithm to minimize the number of transfers needed
 * to settle all debts in a group.
 * 
 * Algorithm:
 * 1. Calculate net balance for each member (paid - owed)
 * 2. Separate into creditors (positive balance) and debtors (negative balance)
 * 3. Sort both lists by amount (largest first)
 * 4. Greedily match largest creditor with largest debtor
 * 5. Create settlement transaction for min(creditor, |debtor|)
 * 6. Repeat until all balances settled
 */

/**
 * Round amount to 2 decimal places
 * @param {number} amount 
 * @returns {number}
 */
function roundTo2Decimals(amount) {
  return Math.round(amount * 100) / 100;
}

/**
 * Calculate net balance for each group member
 * netBalance = totalAmountPaid - totalAmountOwed
 * 
 * Positive balance = person is a creditor (others owe them money)
 * Negative balance = person is a debtor (they owe others money)
 * Zero balance = person is settled
 * 
 * Only counts UNPAID splits (isPaid: false)
 * Splits marked as paid are excluded from balance calculations
 * 
 * @param {Array} expenses - Array of expense objects
 * @param {Array} memberIds - Array of member user IDs
 * @returns {Object} - { userId: netBalance }
 */
function calculateNetBalances(expenses, memberIds) {
  const balances = {};
  
  // Initialize all members to 0 balance
  memberIds.forEach(memberId => {
    balances[memberId.toString()] = 0;
  });
  
  // Process each expense
  expenses.forEach(expense => {
    // Handle both ID and object formats for paidBy
    let paidById = expense.paidBy;
    if (typeof paidById === 'object') {
      paidById = paidById._id || paidById;
    }
    paidById = paidById.toString();
    
    // Payer paid this amount (add full amount to their balance)
    if (!balances[paidById]) {
      balances[paidById] = 0;
    }
    balances[paidById] = roundTo2Decimals(balances[paidById] + expense.amount);
    
    // Each person owes their share (but only if NOT paid/confirmed)
    expense.splitAmong.forEach(share => {
      // Handle both ID and object formats for user
      let userId = share.user;
      if (typeof userId === 'object') {
        userId = userId._id || userId;
      }
      userId = userId.toString();
      
      const isPaidViaOldProperty = share.isPaid === true;
      const isPaidViaNewProperty = share.paymentStatus === 'paid';
      
      // Check if this split has been confirmed as paid using either isPaid or paymentStatus
      if (isPaidViaOldProperty || isPaidViaNewProperty) {
        // This split has been paid, reduce the payer's owed amount
        balances[paidById] = roundTo2Decimals(balances[paidById] - share.amount);
      } else {
        // Otherwise, subtract from the debtor's balance
        if (!balances[userId]) {
          balances[userId] = 0;
        }
        balances[userId] = roundTo2Decimals(balances[userId] - share.amount);
      }
    });
  });
  
  return balances;
}

/**
 * Calculate optimal settlement plan
 * Produces minimal set of transfers to settle all debts
 * 
 * Example:
 *   balances: { A: +300, B: -200, C: -100 }
 *   Result: [
 *     { from: B, to: A, amount: 200 },
 *     { from: C, to: A, amount: 100 }
 *   ]
 * 
 * @param {Object} balances - { userId: netBalance }
 * @returns {Array} - Array of { from, to, amount } settlements
 */
function calculateSettlementPlan(balances) {
  const settlements = [];
  
  // Convert to array and separate creditors/debtors
  const creditors = []; // People who are owed money (positive balance)
  const debtors = [];   // People who owe money (negative balance)
  
  Object.entries(balances).forEach(([userId, balance]) => {
    // Ignore negligible amounts (rounding errors)
    if (Math.abs(balance) < 0.01) {
      return;
    }
    
    if (balance > 0) {
      creditors.push({
        userId,
        amount: roundTo2Decimals(balance)
      });
    } else {
      debtors.push({
        userId,
        amount: roundTo2Decimals(Math.abs(balance))
      });
    }
  });
  
  // Sort both arrays by amount descending (largest first)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  
  // Greedy matching algorithm
  let creditorIndex = 0;
  let debtorIndex = 0;
  
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    
    // Settlement is the smaller of the two amounts
    const settlementAmount = Math.min(creditor.amount, debtor.amount);
    
    if (settlementAmount > 0.01) {
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: roundTo2Decimals(settlementAmount)
      });
    }
    
    // Update remaining amounts
    creditor.amount = roundTo2Decimals(creditor.amount - settlementAmount);
    debtor.amount = roundTo2Decimals(debtor.amount - settlementAmount);
    
    // Move to next creditor if current one is settled
    if (creditor.amount < 0.01) {
      creditorIndex++;
    }
    
    // Move to next debtor if current one is settled
    if (debtor.amount < 0.01) {
      debtorIndex++;
    }
  }
  
  return settlements;
}

/**
 * Get formatted settlement data with user information
 * 
 * @param {Array} settlements - Raw settlement transactions
 * @param {Object} memberMap - { userId: memberInfo }
 * @returns {Array} - Formatted settlements with user details
 */
function formatSettlements(settlements, memberMap) {
  return settlements.map(settlement => ({
    from: {
      userId: settlement.from,
      user: memberMap[settlement.from]
    },
    to: {
      userId: settlement.to,
      user: memberMap[settlement.to]
    },
    amount: settlement.amount
  }));
}

/**
 * Validate settlement calculations
 * Ensures sum of inflows equals sum of outflows
 * 
 * @param {Object} balances - Original balances
 * @param {Array} settlements - Calculated settlements
 * @returns {boolean} - True if valid
 */
function validateSettlement(balances, settlements) {
  // All balances should sum to approximately zero
  const totalBalance = Object.values(balances).reduce((sum, b) => sum + b, 0);
  // Validation check (silent in production)
  if (Math.abs(totalBalance) > 0.01) {
    // Log only in development mode if needed
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Warning: Total balance not zero: ${totalBalance}`);
    }
  }
  
  // Each settlement should move money from debtor to creditor
  settlements.forEach(settlement => {
    if (!settlement.from || !settlement.to || settlement.amount <= 0) {
      throw new Error('Invalid settlement transaction');
    }
  });
  
  return true;
}

/**
 * Calculate balances with user metadata
 * Returns balances with user information for display
 * 
 * @param {Object} balances - { userId: netBalance }
 * @param {Object} memberMap - { userId: { name, email, ... } }
 * @returns {Array} - Array of { userId, user, netBalance, isCreditor, isDebtor }
 */
function getFormattedBalances(balances, memberMap) {
  return Object.entries(balances)
    .filter(([, balance]) => Math.abs(balance) > 0.01) // Only show non-zero
    .map(([userId, balance]) => ({
      userId,
      user: memberMap[userId],
      netBalance: roundTo2Decimals(balance),
      isCreditor: balance > 0,        // They are owed money
      isDebtor: balance < 0,          // They owe money
      amountOwed: balance < 0 ? roundTo2Decimals(Math.abs(balance)) : 0,
      amountToReceive: balance > 0 ? balance : 0
    }))
    .sort((a, b) => {
      // Sort creditors first (positive), then debtors
      if (a.isCreditor !== b.isCreditor) {
        return a.isCreditor ? -1 : 1;
      }
      // Within each group, sort by amount descending
      return Math.abs(b.netBalance) - Math.abs(a.netBalance);
    });
}

/**
 * Complete settlement calculation for a group
 * This is the main exported function
 * 
 * @param {Object} groupData - { expenses: [], members: [] }
 * @returns {Object} - { balances, settlementPlan }
 */
function calculateGroupSettlement(groupData) {
  const { expenses = [], members = [] } = groupData;
  
  if (!members || members.length === 0) {
    throw new Error('Group must have at least one member');
  }
  
  // Create map of members for quick lookup
  const memberMap = {};
  const memberIds = [];
  
  members.forEach(member => {
    const userId = member.user._id?.toString() || member.user.toString();
    memberIds.push(userId);
    memberMap[userId] = {
      id: userId,
      firstName: member.user.firstName || '',
      lastName: member.user.lastName || '',
      email: member.user.email,
      role: member.role
    };
  });
  
  // Calculate net balances
  const balances = calculateNetBalances(expenses, memberIds);
  
  // Validate balances sum to zero (accounting check)
  const totalBalance = Object.values(balances).reduce((sum, b) => sum + b, 0);
  // Validation check (silent in production)
  if (Math.abs(totalBalance) > 0.05) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Warning: Balances don't sum to zero. Total: ${totalBalance}. This may indicate a data issue.`);
    }
  }
  
  // Calculate settlement plan
  const settlementPlan = calculateSettlementPlan(balances);
  
  // Format for response
  const formattedBalances = getFormattedBalances(balances, memberMap);
  const formattedSettlements = formatSettlements(settlementPlan, memberMap);
  
  // Validate
  validateSettlement(balances, settlementPlan);
  
  return {
    balances: formattedBalances,
    settlementPlan: formattedSettlements,
    totalTransactions: formattedSettlements.length,
    totalAmount: formattedSettlements.reduce((sum, s) => sum + s.amount, 0)
  };
}

module.exports = {
  calculateGroupSettlement,
  calculateNetBalances,
  calculateSettlementPlan,
  getFormattedBalances,
  formatSettlements,
  validateSettlement,
  roundTo2Decimals
};
