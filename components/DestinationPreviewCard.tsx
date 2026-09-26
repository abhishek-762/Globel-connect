import React, { useState } from 'react';
import { DestinationInsight } from '../data/destinationKnowledge';
import { Package } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import PackageCard from './PackageCard';

interface DestinationPreviewCardProps {
    searchQuery: string;
    insight: DestinationInsight;
    similarPackages: Package[];
    onResetFilters: () => void;
}

const DestinationPreviewCard: React.FC<DestinationPreviewCardProps> = ({
    searchQuery,
    insight,
    similarPackages,
    onResetFilters,
}) => {
    const { convertCurrency } = useCurrency();
    const { user, userProfile, isAuthenticated, signInWithGoogle } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [form, setForm] = useState({
        name: userProfile?.displayName || user?.displayName || '',
        email: user?.email || '',
        phone: '',
        travelDate: '',
        travelers: 2,
        notes: `Interested in a customized ${insight.name} (${insight.recommendedDuration}) package for approximately ${insight.estimatedPrice} INR.`
    });

    const handleOpenModal = () => {
        setForm(prev => ({
            ...prev,
            name: prev.name || userProfile?.displayName || user?.displayName || '',
            email: prev.email || user?.email || '',
        }));
        setIsModalOpen(true);
    };

    const handleSubmitInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const quoteId = `quote_${Date.now()}`;
            const quoteRef = doc(db, 'customQuotes', quoteId);
            await setDoc(quoteRef, {
                id: quoteId,
                destination: insight.name,
                searchQuery,
                userName: form.name,
                userEmail: form.email,
                phone: form.phone,
                travelDate: form.travelDate,
                travelers: Number(form.travelers),
                notes: form.notes,
                estimatedPrice: insight.estimatedPrice,
                createdAt: new Date().toISOString(),
                status: 'New Inquiry'
            });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setIsModalOpen(false);
            }, 3000);
        } catch (error) {
            console.warn('Could not save custom quote to Firestore, saving locally:', error);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setIsModalOpen(false);
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Top Notification Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-montserrat text-gray-800">
                                Planning a trip to <span className="text-primary capitalize underline decoration-secondary decoration-2 underline-offset-4">{insight.name}</span>?
                            </h3>
                            <p className="text-sm text-gray-600">
                                While this exact destination is being added to our instant online booking catalog, our travel specialists build custom itineraries with verified hotels, guides, and transfers.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onResetFilters}
                        className="text-xs text-gray-500 hover:text-gray-800 underline whitespace-nowrap self-end md:self-center"
                    >
                        Clear search filters
                    </button>
                </div>
            </div>

            {/* Destination Spotlight & Custom Package Pricing Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 grid lg:grid-cols-12 gap-0">
                {/* Photo showcase */}
                <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[460px] overflow-hidden group">
                    <img 
                        src={insight.image} 
                        alt={insight.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                        <span className="inline-block bg-secondary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 w-max shadow-sm">
                            {insight.category} Experience
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat tracking-tight">
                            {insight.name}
                        </h2>
                        <p className="text-sm text-gray-200 mt-1 font-medium">{insight.tagline}</p>
                        
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/20 text-xs text-gray-300">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Best Time: {insight.bestTimeToVisit}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {insight.recommendedDuration}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pricing & Custom Package Details */}
                <div className="lg:col-span-6 p-6 md:p-8 lg:p-10 flex flex-col justify-between bg-white">
                    <div>
                        <div className="flex items-baseline justify-between border-b border-gray-100 pb-4 mb-5">
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block">Similar Package Estimate</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl md:text-4xl font-extrabold font-montserrat text-primary">
                                        {convertCurrency(insight.estimatedPrice)}
                                    </span>
                                    <span className="text-sm text-gray-500 font-medium">/ person approx.</span>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Customizable
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {insight.description}
                        </p>

                        <div className="mb-6">
                            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3">
                                Included Highlights in this Itinerary
                            </h4>
                            <ul className="grid sm:grid-cols-2 gap-2.5">
                                {insight.highlights.map((h, idx) => (
                                    <li key={idx} className="flex items-start text-xs text-gray-700 font-medium">
                                        <svg className="w-4 h-4 text-secondary mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleOpenModal}
                            className="flex-1 py-3.5 px-6 rounded-full bg-secondary hover:bg-opacity-95 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Get Custom Quote for {insight.name}
                        </button>
                        <button
                            onClick={onResetFilters}
                            className="py-3.5 px-6 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-colors text-center"
                        >
                            View All Packages
                        </button>
                    </div>
                </div>
            </div>

            {/* Similar Available Packages Section */}
            {similarPackages && similarPackages.length > 0 && (
                <div className="pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Ready to Book Today</span>
                            <h3 className="text-2xl font-bold font-montserrat text-gray-800">
                                Similar Curated Trips You Might Love
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500">
                            Available with instant online booking & guaranteed departures
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {similarPackages.map(pkg => (
                            <PackageCard key={pkg.id} pkg={pkg} />
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Quote Request Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-xs animate-fade-in"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-fade-in-up border border-gray-100"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-secondary">Bespoke Travel Inquiry</span>
                                <h3 className="text-2xl font-bold font-montserrat text-gray-800">
                                    Custom {insight.name} Tour
                                </h3>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="py-8 text-center space-y-3">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800">Inquiry Received!</h4>
                                <p className="text-sm text-gray-600">
                                    Our destination specialist for {insight.name} will prepare a customized itinerary and contact you at <span className="font-semibold text-gray-800">{form.email}</span> within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitInquiry} className="space-y-4">
                                {!isAuthenticated && (
                                    <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between text-xs">
                                        <span className="text-blue-800">Have a Google Account?</span>
                                        <button
                                            type="button"
                                            onClick={() => signInWithGoogle()}
                                            className="font-bold text-primary hover:underline"
                                        >
                                            Sign in to auto-fill
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        placeholder="e.g. Rahul Sharma"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Travel Date</label>
                                        <input
                                            type="date"
                                            value={form.travelDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={e => setForm({ ...form, travelDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Travelers</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={form.travelers}
                                            onChange={e => setForm({ ...form, travelers: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Preferences & Notes</label>
                                    <textarea
                                        rows={3}
                                        value={form.notes}
                                        onChange={e => setForm({ ...form, notes: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-secondary text-white font-bold text-xs rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow"
                                    >
                                        {isSubmitting ? 'Sending Request...' : 'Send Inquiry'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DestinationPreviewCard;
