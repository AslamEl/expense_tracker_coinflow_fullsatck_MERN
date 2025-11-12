import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();

  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': '₣',
    'CNY': '¥',
    'INR': '₹',
    'LKR': 'Rs'
  };

  const currency = user?.currency || 'USD';
  const currencySymbol = currencySymbols[currency] || '$';

  const formatCurrency = (amount) => {
    return `${currencySymbol}${parseFloat(amount).toLocaleString()}`;
  };

  const formatCurrencyWithDecimals = (amount) => {
    return `${currencySymbol}${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      currencySymbol, 
      formatCurrency,
      formatCurrencyWithDecimals,
      currencySymbols
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
