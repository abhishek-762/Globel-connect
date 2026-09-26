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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            await createBooking({
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
            });

            setIsModalOpen(false);
            navigate('/payment');
        } catch (error) {
            console.error('Error saving booking to Firestore:', error);
            setIsModalOpen(false);
            navigate('/payment');
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

                    <div className="mt-6">
                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 border border-transparent rounded-full shadow-sm text-white bg-secondary font-bold hover:bg-opacity-90 transition-transform duration-300 transform hover:scale-105"
                        >
                            Proceed to Payment ({convertCurrency(totalPrice)})
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmBooking}
                bookingDetails={{ ...formData, totalPrice }}
            />
        </>
    );
};

export default BookingForm;