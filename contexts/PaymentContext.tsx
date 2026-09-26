
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface PaymentContextType {
    upiLink: string;
    updateUpiLink: (newLink: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const defaultUpiLink = 'upi://pay?pa=payments@globalconnect.travel';

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [upiLink, setUpiLink] = useState<string>(() => {
        try {
            const storedUpiLink = localStorage.getItem('paymentUpiLink');
            return storedUpiLink ? storedUpiLink : defaultUpiLink;
        } catch (error) {
            console.error("Failed to parse UPI link from localStorage", error);
            return defaultUpiLink;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('paymentUpiLink', upiLink);
        } catch (error) {
            console.error("Failed to save UPI link to localStorage", error);
        }
    }, [upiLink]);

    const updateUpiLink = (newLink: string) => {
        setUpiLink(newLink);
    };

    return (
        <PaymentContext.Provider value={{ upiLink, updateUpiLink }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = (): PaymentContextType => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};
