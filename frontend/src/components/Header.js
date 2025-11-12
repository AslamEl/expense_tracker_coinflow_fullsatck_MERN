import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Icons } from '../utils/svgIcons';

const Header = ({ user, onLogout, currentPage = 'home' }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { currentTheme, changeTheme, getThemeClasses } = useTheme();
  const { currencySymbol, formatCurrencyWithDecimals } = useCurrency();

  // Debug log to check if props are being passed correctly
  useEffect(() => {
    console.log('Header component props:', {
      user: user ? { firstName: user.firstName, lastName: user.lastName } : null,
      onLogout: typeof onLogout,
      currentTheme,
      changeTheme: typeof changeTheme
    });
  }, [user, onLogout, currentTheme, changeTheme]);

  const themeClasses = getThemeClasses();

  // Navigation items configuration
  const navItems = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'blue', action: 'showHome' },
    { id: 'summary', label: 'Summary', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'green', action: 'showExpenseSummary' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'purple', action: 'showExpenseAnalytics' },
    { id: 'recent', label: 'Recent', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'orange', action: 'showRecentTransactions' },
    { id: 'groups', label: 'Groups', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'pink', action: 'showGroups' }
  ];

  const isPageActive = (pageId) => currentPage === pageId;

  const getNavButtonClasses = (pageId) => {
    const isActive = isPageActive(pageId);
    const baseClasses = 'flex items-center justify-center rounded-lg sm:rounded-xl md:rounded-3xl px-2.5 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 transition-all duration-500 transform text-white group text-xs sm:text-sm md:text-base font-bold relative overflow-hidden whitespace-nowrap';
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-xl border-2 border-white/60 shadow-2xl scale-105 sm:scale-105 md:scale-105 ring-2 ring-white/30 hover:scale-110`;
    }
    return `${baseClasses} bg-white/5 backdrop-blur-md border-2 border-white/15 hover:bg-white/15 hover:border-white/40 hover:scale-105 hover:shadow-xl`;
  };

  const themes = [
    { id: 'default', name: 'Ocean Blue', icon: '🌊' },
    { id: 'emerald', name: 'Emerald Green', icon: '🍃' },
    { id: 'purple', name: 'Royal Purple', icon: '💜' },
    { id: 'orange', name: 'Sunset Orange', icon: '🌅' },
    { id: 'teal', name: 'Teal Breeze', icon: '🏝️' },
    { id: 'dark', name: 'Dark Mode', icon: '🌙' }
  ];

  // Simple theme change handler
  const handleThemeChange = (themeId) => {
    console.log('handleThemeChange called with:', themeId);
    console.log('changeTheme function:', typeof changeTheme);
    
    try {
      if (typeof changeTheme === 'function') {
        changeTheme(themeId);
        console.log('Theme changed successfully');
      } else {
        console.error('changeTheme is not a function');
      }
    } catch (error) {
      console.error('Error changing theme:', error);
    }
    
    // Close menus after theme change
    setTimeout(() => {
      setShowThemeSelector(false);
      setShowUserMenu(false);
    }, 100);
  };

  // Simple logout handler  
  const handleLogout = () => {
    console.log('handleLogout called');
    console.log('onLogout function:', typeof onLogout);
    
    try {
      if (window.confirm('Are you sure you want to sign out?')) {
        if (typeof onLogout === 'function') {
          onLogout();
          console.log('Logout called successfully');
        } else {
          console.error('onLogout is not a function');
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    setShowUserMenu(false);
  };

  // Toggle theme selector
  const toggleThemeSelector = () => {
    console.log('Toggling theme selector');
    setShowThemeSelector(!showThemeSelector);
  };

  // Handle clicks outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside any of our menus
      const themeSelector = document.querySelector('[data-theme-selector]');
      const userMenu = document.querySelector('[data-user-menu]');
      
      if (themeSelector && themeSelector.contains(event.target)) return;
      if (userMenu && userMenu.contains(event.target)) return;
      
      console.log('Outside click detected - closing menus');
      setShowThemeSelector(false);
      setShowUserMenu(false);
    };

    if (showThemeSelector || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showThemeSelector, showUserMenu]);

  return (
    <header className={`bg-gradient-to-br ${themeClasses.gradient} shadow-2xl relative overflow-visible`}>
      {/* Background animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        {/* Theme Selector - Top Left */}
        <div className="absolute top-2 sm:top-3 md:top-6 left-2 sm:left-3 md:left-6 z-50" data-theme-selector>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Theme selector button clicked');
                toggleThemeSelector();
              }}
              className="flex items-center bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl py-2 sm:py-2.5 md:py-3 px-2.5 sm:px-3 md:px-5 text-white hover:bg-gradient-to-r hover:from-white/35 hover:to-white/25 transition-all duration-300 border-2 border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 text-xs sm:text-xs md:text-sm font-semibold group"
            >
              <svg className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 mr-1.5 sm:mr-2 md:mr-3 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 5l4 4" />
              </svg>
              <span className="font-bold hidden sm:inline">Theme</span>
              <span className="text-base sm:text-lg md:text-xl ml-1 sm:ml-1.5 md:ml-2">
                {themes.find(t => t.id === currentTheme)?.icon}
              </span>
            </button>

            {/* Theme Selector Dropdown */}
            {showThemeSelector && (
              <div 
                className="absolute left-0 top-full mt-2 md:mt-3 w-56 sm:w-60 md:w-72 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border-2 border-white/40 z-[99999] overflow-hidden backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Theme dropdown clicked');
                }}
                style={{ 
                  zIndex: 99999,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div className="p-3 sm:p-3.5 md:p-4">
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-gray-800 mb-2.5 md:mb-3">✨ Choose Theme</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((theme) => (
                      <button
                        type="button"
                        key={theme.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Theme button clicked:', theme.id);
                          handleThemeChange(theme.id);
                        }}
                        className={`p-2 sm:p-2.5 md:p-3 rounded-lg md:rounded-xl text-left hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-200 focus:outline-none focus:bg-blue-50 cursor-pointer relative text-xs sm:text-xs md:text-sm font-medium group ${
                          currentTheme === theme.id ? 'bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 shadow-md' : 'border-2 border-transparent hover:border-gray-300 bg-white/70'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 md:space-x-2">
                          <span className="text-lg md:text-xl group-hover:scale-125 transition-transform duration-300">{theme.icon}</span>
                          <span className="font-semibold text-gray-700 line-clamp-1">{theme.name}</span>
                        </div>
                        {currentTheme === theme.id && (
                          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2">
                            <svg className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 text-blue-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* User Menu - Top Right */}
        <div className="absolute top-2 sm:top-3 md:top-6 right-2 sm:right-3 md:right-6" data-user-menu>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-5 text-white hover:bg-gradient-to-r hover:from-white/35 hover:to-white/25 transition-all duration-300 border-2 border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 group"
            >
              <div className="relative">
                <div className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 bg-gradient-to-br from-white/40 to-white/20 rounded-lg sm:rounded-lg md:rounded-xl flex items-center justify-center mr-1.5 sm:mr-2 md:mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-xs sm:text-xs md:text-sm font-black text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 sm:w-3 md:w-4 h-2.5 sm:h-3 md:h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
              </div>
              <div className="text-left mr-1.5 sm:mr-2 md:mr-3 hidden sm:block">
                <p className="text-xs sm:text-xs md:text-sm font-bold text-white line-clamp-1">{user?.firstName}</p>
                <p className="text-xs text-white/80 line-clamp-1 hidden md:block">@{user?.username}</p>
              </div>
              <svg className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 text-white/80 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div 
                className="absolute right-0 top-full mt-2 md:mt-3 w-52 sm:w-56 md:w-64 bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border-2 border-white/40 z-[80] overflow-hidden pointer-events-auto text-xs sm:text-xs md:text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-2">
                  <div className="px-3 sm:px-4 py-3 md:py-3.5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50">
                    <p className="font-bold text-gray-800 line-clamp-1">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">{user?.email}</p>
                  </div>
                  
                  <div className="px-3 sm:px-4 py-3 md:py-3 text-gray-700 border-b border-gray-200 bg-white/50 hidden sm:block">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Monthly Salary:</span>
                      <span className="font-bold text-green-600">{formatCurrencyWithDecimals(user?.monthlySalary || 0)}</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Settings button clicked');
                      if (window.showSettings) {
                        window.showSettings();
                      }
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 sm:px-4 py-3 md:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 focus:outline-none focus:bg-blue-50 cursor-pointer group"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2.5 sm:mr-3 text-blue-600 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold">Settings</span>
                    </div>
                  </button>
                  
                  <div className="border-t border-gray-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Logout button clicked');
                        handleLogout();
                      }}
                      className="w-full text-left px-3 sm:px-4 py-3 md:py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200 focus:outline-none focus:bg-red-50 cursor-pointer group font-semibold"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2.5 sm:mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Header Content */}
        <div className="text-center mt-4 sm:mt-6 md:mt-8 pt-14 sm:pt-12 md:pt-0">
          <div className="flex flex-col sm:flex-row justify-center items-center mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-4 md:gap-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-white/30 to-white/15 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-4 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <svg className="w-7 sm:w-9 md:w-12 h-7 sm:h-9 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="absolute -top-1 sm:top-0 -right-1 sm:-right-1.5 md:-right-2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                <span className="text-white text-xs font-bold">$</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-1 sm:mb-2 tracking-tighter drop-shadow-lg">
                CoinFlow
              </h1>
              <div className="h-1 sm:h-1.5 w-24 sm:w-28 md:w-32 bg-gradient-to-r from-white/80 via-white/60 to-transparent rounded-full mx-auto shadow-lg"></div>
            </div>
          </div>
          <p className="text-white/95 text-base sm:text-lg md:text-2xl max-w-3xl mx-auto mb-1 md:mb-2 font-bold px-2 tracking-wide">
            Welcome back, <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent font-black">{user?.firstName}</span>! 
          </p>
          <p className="text-white/80 text-xs sm:text-base md:text-lg max-w-2xl mx-auto px-3 font-medium">
            Track your expenses with AI-powered insights
          </p>
          {/* Navigation Buttons */}
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-6 mb-4 sm:mb-6 md:mb-8 px-1 sm:px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (window[item.action]) {
                    window[item.action]();
                  }
                }}
                className={getNavButtonClasses(item.id)}
                title={item.label}
              >
                <div className="relative mr-1 sm:mr-2 md:mr-3 flex-shrink-0">
                  <svg className={`w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-${item.color}-100 group-hover:text-${item.color}-50 transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                  </svg>
                </div>
                <span className="hidden sm:inline font-bold tracking-wide text-xs sm:text-sm md:text-base">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Navigation Info */}
          <div className="text-center text-white/80 px-3">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
              {currentPage === 'home' && (
                <>
                  <div className="w-5 h-5 md:w-6 md:h-6 text-white">{Icons.wave}</div>
                  <p className="text-xs md:text-lg font-medium">Welcome! Explore your spending overview</p>
                </>
              )}
              {currentPage === 'summary' && (
                <>
                  <div className="w-5 h-5 md:w-6 md:h-6 text-white">{Icons.chart}</div>
                  <p className="text-xs md:text-lg font-medium">View your expense summary and totals</p>
                </>
              )}
              {currentPage === 'analytics' && (
                <>
                  <div className="w-5 h-5 md:w-6 md:h-6 text-white">{Icons.trending}</div>
                  <p className="text-xs md:text-lg font-medium">Analyze your spending patterns and trends</p>
                </>
              )}
              {currentPage === 'recent' && (
                <>
                  <div className="w-5 h-5 md:w-6 md:h-6 text-white">{Icons.timer}</div>
                  <p className="text-xs md:text-lg font-medium">Check your recent transactions (Expenses & Income)</p>
                </>
              )}
              {currentPage === 'recentIncomes' && (
                <>
                  <div className="w-5 h-5 md:w-6 md:h-6 text-white">{Icons.money}</div>
                  <p className="text-xs md:text-lg font-medium">Check your recent income transactions</p>
                </>
              )}
              {currentPage === 'groups' && (
                <>
                  <div className="w-5 h-5 md:w-6 md:h-6 text-white">{Icons.members}</div>
                  <p className="text-xs md:text-lg font-medium">Manage shared expenses with groups</p>
                </>
              )}
              {!currentPage && (
                <p className="text-xs md:text-lg font-medium">Navigate sections to explore your data</p>
              )}
            </div>
          </div>
        </div>
      </div>


    </header>
  );
};

export default Header;