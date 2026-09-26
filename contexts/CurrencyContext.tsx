import React, { createContext, useState, useContext, ReactNode } from 'react';

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertCurrency: (amountInr: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const conversionRates = {
    INR: 1,
    USD: 83.5,
    EUR: 90.5,
    GBP: 105.0,
};

const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('INR');

    const convertCurrency = (amountInr: number) => {
        const rate = conversionRates[currency];
        const symbol = currencySymbols[currency];
        const convertedAmount = amountInr / rate;

        return `${symbol}${convertedAmount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };
    
    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
