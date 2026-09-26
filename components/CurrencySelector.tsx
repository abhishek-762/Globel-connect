import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
    const { currency, setCurrency } = useCurrency();

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value as 'INR' | 'USD' | 'EUR' | 'GBP');
    };

    return (
        <div>
            <label htmlFor="currency-select" className="sr-only">Select Currency</label>
            <select
                id="currency-select"
                value={currency}
                onChange={handleCurrencyChange}
                className="bg-gray-100 border-2 border-gray-200 rounded-md py-1 px-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
            </select>
        </div>
    );
};

export default CurrencySelector;
