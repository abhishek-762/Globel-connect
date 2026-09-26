import React, { useState, useCallback, useEffect, useRef } from 'react';
import { galleryImages } from '../constants';

const Gallery: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const goToPrevious = useCallback(() => {
        setCurrentIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    }, []);

    const goToNext = useCallback(() => {
        setCurrentIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }, []);
    
    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    }

    const handleMouseEnter = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleMouseLeave = () => {
        intervalRef.current = window.setInterval(goToNext, 5000);
    };

    useEffect(() => {
        handleMouseLeave(); // Start the autoplay on mount
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [goToNext]);


    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-montserrat text-primary">Our Gallery</h1>
                    <p className="mt-4 text-lg text-gray-600">Moments captured from our travelers' journeys.</p>
                </div>

                <div 
                    className="max-w-4xl mx-auto relative group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Carousel Wrapper */}
                    <div className="overflow-hidden rounded-lg shadow-2xl">
                        <div 
                            className="flex transition-transform ease-in-out duration-500"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {galleryImages.map((image) => (
                                <div key={image.id} className="w-full flex-shrink-0">
                                    <img 
                                        src={image.src} 
                                        alt={image.alt}
                                        className="w-full h-auto object-cover aspect-video"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Left Arrow */}
                    <button 
                        onClick={goToPrevious}
                        aria-label="Previous image"
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                     <button 
                        onClick={goToNext}
                        aria-label="Next image"
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                         {galleryImages.map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-secondary' : 'bg-gray-300 hover:bg-gray-400'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;