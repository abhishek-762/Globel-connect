
import React, { useState, useEffect, useCallback } from 'react';
import { Testimonial } from '../types';

interface TestimonialSliderProps {
    testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, [testimonials.length]);

    useEffect(() => {
        const sliderInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(sliderInterval);
    }, [nextSlide]);
    
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative mt-12 max-w-3xl mx-auto h-64">
            {testimonials.map((testimonial, index) => (
                <div 
                    key={testimonial.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="flex flex-col items-center text-center p-8 h-full">
                        <p className="text-lg italic text-gray-700">"{testimonial.quote}"</p>
                        <p className="mt-4 font-bold font-poppins text-primary">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                </div>
            ))}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2">
                {testimonials.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-secondary' : 'bg-gray-300 hover:bg-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestimonialSlider;
