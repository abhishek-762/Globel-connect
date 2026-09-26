import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePackages } from '../contexts/PackageContext';
import { ItineraryItem, Review } from '../types';
import BookingForm from '../components/BookingForm';
import { useReviews } from '../contexts/ReviewContext';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';

const PackageDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showCopied, setShowCopied] = useState(false);
    const { packages } = usePackages();
    const { reviews, addReview } = useReviews();

    const pkg = packages.find(p => p.id === Number(id));

    const packageReviews = useMemo(() => {
        return reviews.filter(review => review.packageId === pkg?.id).sort((a, b) => b.id - a.id);
    }, [reviews, pkg]);

    if (!pkg) {
        return (
            <div className="py-20 text-center bg-gray-50 min-h-[60vh] flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold text-gray-800 font-montserrat">Package Not Found</h1>
                <p className="text-gray-600 mt-4">We couldn't find the package you're looking for.</p>
                <Link to="/packages" className="mt-6 inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                    Back to All Packages
                </Link>
            </div>
        );
    }
    
    const handleShare = async () => {
        const shareUrl = window.location.href;
        const shareDetails = {
            title: pkg.name,
            text: `Check out this amazing travel package from Global Connect: ${pkg.name}`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareDetails);
            } catch (error) {
                console.error('Error sharing package:', error);
            }
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
            }).catch(err => {
                console.error('Could not copy link to clipboard: ', err);
            });
        }
    };
    
    const handleAddReview = (newReview: { author: string; rating: number; comment: string }) => {
        if (!pkg) return;
        const reviewToAdd: Omit<Review, 'id'> = {
            packageId: pkg.id,
            packageName: pkg.name,
            ...newReview
        };
        addReview(reviewToAdd);
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="text-primary hover:underline font-semibold flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 lg:p-12">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Image Section */}
                        <div>
                            <img src={pkg.image} alt={pkg.name} className="w-full h-auto object-cover rounded-lg shadow-md aspect-video" loading="lazy" />
                        </div>

                        {/* Details Section */}
                        <div>
                            <span className="inline-block bg-secondary/10 text-secondary text-sm font-semibold px-3 py-1 rounded-full mb-2">{pkg.category}</span>
                             <div className="flex items-start justify-between gap-4 mt-2">
                                <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-800">{pkg.name}</h1>
                                <div className="relative flex-shrink-0">
                                    <button 
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label="Share this package"
                                        title="Share this package"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
                                        <span className="hidden sm:inline font-semibold">Share</span>
                                    </button>
                                    {showCopied && (
                                        <div className="absolute -top-9 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg z-10 whitespace-nowrap">
                                            Link Copied!
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="mt-2 text-lg text-gray-500">{pkg.destination}</p>

                            <div className="mt-6 flex items-center space-x-6 text-gray-700">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span>{pkg.duration}</span>
                                </div>
                            </div>
                            
                            <p className="mt-6 text-gray-600 leading-relaxed">{pkg.description}</p>
                        </div>
                    </div>
                    
                    {/* Highlights Section */}
                    <div className="mt-12 pt-8 border-t">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Highlights</h2>
                        <ul className="space-y-2 md:columns-2 md:gap-x-8">
                            {pkg.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start mb-2">
                                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                    <span className="text-gray-700">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Daily Itinerary Section */}
                    <div className="mt-12 pt-8 border-t">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">Daily Itinerary</h2>
                        <div className="space-y-4">
                            {pkg.itinerary.map((item: ItineraryItem) => (
                                <div key={item.day} className="border-l-2 border-primary pl-4">
                                    <h3 className="font-semibold text-gray-800">{`Day ${item.day}: ${item.title}`}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Reviews Section */}
                    <div className="mt-12 pt-8 border-t">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6">Customer Reviews</h2>
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                             <div className="space-y-4">
                                {packageReviews.length > 0 ? (
                                    packageReviews.map(review => <ReviewCard key={review.id} review={review} />)
                                ) : (
                                    <p className="text-gray-500 italic">Be the first to review this package!</p>
                                )}
                            </div>
                            <div>
                                <ReviewForm onSubmit={handleAddReview} />
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Section */}
                    <div className="mt-12 pt-8 border-t">
                        <div className="max-w-2xl mx-auto">
                           <BookingForm packageId={pkg.id} packageName={pkg.name} price={pkg.price} highlights={pkg.highlights} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;