import React from 'react';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary mb-4">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-bold text-lg font-poppins text-gray-800">{review.author}</h4>
                    <p className="text-sm text-gray-500">on {review.packageName}</p>
                </div>
                <StarRating rating={review.rating} />
            </div>
            <p className="mt-4 text-gray-700 italic">"{review.comment}"</p>
        </div>
    );
};

export default ReviewCard;
