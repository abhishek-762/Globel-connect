import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

interface BookingDetails {
    fullName: string;
    email: string;
    travelers: number;
    travelDate: string;
    totalPrice: number;
}

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookingDetails: BookingDetails;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, bookingDetails }) => {
    const { convertCurrency } = useCurrency();

    if (!isOpen) {
        return null;
    }

    // A simple date formatter to handle potential timezone issues with input type="date"
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in-up"
                onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
                <h2 id="modal-title" className="text-2xl font-bold font-montserrat text-primary mb-4">Confirm Your Booking</h2>
                <div className="space-y-3 text-gray-700 border-t border-b py-4">
                    <div className="flex justify-between"><span className="font-semibold">Name:</span> <span>{bookingDetails.fullName}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Email:</span> <span>{bookingDetails.email}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Travel Date:</span> <span>{formatDate(bookingDetails.travelDate)}</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Travelers:</span> <span>{bookingDetails.travelers}</span></div>
                    <hr className="my-3 border-dashed"/>
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span className="font-semibold">Total Price:</span> 
                        <span>{convertCurrency(bookingDetails.totalPrice)}</span>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-semibold">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-secondary text-white rounded-md hover:bg-opacity-90 transition-colors font-semibold">
                        Confirm & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
