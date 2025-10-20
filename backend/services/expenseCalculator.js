/**
 * Expense Calculator Service
 * 
 * Handles all calculations for expense splitting across different methods:
 * - Equal: Divide equally among participants
 * - Percentage: Divide by percentages
 * - Custom: Custom amounts per person
 * - Items: Split by items assigned to people
 */

/**
 * Round to 2 decimal places
 */
function roundTo2Decimals(amount) {
  return Math.round(amount * 100) / 100;
}

/**
 * Calculate equal split
 * Divides amount equally among specified members
 * Handles rounding by giving remainder to first member
 * 
 * Example: 100 divided among 3 people
 *   Person 1: 33.34 (gets the 0.01 remainder)
 *   Person 2: 33.33
 *   Person 3: 33.33
 * 
 * @param {number} totalAmount
 * @param {Array} memberIds
 * @returns {Array} - [{ memberId, amount }]
 */
function calculateEqualSplit(totalAmount, memberIds) {
  if (!memberIds || memberIds.length === 0) {
    throw new Error('At least one member required for split');
  }
  
  const baseAmount = roundTo2Decimals(totalAmount / memberIds.length);
  const totalFromBase = roundTo2Decimals(baseAmount * memberIds.length);
  const remainder = roundTo2Decimals(totalAmount - totalFromBase);
  
  return memberIds.map((memberId, index) => {
    let amount = baseAmount;
    
    // Add remainder to first member to ensure exact total
    if (index === 0) {
      amount = roundTo2Decimals(amount + remainder);
    }
    
    return {
      user: memberId,
      amount: amount,
      percentage: roundTo2Decimals((amount / totalAmount) * 100)
    };
  });
}

/**
 * Calculate percentage split
 * Each member gets a percentage of total
 * Validates percentages sum to 100
 * 
 * @param {number} totalAmount
 * @param {Object} percentages - { memberId: percentage }
 * @returns {Array} - [{ memberId, amount }]
 */
function calculatePercentageSplit(totalAmount, percentages) {
  const memberIds = Object.keys(percentages);
  
  if (memberIds.length === 0) {
    throw new Error('At least one member required for split');
  }
  
  // Validate percentages sum to 100
  const totalPercentage = Object.values(percentages).reduce((sum, p) => sum + p, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(
      `Percentages must sum to 100%. Current total: ${roundTo2Decimals(totalPercentage)}%`
    );
  }
  
  let totalCalculated = 0;
  const result = [];
  
  memberIds.forEach((memberId, index) => {
    const percentage = percentages[memberId];
    let amount;
    
    // Last member gets whatever's left to ensure exact total
    if (index === memberIds.length - 1) {
      amount = roundTo2Decimals(totalAmount - totalCalculated);
    } else {
      amount = roundTo2Decimals((totalAmount * percentage) / 100);
      totalCalculated = roundTo2Decimals(totalCalculated + amount);
    }
    
    result.push({
      user: memberId,
      amount: amount,
      percentage: roundTo2Decimals(percentage)
    });
  });
  
  return result;
}

/**
 * Calculate custom split
 * User specifies exact amount each person owes
 * Validates amounts sum to total (with rounding tolerance)
 * 
 * @param {number} totalAmount
 * @param {Object} amounts - { memberId: amount }
 * @returns {Array} - [{ memberId, amount }]
 */
function calculateCustomSplit(totalAmount, amounts) {
  const memberIds = Object.keys(amounts);
  
  if (memberIds.length === 0) {
    throw new Error('At least one member required for split');
  }
  
  // Validate amounts sum to total
  const totalProvided = Object.values(amounts).reduce((sum, a) => sum + a, 0);
  
  if (Math.abs(totalProvided - totalAmount) > 0.05) {
    throw new Error(
      `Custom amounts must sum to total. Total provided: ${roundTo2Decimals(totalProvided)}, Expected: ${roundTo2Decimals(totalAmount)}`
    );
  }
  
  return memberIds.map(memberId => ({
    user: memberId,
    amount: roundTo2Decimals(amounts[memberId]),
    percentage: roundTo2Decimals((amounts[memberId] / totalAmount) * 100)
  }));
}

/**
 * Calculate item-based split
 * Each item is assigned to members
 * People's shares = sum of items assigned to them
 * 
 * Example:
 *   Item 1 (Pizza - 300): Assigned to A (1x), B (1x) = 150 each
 *   Item 2 (Beer - 100): Assigned to A (1x) = 100
 *   Result: A owes 250, B owes 150
 * 
 * @param {number} totalAmount
 * @param {Array} items - [{ name, price, assignedTo: [memberId, ...] }]
 * @returns {Array} - [{ memberId, amount }]
 */
function calculateItemBasedSplit(totalAmount, items) {
  if (!items || items.length === 0) {
    throw new Error('At least one item required for item-based split');
  }
  
  // Calculate total price from items
  const itemsTotal = items.reduce((sum, item) => sum + item.price, 0);
  
  if (Math.abs(itemsTotal - totalAmount) > 0.05) {
    throw new Error(
      `Items total (${roundTo2Decimals(itemsTotal)}) doesn't match expense amount (${roundTo2Decimals(totalAmount)})`
    );
  }
  
  const memberShares = {};
  
  // Distribute each item equally among assigned members
  items.forEach(item => {
    if (!item.assignedTo || item.assignedTo.length === 0) {
      throw new Error(`Item "${item.name}" must be assigned to at least one member`);
    }
    
    const sharePerMember = roundTo2Decimals(item.price / item.assignedTo.length);
    const totalFromShare = roundTo2Decimals(sharePerMember * item.assignedTo.length);
    const remainder = roundTo2Decimals(item.price - totalFromShare);
    
    item.assignedTo.forEach((memberId, index) => {
      let memberAmount = sharePerMember;
      
      // Add remainder to first member
      if (index === 0) {
        memberAmount = roundTo2Decimals(memberAmount + remainder);
      }
      
      memberShares[memberId] = (memberShares[memberId] || 0) + memberAmount;
      memberShares[memberId] = roundTo2Decimals(memberShares[memberId]);
    });
  });
  
  // Convert to result format
  const result = Object.entries(memberShares).map(([memberId, amount]) => ({
    user: memberId,
    amount: amount,
    percentage: roundTo2Decimals((amount / totalAmount) * 100)
  }));
  
  return result;
}

/**
 * Main function: Calculate expense shares based on split type
 * 
 * @param {Object} expenseData
 *   - amount: Total expense amount
 *   - splitType: 'equal' | 'percentage' | 'custom' | 'items'
 *   - members: Array of member IDs (for equal split)
 *   - percentages: { memberId: percentage } (for percentage split)
 *   - amounts: { memberId: amount } (for custom split)
 *   - items: [{ name, price, assignedTo: [memberId] }] (for item split)
 * 
 * @returns {Array} - [{ user: memberId, amount, percentage }]
 */
function calculateExpenseShares(expenseData) {
  const { amount, splitType, members, percentages, customAmounts, items } = expenseData;
  
  if (!amount || amount <= 0) {
    throw new Error('Expense amount must be greater than 0');
  }
  
  const totalAmount = roundTo2Decimals(amount);
  
  switch (splitType) {
    case 'equal':
      if (!members || members.length === 0) {
        throw new Error('Members array required for equal split');
      }
      return calculateEqualSplit(totalAmount, members);
    
    case 'percentage':
      if (!percentages || Object.keys(percentages).length === 0) {
        throw new Error('Percentages object required for percentage split');
      }
      return calculatePercentageSplit(totalAmount, percentages);
    
    case 'custom':
      if (!customAmounts || Object.keys(customAmounts).length === 0) {
        throw new Error('Amounts object required for custom split');
      }
      return calculateCustomSplit(totalAmount, customAmounts);
    
    case 'items':
      if (!items || items.length === 0) {
        throw new Error('Items array required for item-based split');
      }
      return calculateItemBasedSplit(totalAmount, items);
    
    default:
      throw new Error(`Unknown split type: ${splitType}`);
  }
}

/**
 * Validate expense data before processing
 * 
 * @param {Object} expenseData
 * @returns {Array} - Array of error messages (empty if valid)
 */
function validateExpenseData(expenseData) {
  const errors = [];
  
  if (!expenseData.amount || expenseData.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!expenseData.splitType) {
    errors.push('Split type is required');
  }
  
  if (!['equal', 'percentage', 'custom', 'items'].includes(expenseData.splitType)) {
    errors.push('Invalid split type');
  }
  
  // Validate based on split type
  if (expenseData.splitType === 'equal' && (!expenseData.members || expenseData.members.length === 0)) {
    errors.push('Members array required for equal split');
  }
  
  if (expenseData.splitType === 'percentage' && Object.values(expenseData.percentages || {}).reduce((a, b) => a + b, 0) !== 100) {
    errors.push('Percentages must sum to 100%');
  }

  if (expenseData.splitType === 'custom' && Object.values(expenseData.customAmounts || {}).reduce((a, b) => a + b, 0) !== expenseData.amount) {
    errors.push('Custom amounts must sum to total amount');
  }
  
  return {
    valid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : null
  };
}

module.exports = {
  calculateExpenseShares,
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateCustomSplit,
  calculateItemBasedSplit,
  validateExpenseData,
  roundTo2Decimals
};
