import React from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const MyBookings: React.FC = () => {
    const { userBookings, loading } = useBookings();
    const { isAuthenticated, signInWithGoogle, user } = useAuth();
    const { convertCurrency } = useCurrency();

    if (!isAuthenticated) {
        return (
            <div className="py-20 bg-gray-50 min-h-[60vh] flex flex-col justify-center items-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-montserrat text-gray-800 mb-2">Sign in to View Bookings</h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Please sign in with your Google account to view and manage your travel bookings.
                    </p>
                    <button
                        onClick={() => signInWithGoogle()}
                        className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Sign In with Google</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50 min-h-[75vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-montserrat text-gray-800">My Travel Bookings</h1>
                    <p className="text-gray-600 mt-1">
                        Track your confirmed journeys, booking status, and payment details saved in Firestore.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                ) : userBookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center max-w-lg mx-auto border border-gray-100">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Ready to explore the world? Discover our hand-crafted travel packages and book your dream trip today.
                        </p>
                        <Link
                            to="/packages"
                            className="inline-block px-6 py-2.5 bg-secondary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                        >
                            Explore Packages
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {userBookings.map((b) => (
                            <div key={b.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                                        <div>
                                            <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">Booking #{b.id.slice(-8)}</span>
                                            <h3 className="text-xl font-bold text-gray-800 font-montserrat">
                                                {b.packageName}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                b.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                b.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                b.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {b.status}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                b.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                'bg-orange-50 text-orange-700 border border-orange-200'
                                            }`}>
                                                Payment: {b.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block text-xs">Travel Date</span>
                                            <span className="font-semibold text-gray-800">{b.travelDate}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block text-xs">Travelers</span>
                                            <span className="font-semibold text-gray-800">{b.travelers} Person(s)</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block text-xs">Total Amount</span>
                                            <span className="font-bold text-primary text-base">
                                                {convertCurrency(b.totalPrice)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block text-xs">Booked On</span>
                                            <span className="text-gray-700">
                                                {new Date(b.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {b.activities && b.activities.length > 0 && (
                                        <div className="pt-2">
                                            <span className="text-xs text-gray-500">Activities Selected:</span>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {b.activities.map(act => (
                                                    <span key={act} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                                                        {act}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                                        <div className="text-xs text-gray-500">
                                            Contact: {b.fullName} ({b.phone})
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/packages/${b.packageId}`}
                                                className="text-xs text-primary hover:underline font-semibold"
                                            >
                                                View Package Details &rarr;
                                            </Link>
                                            {b.paymentStatus !== 'Paid' && (
                                                <Link
                                                    to="/payment"
                                                    className="px-3 py-1 bg-secondary text-white text-xs font-semibold rounded hover:bg-opacity-90"
                                                >
                                                    Complete Payment
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
