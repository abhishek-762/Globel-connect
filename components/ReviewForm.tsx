import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';

interface ReviewFormProps {
    onSubmit: (review: { author: string; rating: number; comment: string }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const { user, userProfile, isAuthenticated, signInWithGoogle } = useAuth();
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (user) {
            setAuthor(userProfile?.displayName || user.displayName || '');
        }
    }, [user, userProfile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || rating === 0 || !comment.trim()) {
            setError('Please fill out all fields and select a star rating.');
            return;
        }
        onSubmit({ author: author.trim(), rating, comment: comment.trim() });
        setRating(0);
        setComment('');
        setError('');
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 4000);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold font-montserrat text-primary">Leave a Review</h3>
                {!isAuthenticated && (
                    <button
                        type="button"
                        onClick={() => signInWithGoogle()}
                        className="text-xs text-primary hover:text-secondary flex items-center gap-1 font-semibold"
                    >
                        Sign in to review
                    </button>
                )}
            </div>

            {isSubmitted && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
                    Thank you! Your review has been saved to the database.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="e.g. Alex Traveler"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                    <StarRating rating={rating} setRating={setRating} interactive={true} />
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Tell other travelers about your experience..."
                        required
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-secondary hover:bg-opacity-90 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
