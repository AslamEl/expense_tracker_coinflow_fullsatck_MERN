import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthLayout = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchToSignup = () => setIsLoginMode(false);
  const switchToLogin = () => setIsLoginMode(true);

  const handleBackToLanding = () => {
    localStorage.removeItem('coinflow-visited');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>
      {/* Header with back button */}
      <header className="p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToLanding}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">�</span>
            </div>
            <span className="text-xl font-bold text-gray-800">CoinFlow</span>
          </div>
        </div>
      </header>

      {isLoginMode ? (
        <Login onSwitchToSignup={switchToSignup} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthLayout;