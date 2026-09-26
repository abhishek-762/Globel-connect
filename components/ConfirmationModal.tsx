import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

interface BookingDetails {
    fullName: string;
    email: string;
    travelers: number;
    travelDate: string;
    totalPrice: number;
    paymentMethod: 'online' | 'cash';
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

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isCash = bookingDetails.paymentMethod === 'cash';

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-fade-in-up border border-gray-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 id="modal-title" className="text-2xl font-bold font-montserrat text-primary">
                        Review & Confirm Booking
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Cash vs Online Banner */}
                {isCash ? (
                    <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-sm text-emerald-950">
                                Cash on Arrival Selected (No Online Payment Needed)
                            </div>
                            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                                Your booking will be confirmed immediately. You can pay cash directly to the tour coordinator upon arrival or at our local branch office.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-sm text-blue-950">
                                Instant Online Payment (UPI / QR Code / Bank)
                            </div>
                            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                                You will be directed to scan our instant UPI QR code or transfer via NEFT/IMPS.
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-3 text-gray-700 border-t border-b border-gray-200 py-4 text-sm">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Traveler Name:</span> 
                        <span className="font-bold text-gray-900">{bookingDetails.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Email:</span> 
                        <span className="text-gray-800">{bookingDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Travel Date:</span> 
                        <span className="font-bold text-gray-900">{formatDate(bookingDetails.travelDate)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Travelers:</span> 
                        <span className="font-bold text-gray-900">{bookingDetails.travelers} Person(s)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Payment Option:</span> 
                        <span className={`font-bold px-2 py-0.5 rounded text-xs uppercase tracking-wider ${
                            isCash ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {isCash ? 'Pay with Cash' : 'Pay Online'}
                        </span>
                    </div>
                    <hr className="my-2 border-dashed border-gray-200"/>
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="font-bold text-gray-900 text-base">Total Trip Cost:</span> 
                        <span className="text-2xl font-black text-primary font-montserrat">
                            {convertCurrency(bookingDetails.totalPrice)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className={`px-6 py-2.5 text-white rounded-xl transition-all font-bold text-sm shadow-md flex items-center justify-center gap-2 ${
                            isCash 
                                ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400' 
                                : 'bg-secondary hover:bg-opacity-90'
                        }`}
                    >
                        {isCash ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Confirm Booking (Pay Cash)</span>
                            </>
                        ) : (
                            <span>Confirm & Proceed to Pay</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
