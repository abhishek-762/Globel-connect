import React from 'react';

interface StarRatingProps {
    rating: number;
    setRating?: (rating: number) => void;
    interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, interactive = false }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        type="button"
                        key={starValue}
                        onClick={() => interactive && setRating && setRating(starValue)}
                        className={`text-2xl ${interactive ? 'cursor-pointer' : ''} ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        aria-label={`Rate ${starValue} star`}
                        disabled={!interactive}
                    >
                        &#9733;
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
