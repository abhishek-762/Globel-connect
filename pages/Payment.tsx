
import React from 'react';
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
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-montserrat text-primary">Payment Information</h1>
                    <p className="mt-4 text-lg text-gray-600">Complete your booking by choosing one of the payment methods below.</p>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                    {/* QR Code Payment Section */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-secondary">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6 text-center">Scan & Pay with UPI</h2>
                        <div className="flex flex-col items-center">
                            <img 
                                src={qrCodeUrl} 
                                alt="UPI QR Code for Payment" 
                                className="w-48 h-48 object-contain border-4 border-gray-200 rounded-md p-1"
                                loading="lazy"
                            />
                            <p className="mt-4 font-semibold text-gray-700">{upiId}</p>
                            <p className="mt-2 text-sm text-gray-500 text-center">
                                Scan using any UPI app like Google Pay, PhonePe, Paytm, etc.
                            </p>
                        </div>
                    </div>

                    {/* Bank Transfer Section */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-primary">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6 text-center">Bank Transfer (NEFT/IMPS)</h2>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Bank Name:</span>
                                <span>Global Bank Ltd.</span>
                            </div>
                             <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Account Name:</span>
                                <span>Global Connect Pvt. Ltd.</span>
                            </div>
                             <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Account Number:</span>
                                <span>123456789012</span>
                            </div>
                             <div className="flex justify-between py-2">
                                <span className="font-semibold">IFSC Code:</span>
                                <span>GBL0001234</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Note Section */}
                <div className="max-w-4xl mx-auto mt-12 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-md shadow">
                    <h3 className="text-xl font-bold font-poppins">After Payment Confirmation</h3>
                    <p className="mt-2">
                        Once you have completed the payment, please send a screenshot of the transaction confirmation to our email at <strong className="font-semibold">payments@globalconnect.travel</strong> or message us on WhatsApp at <strong className="font-semibold">+91 12345 67890</strong>.
                    </p>
                    <p className="mt-2">
                        Our team will verify the payment and send your booking confirmation within 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;