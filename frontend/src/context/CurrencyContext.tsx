import React, { createContext, useContext, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Currency {
  id: number;
  name: string; // e.g. "US Dollar"
  code: string; // e.g. "USD"
  conversionRate: number; // e.g. 1.00
  currency: string; // e.g. "$" or symbol
  poundConversion?: string;
  currencyCode?: number;
}

interface CurrencyContextType {
  currencies: Currency[];
  activeCurrency: Currency | null;
  setCurrency: (currency: Currency) => void;
  isLoading: boolean;
  formatPrice: (amount: string | number | null | undefined) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCurrencyId, setActiveCurrencyId] = useState<string | null>(localStorage.getItem('activeCurrencyId'));

  const { data: currencies = [], isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await api.get('/properties/currencies');
      return response.data;
    },
    staleTime: Infinity, // Currencies rarely change
    refetchOnWindowFocus: false,
  });

  const activeCurrency = useMemo(() => {
    // const fallbackUSD: Currency = { id: 0, code: 'USD', name: 'US Dollar', currency: '$', conversionRate: 1 };
    // if (!currencies.length) return fallbackUSD;
    if (!currencies.length) return null;
    if (activeCurrencyId) {
      const found = currencies.find((c: Currency) => c.id.toString() === activeCurrencyId);
      if (found) return found;
    }
    return currencies.find((c: Currency) => c.code === 'USD') || currencies[0] || null;
    // return currencies.find((c: Currency) => c.code?.trim() === 'USD' || c.name?.includes('US Dollar')) || currencies[0] || fallbackUSD;
  }, [currencies, activeCurrencyId]);

  const setCurrency = (currency: Currency) => {
    setActiveCurrencyId(currency.id.toString());
    localStorage.setItem('activeCurrencyId', currency.id.toString());
  };

  const formatPrice = (amount: string | number | null | undefined): string => {
    if (amount === null || amount === undefined || amount === '') return '';
    const num = Number(amount);
    if (isNaN(num)) return amount.toString();
    const rate = activeCurrency?.conversionRate ? Number(activeCurrency.conversionRate) : 1;
    const converted = Math.floor(num * rate);
    // const converted = num; // Do not apply conversion rate as requested

    // Decode HTML entities like &pound;
    const rawSymbol = activeCurrency?.currency || '$';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = rawSymbol;
    const symbol = textArea.value;

    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currencies, activeCurrency, setCurrency, isLoading, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
