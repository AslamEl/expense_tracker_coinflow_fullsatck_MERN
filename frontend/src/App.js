import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Icons } from './utils/svgIcons';
import AuthLayout from './components/AuthLayout';
import LandingPage from './components/LandingPage';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Modal from './components/Modal';
import ExpenseFormModal from './components/ExpenseFormModal';
import SalaryFormModal from './components/SalaryFormModal';
import IncomeFormModal from './components/IncomeFormModal';
import Groups from './components/Groups';
import Home from './components/Home';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseAnalytics from './components/ExpenseAnalytics';
import RecentExpenses from './components/RecentExpenses';

import Settings from './components/Settings';
import './index.css';

// Set up axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Main App Component that requires authentication
const AuthenticatedApp = () => {
  const { user, token, logout, updateProfile } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlySalary, setMonthlySalary] = useState(user?.monthlySalary || user?.monthlyIncome || 0);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'expenseSummary', 'expenseAnalytics', 'recentExpenses', 'groups', 'settings'
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);



  // Sync monthlySalary with user profile when user changes
  useEffect(() => {
    if (user?.monthlySalary !== undefined) {
      setMonthlySalary(user.monthlySalary);
    } else if (user?.monthlyIncome !== undefined) {
      // Fallback for old users with monthlyIncome
      setMonthlySalary(user.monthlyIncome);
    }
  }, [user, token]);

  // Setup global navigation functions
  useEffect(() => {
    window.showSettings = () => setCurrentPage('settings');
    window.showHome = () => setCurrentPage('home');
    window.showExpenseSummary = () => setCurrentPage('expenseSummary');
    window.showExpenseAnalytics = () => setCurrentPage('expenseAnalytics');
    window.showRecentExpenses = () => setCurrentPage('recentExpenses');
    window.showGroups = () => setCurrentPage('groups');
    
    return () => {
      delete window.showSettings;
      delete window.showHome;
      delete window.showExpenseSummary;
      delete window.showExpenseAnalytics;
      delete window.showRecentExpenses;
      delete window.showGroups;
    };
  }, []);

  // Fetch all expenses from the API
  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        logout(); // Auto logout if token is invalid
      } else {
        setError('Failed to load expenses. Please check if the server is running.');
      }
    }
  }, [logout]);

  // Fetch all incomes from the API
  const fetchIncomes = useCallback(async () => {
    try {
      const response = await axios.get('/api/incomes');
      setIncomes(response.data);
      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        logout(); // Auto logout if token is invalid
      } else {
        setError('Failed to load incomes. Please check if the server is running.');
      }
    }
  }, [logout]);

  // Fetch all groups from the API
  const fetchGroups = useCallback(async () => {
    try {
      const response = await axios.get('/api/groups');
      // Handle both old format (array) and new format ({ success, data: array })
      const groupsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      setGroups(groupsData);
      setError(null);
    } catch (error) {
      if (error.response?.status === 401) {
        logout(); // Auto logout if token is invalid
      } else {
        console.error('Failed to load groups:', error);
        setGroups([]); // Set empty array as fallback
        // Don't set error for groups as it's not critical for the main app
      }
    }
  }, [logout]);

  // Fetch all data (expenses, incomes, and groups)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchExpenses(), fetchIncomes(), fetchGroups()]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses, fetchIncomes, fetchGroups]);

  // Add new expense
  const addExpense = async (expenseData) => {
    try {
      const response = await axios.post('/api/expenses', expenseData);
      setExpenses(prevExpenses => [response.data, ...prevExpenses]);
      setError(null);
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to add expense. Please try again.');
      }
    }
  };

  // Delete expense
  const deleteExpense = async (expenseId) => {
    try {
      await axios.delete(`/api/expenses/${expenseId}`);
      setExpenses(prevExpenses => 
        prevExpenses.filter(expense => expense._id !== expenseId)
      );
      setError(null);
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to delete expense. Please try again.');
      }
    }
  };

  // Add new income
  const addIncome = async (incomeData) => {
    try {
      const response = await axios.post('/api/incomes', incomeData);
      setIncomes(prevIncomes => [response.data, ...prevIncomes]);
      setError(null);
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to add income. Please try again.');
      }
    }
  };



  // Update monthly salary
  const updateSalary = async (newSalary) => {
    try {
      const result = await updateProfile({ monthlySalary: newSalary });
      if (result.success) {
        setMonthlySalary(newSalary);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to update salary');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to update salary. Please try again.');
      }
    }
  };

  // Load data when user and token are both available
  useEffect(() => {
    if (user && token) {
      // Small delay to ensure axios interceptor is properly set up
      const timer = setTimeout(() => {
        fetchData();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, token, fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative">
      {/* Advanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-8 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {currentPage !== 'settings' && (
        <Header 
          user={user} 
          onLogout={logout}
          currentPage={
            currentPage === 'expenseSummary' ? 'summary' :
            currentPage === 'expenseAnalytics' ? 'analytics' :
            currentPage === 'recentExpenses' ? 'recent' :
            currentPage === 'groups' ? 'groups' :
            'home'
          }
        />
      )}
      
      {currentPage === 'settings' ? (
        <Settings />
      ) : currentPage === 'expenseSummary' ? (
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <ExpenseSummary expenses={expenses} />
        </main>
      ) : currentPage === 'expenseAnalytics' ? (
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <ExpenseAnalytics expenses={expenses} />
        </main>
      ) : currentPage === 'recentExpenses' ? (
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <RecentExpenses 
            expenses={expenses} 
            onDeleteExpense={deleteExpense}
            loading={loading}
          />
        </main>
      ) : currentPage === 'groups' ? (
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <Groups />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Home Component */}
        <Home 
          expenses={expenses}
          incomes={incomes}
          monthlySalary={monthlySalary}
          groups={groups}
          onDeleteExpense={deleteExpense}
          loading={loading}
          onAddExpense={() => setShowExpenseModal(true)}
          onAddIncome={() => setShowIncomeModal(true)}
          onSetSalary={() => setShowSalaryModal(true)}
        />

        {/* Modals */}
        <Modal 
          isOpen={showExpenseModal} 
          onClose={() => setShowExpenseModal(false)}
          title="Add New Expense"
        >
          <ExpenseFormModal 
            onAddExpense={addExpense}
            onClose={() => setShowExpenseModal(false)}
          />
        </Modal>

        <Modal 
          isOpen={showIncomeModal} 
          onClose={() => setShowIncomeModal(false)}
          title="Add Income"
        >
          <IncomeFormModal 
            onAddIncome={addIncome}
            onClose={() => setShowIncomeModal(false)}
          />
        </Modal>

        <Modal 
          isOpen={showSalaryModal} 
          onClose={() => setShowSalaryModal(false)}
          title="Set Monthly Salary"
        >
          <SalaryFormModal 
            monthlySalary={monthlySalary}
            onSalaryUpdate={updateSalary}
            onClose={() => setShowSalaryModal(false)}
          />
        </Modal>

        {/* Retry Button for when there's an error */}
        {error && (
          <div className="text-center mt-6">
            <button
              onClick={fetchData}
              className="btn-primary"
            >
              Retry Loading Data
            </button>
          </div>
        )}
      </main>
      )}

      {/* Footer - Only show on home page */}
      {currentPage === 'home' && (
        <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white mt-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mr-4 shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">CoinFlow</h3>
                <p className="text-purple-200 font-medium">Smart Financial Management</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8 max-w-3xl mx-auto">
              <p className="text-white/90 mb-6 text-lg font-medium">
                Built with ❤️ by <span className="font-bold text-purple-200">Aslam</span> from University of Ruhuna
              </p>
              <p className="text-white/80 mb-6">
                Powered by MERN Stack (MongoDB, Express.js, React, Node.js) + AI Intelligence
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
                {[
                  { icon: 'analytics', text: 'Smart Analytics' },
                  { icon: 'budget', text: 'Budget Tracking' },
                  { icon: 'ai', text: 'AI Assistant' },
                  { icon: 'security', text: 'Secure & Private' },
                  { icon: 'responsive', text: 'Responsive Design' }
                ].map((feature, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg md:rounded-2xl px-2 md:px-4 py-1.5 md:py-2 flex items-center hover:bg-white/30 transition-all duration-300 hover:scale-105">
                    <div className="mr-1.5 md:mr-2 w-4 md:w-5 h-4 md:h-5 text-white flex-shrink-0">{Icons[feature.icon]}</div>
                    <span className="text-xs md:text-sm font-semibold text-white whitespace-nowrap">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              {/* Social links */}
              <div className="flex justify-center space-x-6">
                <a 
                  href="https://github.com/AslamEl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-purple-200 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/in/aslam-developer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-6 h-6 text-white group-hover:text-purple-200 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-6">
              <p className="text-white/60 text-sm">
                © 2025 CoinFlow. Crafted with passion for better financial management.
              </p>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

// Main App wrapper with AuthProvider and ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// App content that conditionally renders based on auth state
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('coinflow-visited');
    if (hasVisited && !isAuthenticated) {
      setShowLanding(false);
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    setShowLanding(false);
    localStorage.setItem('coinflow-visited', 'true');
    // Go directly to login page, skip theme selector
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return <AuthLayout />;
};

export default App;