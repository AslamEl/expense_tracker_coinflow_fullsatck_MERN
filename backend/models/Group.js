const mongoose = require('mongoose');

const groupExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Other']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  splitMethod: {
    type: String,
    enum: ['equal', 'percentage', 'custom', 'item-based'],
    default: 'equal'
  },
  splitAmong: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    items: [{
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1
      }
    }],
    isPaid: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending_confirmation', 'paid'],
      default: 'unpaid'
    },
    paymentRequestedAt: {
      type: Date,
      default: null
    }
  }],
  items: [{ // For item-based splitting
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    assignedTo: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }]
  }],
  receipt: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  joinKey: {
    type: String,
    required: true,
    unique: true,
    length: 6,
    uppercase: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    }
  }],
  expenses: [groupExpenseSchema],
  totalExpenses: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'LKR']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate random 6-character join key
groupSchema.statics.generateJoinKey = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Method to add member to group
groupSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('User is already a member of this group');
  }
  
  this.members.push({
    user: userId,
    role: role,
    joinedAt: new Date()
  });
  
  return this.save();
};

// Method to remove member from group
groupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Method to add expense to group
groupSchema.methods.addExpense = function(expenseData) {
  this.expenses.push(expenseData);
  this.totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
  return this.save();
};

// Method to calculate balances between members
groupSchema.methods.calculateBalances = function() {
  const balances = {};
  
  // Initialize balances for all members
  this.members.forEach(member => {
    balances[member.user.toString()] = 0;
  });
  
  // Calculate what each member owes/is owed from expenses
  this.expenses.forEach(expense => {
    const paidById = expense.paidBy.toString();
    
    // Add the amount paid to the payer's balance
    balances[paidById] = (balances[paidById] || 0) + expense.amount;
    
    // Subtract each member's share from their balance only if they haven't paid yet
    expense.splitAmong.forEach(split => {
      const userId = split.user.toString();
      // Only subtract if the split hasn't been paid yet
      if (!split.isPaid) {
        balances[userId] = (balances[userId] || 0) - split.amount;
      }
    });
  });
  
  return balances;
};

// Method to calculate optimal settlement transactions (minimizing transfers)
groupSchema.methods.calculateSettlement = function() {
  const balances = this.calculateBalances();
  const settlements = [];
  
  // Convert balances to array and filter out zero balances
  const balanceArray = Object.keys(balances)
    .map(userId => ({
      userId,
      balance: Math.round(balances[userId] * 100) / 100
    }))
    .filter(item => Math.abs(item.balance) > 0.01); // Ignore very small amounts
  
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balanceArray.filter(item => item.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balanceArray.filter(item => item.balance < 0).sort((a, b) => a.balance - b.balance);
  
  // Create settlements using greedy algorithm
  let i = 0, j = 0;
  
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const settleAmount = Math.min(creditor.balance, Math.abs(debtor.balance));
    
    if (settleAmount > 0.01) { // Only create settlement if amount is meaningful
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Math.round(settleAmount * 100) / 100
      });
      
      creditor.balance -= settleAmount;
      debtor.balance += settleAmount;
    }
    
    // Move to next creditor/debtor if current one is settled
    if (Math.abs(creditor.balance) < 0.01) i++;
    if (Math.abs(debtor.balance) < 0.01) j++;
  }
  
  return settlements;
};

// Pre-save middleware to ensure creator is added as admin member
groupSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set creator as admin member if not already in members array
    const creatorExists = this.members.some(member => 
      member.user.toString() === this.creator.toString()
    );
    
    if (!creatorExists) {
      this.members.push({
        user: this.creator,
        role: 'admin',
        joinedAt: new Date()
      });
    }
  }
  next();
});

module.exports = mongoose.model('Group', groupSchema);