import React from 'react';
import { Link } from 'react-router-dom';
import { testimonials } from '../constants';
import { Destination, Package, Review } from '../types';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import TestimonialSlider from '../components/TestimonialSlider';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { usePackages } from '../contexts/PackageContext';
import { useDestinations } from '../contexts/DestinationContext';
import { useReviews } from '../contexts/ReviewContext';

const Hero: React.FC = () => (
    <div className="relative h-[60vh] md:h-[80vh] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/chunarkilamirzapur/1920/1080.webp')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold font-montserrat tracking-tight">Your Journey Begins Here</h1>
            <p className="mt-4 text-lg md:text-2xl max-w-3xl font-poppins">Discover amazing places at exclusive deals. Let us make your travel dreams come true.</p>
            <Link to="/packages" className="mt-8 px-8 py-3 bg-secondary text-white font-bold rounded-full hover:bg-opacity-90 transition-transform duration-300 transform hover:scale-105">
                Explore Packages
            </Link>
        </div>
    </div>
);

const Home: React.FC = () => {
    const { packages } = usePackages();
    const { destinations } = useDestinations();
    const { reviews: customerReviews, addReview } = useReviews();
    const featuredDestinations = destinations.slice(0, 3);
    const popularPackages = packages.slice(0, 3);
    
    const handleAddReview = (newReview: { author: string; rating: number; comment: string }) => {
        const reviewToAdd: Omit<Review, 'id'> = {
            packageId: 0, // 0 for general feedback
            packageName: 'General Feedback',
            ...newReview
        };
        addReview(reviewToAdd);
    };


    return (
        <div>
            <Hero />
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center font-montserrat text-gray-800">Featured Destinations</h2>
                    <p className="text-center text-gray-600 mt-2">Explore top destinations picked by our travel experts.</p>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {featuredDestinations.map((destination: Destination) => (
                            <DestinationCard key={destination.id} destination={destination} />
                        ))}
                    </div>
                </div>
            </section>

             <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center font-montserrat text-gray-800">Popular Packages</h2>
                    <p className="text-center text-gray-600 mt-2">The best of our travel packages that our customers love.</p>
                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {popularPackages.map((pkg: Package) => (
                           <PackageCard key={pkg.id} pkg={pkg} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center font-montserrat text-gray-800">What Our Customers Say</h2>
                     <TestimonialSlider testimonials={testimonials} />
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center font-montserrat text-gray-800">Customer Reviews</h2>
                    <p className="text-center text-gray-600 mt-2">See what fellow travelers are saying about their experiences.</p>
                    <div className="mt-12 grid lg:grid-cols-2 gap-12 items-start">
                        <div className="max-h-[600px] overflow-y-auto pr-4">
                             {customerReviews.map(review => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                        <div>
                            <ReviewForm onSubmit={handleAddReview} />
                        </div>
                    </div>
                 </div>
            </section>
        </div>
    );
};

export default Home;