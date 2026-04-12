import React, { createContext, useState } from 'react';

export const CurrencyContext = createContext();

// Hardcoded sample rates relative to USD. In production, wrap this in a fetch from an Exchange Rate API.
const EXCHANGE_RATES = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD'); // Default currency

  // Converts a base USD price to the currently selected currency and formats it
  const formatPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null) return '';
    const converted = priceInUSD * EXCHANGE_RATES[currency];
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, EXCHANGE_RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
};
