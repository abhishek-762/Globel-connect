import React from 'react';
import { Link } from 'react-router-dom';
import { usePayment } from '../contexts/PaymentContext';

const Payment: React.FC = () => {
    const { upiLink } = usePayment();

    const getUpiId = (link: string) => {
        try {
            const urlParams = new URLSearchParams(link.split('?')[1]);
            return urlParams.get('pa') || 'payments@globalconnect.travel';
        } catch (error) {
            return 'payments@globalconnect.travel';
        }
    };
    
    const upiId = getUpiId(upiLink);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

    return (
        <div className="py-12 bg-gray-50 min-h-[85vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-montserrat text-primary">Payment & Settlement Options</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose your preferred settlement method: instant online digital transfer or cash on arrival.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-stretch">
                    {/* Option 1: Cash on Arrival */}
                    <div className="bg-white p-7 rounded-2xl shadow-lg border-t-4 border-emerald-500 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                    No Online Pay
                                </span>
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold font-poppins text-gray-800">Pay by Cash</h2>
                            <p className="text-xs text-gray-500 mt-1">Cash on Arrival &bull; In-Person</p>

                            <div className="mt-6 space-y-3 text-xs text-gray-700">
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="font-semibold text-emerald-900 mb-1">How it works:</p>
                                    <ul className="space-y-1 list-disc list-inside text-emerald-800">
                                        <li>Book without paying online now</li>
                                        <li>Pay cash directly to your tour guide</li>
                                        <li>Or pay at our registered office counter</li>
                                    </ul>
                                </div>
                                <p className="text-gray-500">
                                    Official cash receipt provided upon payment. Valid identification required.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t">
                            <Link
                                to="/my-bookings"
                                className="block w-full text-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                            >
                                View Cash Bookings
                            </Link>
                        </div>
                    </div>

                    {/* Option 2: QR Code Payment Section */}
                    <div className="bg-white p-7 rounded-2xl shadow-lg border-t-4 border-secondary flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-secondary">
                                    Instant UPI
                                </span>
                                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold font-poppins text-gray-800">Scan & Pay (UPI)</h2>
                            <p className="text-xs text-gray-500 mt-1">GPay, PhonePe, Paytm, BHIM</p>

                            <div className="flex flex-col items-center mt-5">
                                <img 
                                    src={qrCodeUrl} 
                                    alt="UPI QR Code for Payment" 
                                    className="w-40 h-40 object-contain border-2 border-gray-200 rounded-xl p-1 shadow-xs"
                                    loading="lazy"
                                />
                                <p className="mt-3 font-mono font-bold text-xs text-gray-800 bg-gray-100 px-3 py-1 rounded-md">{upiId}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t text-center">
                            <span className="text-[11px] text-gray-500">Scan from any banking app</span>
                        </div>
                    </div>

                    {/* Option 3: Bank Transfer Section */}
                    <div className="bg-white p-7 rounded-2xl shadow-lg border-t-4 border-primary flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-primary">
                                    NEFT / IMPS
                                </span>
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold font-poppins text-gray-800">Direct Bank Transfer</h2>
                            <p className="text-xs text-gray-500 mt-1">National & International Wire</p>

                            <div className="space-y-2.5 text-xs text-gray-700 mt-5">
                                <div className="flex justify-between py-1.5 border-b">
                                    <span className="font-semibold text-gray-500">Bank:</span>
                                    <span className="font-bold text-gray-900">State Bank of India</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b">
                                    <span className="font-semibold text-gray-500">Beneficiary:</span>
                                    <span className="font-bold text-gray-900">Global Connect Pvt Ltd</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b">
                                    <span className="font-semibold text-gray-500">Account No:</span>
                                    <span className="font-mono font-bold text-gray-900">389012458901</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="font-semibold text-gray-500">IFSC Code:</span>
                                    <span className="font-mono font-bold text-gray-900">SBIN0001234</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t text-center">
                            <span className="text-[11px] text-gray-500">Branch: New Delhi Main Branch</span>
                        </div>
                    </div>
                </div>

                {/* Verification Notice */}
                <div className="max-w-5xl mx-auto mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold font-montserrat text-amber-900">
                            Have Questions or Need Cash Payment Assistance?
                        </h3>
                        <p className="mt-1 text-xs text-amber-800">
                            Our team is available 24/7. Message us on WhatsApp with your Booking Reference ID for instant confirmation.
                        </p>
                    </div>
                    <a
                        href="https://wa.me/?text=Hi%20Global%20Connect,%20I%20have%20an%20inquiry%20regarding%20my%20trip%20booking%20and%20payment."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm whitespace-nowrap transition-colors flex items-center gap-2"
                    >
                        WhatsApp Concierge
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Payment;