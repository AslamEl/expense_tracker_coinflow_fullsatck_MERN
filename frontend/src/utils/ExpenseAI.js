// AI Recommendation Engine
class ExpenseAI {
  constructor(expenses, monthlyIncome = 0) {
    this.expenses = expenses;
    this.monthlyIncome = monthlyIncome;
    this.categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Travel', 'Other'];
  }

  // Calculate spending statistics
  getSpendingStats() {
    const total = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgPerTransaction = total / Math.max(this.expenses.length, 1);
    
    const categoryTotals = this.expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const highestCategory = Object.keys(categoryTotals).reduce(
      (a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, 
      'Food'
    );

    // Calculate monthly totals
    const monthlyExpenses = total * (30 / Math.max(this.getActiveDays(), 1));
    const expenseRatio = this.monthlyIncome > 0 ? (monthlyExpenses / this.monthlyIncome) * 100 : 0;
    const savingsRate = this.monthlyIncome > 0 ? ((this.monthlyIncome - monthlyExpenses) / this.monthlyIncome) * 100 : 0;

    return {
      total,
      avgPerTransaction,
      categoryTotals,
      highestCategory,
      transactionCount: this.expenses.length,
      monthlyExpenses,
      expenseRatio,
      savingsRate,
      monthlyIncome: this.monthlyIncome
    };
  }

  // Analyze spending patterns
  analyzeSpendingPatterns() {
    const stats = this.getSpendingStats();
    const patterns = [];

    // High spending pattern
    if (stats.avgPerTransaction > 50) {
      patterns.push({
        type: 'high_spending',
        severity: 'warning',
        message: 'Your average transaction is quite high',
        suggestion: 'Consider setting spending limits for non-essential categories'
      });
    }

    // Category dominance
    const categoryPercentages = Object.keys(stats.categoryTotals).map(cat => ({
      category: cat,
      percentage: (stats.categoryTotals[cat] / stats.total) * 100
    }));

    const dominantCategory = categoryPercentages.find(cat => cat.percentage > 60);
    if (dominantCategory) {
      patterns.push({
        type: 'category_dominance',
        severity: 'info',
        message: `${dominantCategory.category} dominates your spending (${dominantCategory.percentage.toFixed(1)}%)`,
        suggestion: 'Try to diversify your spending or review if this is sustainable'
      });
    }

    return patterns;
  }

  // Generate budget recommendations
  generateBudgetRecommendations() {
    const stats = this.getSpendingStats();
    const recommendations = [];

    // Use actual monthly income if available, otherwise use extrapolated current spending
    const allocatedBudget = this.monthlyIncome > 0 ? this.monthlyIncome : (stats.total * (30 / Math.max(this.getActiveDays(), 1)));
    
    recommendations.push({
      type: 'budget_allocation',
      title: 'Smart Budget Allocation',
      guidelines: this.monthlyIncome > 0 
        ? 'Based on your actual monthly income using the 50/30/20 budgeting rule'
        : 'Based on your current spending patterns (add salary for accurate allocation)',
      suggestions: [
        {
          category: 'Bills',
          recommended: Math.round(allocatedBudget * 0.5),
          current: stats.categoryTotals.Bills || 0,
          description: 'Essential expenses (50% rule)'
        },
        {
          category: 'Food',
          recommended: Math.round(allocatedBudget * 0.15),
          current: stats.categoryTotals.Food || 0,
          description: 'Food & dining (15% guideline)'
        },
        {
          category: 'Transport',
          recommended: Math.round(allocatedBudget * 0.15),
          current: stats.categoryTotals.Transport || 0,
          description: 'Transportation (15% guideline)'
        },
        {
          category: 'Shopping',
          recommended: Math.round(allocatedBudget * 0.1),
          current: stats.categoryTotals.Shopping || 0,
          description: 'Discretionary spending (10% guideline)'
        },
        {
          category: 'Education',
          recommended: Math.round(allocatedBudget * 0.05),
          current: stats.categoryTotals.Education || 0,
          description: 'Education & learning (5% guideline)'
        },
        {
          category: 'Travel',
          recommended: Math.round(allocatedBudget * 0.03),
          current: stats.categoryTotals.Travel || 0,
          description: 'Travel & vacation (3% guideline)'
        },
        {
          category: 'Other',
          recommended: Math.round(allocatedBudget * 0.02),
          current: stats.categoryTotals.Other || 0,
          description: 'Miscellaneous (2% guideline)'
        }
      ],
      totalAllocated: allocatedBudget
    });

    return recommendations;
  }

  // Get active days
  getActiveDays() {
    if (this.expenses.length === 0) return 1;
    
    const dates = this.expenses.map(exp => new Date(exp.date).toDateString());
    const uniqueDates = [...new Set(dates)];
    return Math.max(uniqueDates.length, 1);
  }

  // Generate personalized tips
  generatePersonalizedTips() {
    const stats = this.getSpendingStats();
    const tips = [];

    // Money-saving tips based on highest category
    const categoryTips = {
      Food: [
        'Try meal prepping to reduce food costs by up to 40%',
        'Pack lunch instead of buying - save $150+ monthly',
        'Shop with a grocery list to avoid impulse purchases',
        'Cook at home more often - it\'s healthier and cheaper'
      ],
      Transport: [
        'Consider public transport or carpooling to save on fuel',
        'Use a bike for short distances - healthy and economical',
        'Track fuel prices and fill up at the cheapest stations',
        'Maintain your vehicle regularly to improve fuel efficiency'
      ],
      Shopping: [
        'Wait 24 hours before making non-essential purchases',
        'Use cashback apps and compare prices online',
        'Shop during sales and use coupons when available',
        'Avoid impulse buying - stick to your shopping list'
      ],
      Bills: [
        'Switch to energy-efficient appliances to lower utility bills',
        'Review subscriptions and cancel unused services',
        'Consider refinancing or negotiating better rates',
        'Set up automatic payments to avoid late fees'
      ],
      Education: [
        'Look for free online courses and educational resources',
        'Apply for scholarships and educational grants',
        'Use library resources instead of buying books',
        'Consider community college for cost-effective education'
      ],
      Travel: [
        'Book accommodations in advance for better rates',
        'Be flexible with travel dates for cheaper flights',
        'Travel during off-peak seasons to save money',
        'Consider road trips instead of flying for short distances'
      ],
      Other: [
        'Track all expenses to identify spending patterns',
        'Set aside money for unexpected expenses',
        'Review and categorize expenses regularly',
        'Look for ways to reduce miscellaneous spending'
      ]
    };

    const relevantTips = categoryTips[stats.highestCategory] || categoryTips.Food;
    tips.push(...relevantTips.slice(0, 2));

    // General financial tips
    const generalTips = [
      'Track your spending daily to stay aware of your habits',
      'Set specific savings goals to stay motivated',
      'Consider the 24-hour rule for purchases over $50',
      'Use apps to find deals and discounts before shopping'
    ];

    tips.push(generalTips[Math.floor(Math.random() * generalTips.length)]);

    return tips;
  }

  // Predict next month spending
  predictNextMonthSpending() {
    if (this.expenses.length < 3) {
      return null;
    }

    const stats = this.getSpendingStats();
    const dailyAverage = stats.total / this.getActiveDays();
    const predictedMonthly = dailyAverage * 30;

    // Add trend analysis
    const recentExpenses = this.expenses.slice(-7); // Last 7 transactions
    const olderExpenses = this.expenses.slice(-14, -7); // Previous 7 transactions

    const recentAvg = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0) / Math.max(recentExpenses.length, 1);
    const olderAvg = olderExpenses.reduce((sum, exp) => sum + exp.amount, 0) / Math.max(olderExpenses.length, 1);

    // Safe calculation to avoid infinity
    let trendPercentage = 0;
    if (olderAvg > 0) {
      trendPercentage = Math.abs(((recentAvg - olderAvg) / olderAvg) * 100);
    } else if (recentAvg > 0 && olderAvg === 0) {
      trendPercentage = 100; // Significant increase from baseline
    }

    const trend = recentAvg > olderAvg ? 'increasing' : 'decreasing';

    return {
      predicted: Math.round(predictedMonthly),
      trend,
      trendPercentage: Math.round(Math.min(trendPercentage, 999)), // Cap at 999% to avoid extreme values
      confidence: this.expenses.length > 10 ? 'high' : 'medium',
      monthlyIncome: this.monthlyIncome,
      predictedRatio: this.monthlyIncome > 0 ? ((predictedMonthly / this.monthlyIncome) * 100) : 0
    };
  }

  // Generate smart alerts
  generateSmartAlerts() {
    const alerts = [];
    const stats = this.getSpendingStats();

    // High spending day alert
    const today = new Date().toDateString();
    const todayExpenses = this.expenses.filter(exp => 
      new Date(exp.date).toDateString() === today
    );
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    if (todayTotal > stats.avgPerTransaction * 2) {
      alerts.push({
        type: 'high_daily_spending',
        severity: 'warning',
        title: '⚠️ High Spending Alert',
        message: `You've spent $${todayTotal.toFixed(2)} today, which is above your average`,
        action: 'Consider reviewing your purchases for the rest of the day'
      });
    }

    // Unusual category spending
    Object.keys(stats.categoryTotals).forEach(category => {
      const categoryAvg = stats.categoryTotals[category] / this.getActiveDays();
      const todayCategorySpending = todayExpenses
        .filter(exp => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0);

      if (todayCategorySpending > categoryAvg * 3) {
        alerts.push({
          type: 'unusual_category_spending',
          severity: 'info',
          title: `${category} Spending Notice`,
          message: `Higher than usual ${category.toLowerCase()} spending today`,
          action: `Review your ${category.toLowerCase()} expenses`
        });
      }
    });

    return alerts;
  }

  // Calculate financial health score
  calculateFinancialHealth() {
    const stats = this.getSpendingStats();
    
    if (this.monthlyIncome <= 0) {
      return {
        score: 0,
        grade: 'Unknown',
        status: 'Add your monthly salary to get your financial health score',
        color: 'gray'
      };
    }

    let score = 100;
    let factors = [];

    // Expense ratio factor (50% weight)
    if (stats.expenseRatio > 90) {
      score -= 40;
      factors.push('Very high expense ratio');
    } else if (stats.expenseRatio > 70) {
      score -= 25;
      factors.push('High expense ratio');
    } else if (stats.expenseRatio > 50) {
      score -= 10;
      factors.push('Moderate expense ratio');
    }

    // Savings rate factor (30% weight)
    if (stats.savingsRate < 10) {
      score -= 20;
      factors.push('Low savings rate');
    } else if (stats.savingsRate < 20) {
      score -= 10;
      factors.push('Moderate savings rate');
    }

    // Spending pattern factor (20% weight)
    const patterns = this.analyzeSpendingPatterns();
    const warningPatterns = patterns.filter(p => p.severity === 'warning');
    score -= warningPatterns.length * 10;

    score = Math.max(0, Math.min(100, score));

    const getGradeAndColor = (score) => {
      if (score >= 90) return { grade: 'A+', color: 'green', status: 'Excellent financial health!' };
      if (score >= 80) return { grade: 'A', color: 'green', status: 'Great financial management' };
      if (score >= 70) return { grade: 'B', color: 'blue', status: 'Good financial habits' };
      if (score >= 60) return { grade: 'C', color: 'yellow', status: 'Room for improvement' };
      if (score >= 50) return { grade: 'D', color: 'orange', status: 'Need to work on finances' };
      return { grade: 'F', color: 'red', status: 'Critical financial situation' };
    };

    const gradeInfo = getGradeAndColor(score);

    return {
      score: Math.round(score),
      ...gradeInfo,
      factors,
      recommendations: this.getHealthRecommendations(score, stats)
    };
  }

  // Get health-based recommendations
  getHealthRecommendations(score, stats) {
    const recommendations = [];

    // Only provide income-based recommendations if income is set
    if (this.monthlyIncome <= 0) {
      recommendations.push({
        priority: 'high',
        title: 'Add Your Monthly Income',
        message: 'Set your monthly salary to get accurate budget allocation and financial health analysis.',
        action: 'Add your income in settings to unlock personalized recommendations'
      });
      return recommendations;
    }

    if (stats.expenseRatio > 80) {
      recommendations.push({
        priority: 'high',
        title: 'Reduce Monthly Expenses',
        message: `You're spending ${stats.expenseRatio.toFixed(1)}% of your income. Aim for 70% or less.`,
        action: 'Review and cut non-essential expenses'
      });
    }

    if (stats.savingsRate < 20) {
      recommendations.push({
        priority: 'medium',
        title: 'Increase Savings Rate',
        message: `Current savings rate: ${stats.savingsRate.toFixed(1)}%. Aim for 20% or higher.`,
        action: 'Automate savings and reduce discretionary spending'
      });
    }

    if (score < 70) {
      recommendations.push({
        priority: 'high',
        title: 'Budget Planning Needed',
        message: 'Your financial health score indicates need for better budgeting',
        action: 'Create a detailed monthly budget and stick to it'
      });
    }

    return recommendations;
  }

  // Generate income-based alerts
  generateIncomeBasedAlerts() {
    const alerts = [];
    const stats = this.getSpendingStats();

    if (this.monthlyIncome <= 0) return alerts;

    // Over-spending alert
    if (stats.expenseRatio > 100) {
      alerts.push({
        type: 'overspending',
        severity: 'critical',
        title: 'Critical: Overspending Alert',
        message: `You're spending ${stats.expenseRatio.toFixed(1)}% of your income this month!`,
        action: 'Immediately review and cut expenses to avoid debt'
      });
    } else if (stats.expenseRatio > 80) {
      alerts.push({
        type: 'high_spending',
        severity: 'warning',
        title: 'High Spending Alert',
        message: `You're spending ${stats.expenseRatio.toFixed(1)}% of your income`,
        action: 'Consider reducing non-essential expenses'
      });
    }

    // Low savings alert
    if (stats.savingsRate < 10 && this.monthlyIncome > 0) {
      alerts.push({
        type: 'low_savings',
        severity: 'warning',
        title: 'Low Savings Alert',
        message: `Your savings rate is only ${stats.savingsRate.toFixed(1)}%`,
        action: 'Try to save at least 20% of your income'
      });
    }

    // Category overspending
    Object.keys(stats.categoryTotals).forEach(category => {
      const categoryMonthly = stats.categoryTotals[category] * (30 / Math.max(this.getActiveDays(), 1));
      const categoryRatio = (categoryMonthly / this.monthlyIncome) * 100;

      const limits = { Food: 15, Transport: 15, Shopping: 10, Bills: 50, Education: 10, Travel: 8, Other: 5 };
      const limit = limits[category];

      if (limit && categoryRatio > limit) {
        alerts.push({
          type: 'category_overspending',
          severity: 'info',
          title: `${category} Budget Alert`,
          message: `${category} spending is ${categoryRatio.toFixed(1)}% of income (recommended: ${limit}%)`,
          action: `Reduce ${category.toLowerCase()} expenses or adjust budget`
        });
      }
    });

    return alerts;
  }

  // Generate comprehensive AI insights
  generateInsights() {
    return {
      patterns: this.analyzeSpendingPatterns(),
      budgetRecommendations: this.generateBudgetRecommendations(),
      personalizedTips: this.generatePersonalizedTips(),
      predictions: this.predictNextMonthSpending(),
      alerts: [...this.generateSmartAlerts(), ...this.generateIncomeBasedAlerts()],
      stats: this.getSpendingStats(),
      financialHealth: this.calculateFinancialHealth()
    };
  }
}

export default ExpenseAI;