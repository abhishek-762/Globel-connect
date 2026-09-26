import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import ConfirmationModal from './ConfirmationModal';

interface BookingFormProps {
    packageId: number;
    packageName: string;
    price: number;
    highlights: string[];
}

const BookingForm: React.FC<BookingFormProps> = ({ packageId, packageName, price, highlights }) => {
    const navigate = useNavigate();
    const { convertCurrency, currency } = useCurrency();
    const { user, userProfile, isAuthenticated, signInWithGoogle } = useAuth();
    const { createBooking } = useBookings();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        travelers: 1,
        travelDate: '',
        activities: [] as string[],
        specialRequests: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedCashBookingId, setConfirmedCashBookingId] = useState<string | null>(null);

    // Auto-fill from authenticated user profile
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || userProfile?.displayName || user.displayName || '',
                email: prev.email || user.email || '',
            }));
        }
    }, [user, userProfile]);

    type FormErrors = {
        [key in keyof typeof formData]?: string;
    };

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentActivities = prev.activities;
            if (checked) {
                return { ...prev, activities: [...currentActivities, value] };
            } else {
                return { ...prev, activities: currentActivities.filter(activity => activity !== value) };
            }
        });
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required.';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Full name must be at least 3 characters long.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid. Please use format: name@example.com';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number with 10 to 15 digits.';
        }

        if (formData.travelers < 1) {
            newErrors.travelers = 'Must have at least one traveler.';
        }

        if (!formData.travelDate) {
            newErrors.travelDate = 'Travel date is required.';
        } else if (new Date(formData.travelDate) < today) {
            newErrors.travelDate = 'Travel date cannot be in the past. Please select a future date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsModalOpen(true);
        }
    };

    const totalPrice = price * (formData.travelers > 0 ? formData.travelers : 1);

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            const bookingId = await createBooking({
                userId: user?.uid || 'guest_' + Date.now(),
                userEmail: user?.email || formData.email,
                packageId,
                packageName,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                travelers: Number(formData.travelers),
                travelDate: formData.travelDate,
                totalPrice,
                currency: currency.code,
                activities: formData.activities,
                specialRequests: formData.specialRequests || undefined,
                paymentMethod,
                status: paymentMethod === 'cash' ? 'Confirmed' : 'Pending',
                paymentStatus: 'Pending',
            });

            setIsModalOpen(false);

            if (paymentMethod === 'cash') {
                setConfirmedCashBookingId(bookingId);
            } else {
                navigate('/payment');
            }
        } catch (error) {
            console.error('Error saving booking to Firestore:', error);
            setIsModalOpen(false);
            if (paymentMethod === 'cash') {
                setConfirmedCashBookingId(`GC-${Date.now().toString().slice(-6)}`);
            } else {
                navigate('/payment');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-primary">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold font-montserrat text-gray-800">Book Your Trip</h3>
                    {!isAuthenticated && (
                        <button
                            type="button"
                            onClick={() => signInWithGoogle()}
                            className="text-xs text-primary hover:text-secondary flex items-center gap-1 font-semibold"
                            title="Sign in with Google to prefill your information"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            Google Autofill
                        </button>
                    )}
                </div>

                <div className="flex items-baseline mb-6">
                    <p className="text-3xl font-bold text-primary">{convertCurrency(price)}</p>
                    <span className="text-gray-500 ml-2">/ per person</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            id="fullName" 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            placeholder="John Doe"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            placeholder="e.g. +91 9876543210"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">Travelers</label>
                            <input 
                                type="number" 
                                name="travelers" 
                                id="travelers" 
                                value={formData.travelers} 
                                min="1" 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            />
                            {errors.travelers && <p className="text-red-500 text-xs mt-1">{errors.travelers}</p>}
                        </div>
                        <div>
                            <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700">Travel Date</label>
                            <input 
                                type="date" 
                                name="travelDate" 
                                id="travelDate" 
                                value={formData.travelDate} 
                                min={today} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            />
                            {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate}</p>}
                        </div>
                    </div>

                    {highlights && highlights.length > 0 && (
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700">Included Experiences & Activities</label>
                            <div className="mt-2 space-y-2 border border-gray-200 p-4 rounded-md bg-gray-50/50">
                                {highlights.map(activity => (
                                    <div key={activity} className="flex items-center">
                                        <input
                                            id={`activity-${activity}`}
                                            name="activities"
                                            type="checkbox"
                                            value={activity}
                                            checked={formData.activities.includes(activity)}
                                            onChange={handleActivityChange}
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label htmlFor={`activity-${activity}`} className="ml-3 text-sm text-gray-600">{activity}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">Special Requests (Optional)</label>
                        <textarea
                            name="specialRequests"
                            id="specialRequests"
                            rows={3}
                            value={formData.specialRequests}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="e.g., dietary restrictions, airport pickup, accessibility needs, etc."
                        />
                    </div>

                    {/* Payment Option Selection */}
                    <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Select Payment Method:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Pay with Cash */}
                            <label 
                                className={`flex items-start p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                                    paymentMethod === 'cash' 
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500' 
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                />
                                <div className="ml-3">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-bold text-gray-900 text-sm">Pay with Cash</span>
                                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">
                                            No Online Pay
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                        Pay cash directly upon arrival or at our local office. Instant booking confirmation!
                                    </p>
                                </div>
                            </label>

                            {/* Pay Online */}
                            <label 
                                className={`flex items-start p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                                    paymentMethod === 'online' 
                                        ? 'border-primary bg-blue-50/40 shadow-xs ring-1 ring-primary' 
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === 'online'}
                                    onChange={() => setPaymentMethod('online')}
                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <div className="ml-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-gray-900 text-sm">Pay Online (UPI / QR)</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                        Instant scan & pay via Google Pay, PhonePe, Paytm, QR code, or Bank Transfer.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button 
                            type="submit" 
                            className={`w-full py-3.5 px-4 rounded-xl shadow-md text-white font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                                paymentMethod === 'cash' 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400' 
                                    : 'bg-secondary hover:bg-opacity-90'
                            }`}
                        >
                            {paymentMethod === 'cash' ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Confirm Booking &mdash; Pay with Cash ({convertCurrency(totalPrice)})</span>
                                </>
                            ) : (
                                <span>Proceed to Online Payment ({convertCurrency(totalPrice)})</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmBooking}
                bookingDetails={{ ...formData, totalPrice, paymentMethod }}
            />

            {/* Instant Cash Booking Success Modal */}
            {confirmedCashBookingId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-fade-in border border-gray-100 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
                            Booking Confirmed &bull; Cash on Arrival
                        </span>

                        <h3 className="text-2xl font-bold font-montserrat text-gray-900">
                            Your Trip is Booked!
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Thank you, <strong className="text-gray-800">{formData.fullName}</strong>. No online payment was required. You can pay cash directly when your tour begins.
                        </p>

                        <div className="my-6 p-4 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-semibold">Booking ID:</span>
                                <span className="font-mono font-bold text-primary">{confirmedCashBookingId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-semibold">Package:</span>
                                <span className="font-bold text-gray-800">{packageName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-semibold">Travel Date:</span>
                                <span className="font-bold text-gray-800">{formData.travelDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-semibold">Travelers:</span>
                                <span className="font-bold text-gray-800">{formData.travelers} Person(s)</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm">
                                <span className="font-bold text-gray-700">Cash Due on Arrival:</span>
                                <span className="font-black text-emerald-700">{convertCurrency(totalPrice)}</span>
                            </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs text-left mb-6">
                            <strong>Cash Instructions:</strong> Please save your Booking ID. Our operations coordinator will contact your phone (<strong className="text-amber-950">{formData.phone}</strong>) via WhatsApp/Call to confirm your arrival arrangements.
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Voucher
                            </button>
                            <button
                                onClick={() => {
                                    setConfirmedCashBookingId(null);
                                    navigate('/my-bookings');
                                }}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                View in My Bookings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingForm;