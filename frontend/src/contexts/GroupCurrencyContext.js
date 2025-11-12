import React, { createContext, useContext, useState } from 'react';

const GroupCurrencyContext = createContext();

export const useGroupCurrency = () => {
  const context = useContext(GroupCurrencyContext);
  if (!context) {
    throw new Error('useGroupCurrency must be used within a GroupCurrencyProvider');
  }
  return context;
};

export const GroupCurrencyProvider = ({ children }) => {
  const [groupCurrency, setGroupCurrency] = useState(null);

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

  const currencyNames = {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'JPY': 'Japanese Yen',
    'AUD': 'Australian Dollar',
    'CAD': 'Canadian Dollar',
    'CHF': 'Swiss Franc',
    'CNY': 'Chinese Yuan',
    'INR': 'Indian Rupee',
    'LKR': 'Sri Lankan Rupee'
  };

  const currencySymbol = currencySymbols[groupCurrency] || '$';

  const formatCurrency = (amount) => {
    return `${currencySymbol}${parseFloat(amount).toLocaleString()}`;
  };

  const formatCurrencyWithDecimals = (amount) => {
    return `${currencySymbol}${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const updateGroupCurrency = (currency) => {
    setGroupCurrency(currency);
  };

  return (
    <GroupCurrencyContext.Provider value={{
      groupCurrency,
      currencySymbol,
      formatCurrency,
      formatCurrencyWithDecimals,
      updateGroupCurrency,
      currencySymbols,
      currencyNames,
      supportedCurrencies: Object.keys(currencySymbols)
    }}>
      {children}
    </GroupCurrencyContext.Provider>
  );
};

export default GroupCurrencyContext;
