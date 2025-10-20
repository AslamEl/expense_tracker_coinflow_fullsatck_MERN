import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('coinflow-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('coinflow-theme', currentTheme);
    updateCSSVariables(currentTheme);
  }, [currentTheme]);

  const updateCSSVariables = (theme) => {
    const themes = {
      default: {
        '--primary': '59 130 246', // blue-500
        '--primary-dark': '37 99 235', // blue-600
        '--primary-light': '219 234 254', // blue-100
        '--accent': '16 185 129', // emerald-500
        '--gradient-from': '96 165 250', // blue-400
        '--gradient-to': '59 130 246', // blue-500
      },
      emerald: {
        '--primary': '16 185 129', // emerald-500
        '--primary-dark': '5 150 105', // emerald-600
        '--primary-light': '209 250 229', // emerald-100
        '--accent': '59 130 246', // blue-500
        '--gradient-from': '52 211 153', // emerald-400
        '--gradient-to': '16 185 129', // emerald-500
      },
      purple: {
        '--primary': '168 85 247', // purple-500
        '--primary-dark': '147 51 234', // purple-600
        '--primary-light': '243 232 255', // purple-100
        '--accent': '236 72 153', // pink-500
        '--gradient-from': '196 181 253', // purple-300
        '--gradient-to': '168 85 247', // purple-500
      },
      orange: {
        '--primary': '249 115 22', // orange-500
        '--primary-dark': '234 88 12', // orange-600
        '--primary-light': '254 215 170', // orange-200
        '--accent': '239 68 68', // red-500
        '--gradient-from': '251 146 60', // orange-400
        '--gradient-to': '239 68 68', // red-500
      },
      teal: {
        '--primary': '20 184 166', // teal-500
        '--primary-dark': '13 148 136', // teal-600
        '--primary-light': '204 251 241', // teal-100
        '--accent': '6 182 212', // cyan-500
        '--gradient-from': '45 212 191', // teal-400
        '--gradient-to': '6 182 212', // cyan-500
      },
      dark: {
        '--primary': '75 85 99', // gray-600
        '--primary-dark': '55 65 81', // gray-700
        '--primary-light': '229 231 235', // gray-200
        '--accent': '156 163 175', // gray-400
        '--gradient-from': '75 85 99', // gray-600
        '--gradient-to': '31 41 55', // gray-800
      },
    };

    const themeColors = themes[theme] || themes.default;
    
    // Update CSS custom properties
    const root = document.documentElement;
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  const changeTheme = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  const getThemeClasses = () => {
    const themeClasses = {
      default: {
        primary: 'bg-blue-500 hover:bg-blue-600',
        primaryText: 'text-blue-500',
        primaryBg: 'bg-blue-50',
        gradient: 'from-blue-400 via-blue-500 to-blue-600',
        button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      },
      emerald: {
        primary: 'bg-emerald-500 hover:bg-emerald-600',
        primaryText: 'text-emerald-500',
        primaryBg: 'bg-emerald-50',
        gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
        button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      },
      purple: {
        primary: 'bg-purple-500 hover:bg-purple-600',
        primaryText: 'text-purple-500',
        primaryBg: 'bg-purple-50',
        gradient: 'from-purple-400 via-purple-500 to-purple-600',
        button: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      },
      orange: {
        primary: 'bg-orange-500 hover:bg-orange-600',
        primaryText: 'text-orange-500',
        primaryBg: 'bg-orange-50',
        gradient: 'from-orange-400 via-orange-500 to-red-500',
        button: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
      },
      teal: {
        primary: 'bg-teal-500 hover:bg-teal-600',
        primaryText: 'text-teal-500',
        primaryBg: 'bg-teal-50',
        gradient: 'from-teal-400 via-cyan-500 to-teal-600',
        button: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600',
      },
      dark: {
        primary: 'bg-gray-700 hover:bg-gray-800',
        primaryText: 'text-gray-700',
        primaryBg: 'bg-gray-100',
        gradient: 'from-gray-600 via-gray-700 to-gray-800',
        button: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900',
      },
    };

    return themeClasses[currentTheme] || themeClasses.default;
  };

  const value = {
    currentTheme,
    changeTheme,
    getThemeClasses,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;