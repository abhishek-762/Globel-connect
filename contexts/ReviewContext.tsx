import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Review } from '../types';
import { reviews as initialReviews } from '../constants';
import { db } from '../firebase';
import { 
    collection, 
    onSnapshot, 
    doc, 
    setDoc, 
    getDocs, 
    writeBatch 
} from 'firebase/firestore';

interface ReviewContextType {
    reviews: Review[];
    loading: boolean;
    addReview: (review: Omit<Review, 'id'>) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [loading, setLoading] = useState<boolean>(true);

    // Seed initial reviews if empty
    const seedInitialReviews = async () => {
        try {
            const batch = writeBatch(db);
            for (const r of initialReviews) {
                const docRef = doc(db, 'reviews', `rev_${r.id}`);
                batch.set(docRef, {
                    ...r,
                    createdAt: new Date().toISOString()
                });
            }
            await batch.commit();
            console.log('Seeded initial reviews to Firestore.');
        } catch (error: any) {
            console.warn('Could not seed initial reviews to Firestore:', error?.message || error);
        }
    };

    useEffect(() => {
        const reviewsCol = collection(db, 'reviews');

        const checkAndSeed = async () => {
            try {
                const snap = await getDocs(reviewsCol);
                if (snap.empty) {
                    await seedInitialReviews();
                }
            } catch (err: any) {
                console.warn('Could not check reviews in Firestore:', err?.message || err);
            }
        };

        checkAndSeed();

        const unsubscribe = onSnapshot(reviewsCol, (snapshot) => {
            if (!snapshot.empty) {
                const loadedReviews: Review[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as Review;
                    loadedReviews.push({ ...data, id: data.id || docSnap.id });
                });
                // Sort newest first
                loadedReviews.sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id);
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id);
                    return timeB - timeA;
                });
                setReviews(loadedReviews);
            } else {
                setReviews(initialReviews);
            }
            setLoading(false);
        }, (error: any) => {
            console.warn('Could not fetch reviews from Firestore, using local defaults:', error?.message || error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addReview = async (review: Omit<Review, 'id'>) => {
        const newId = Date.now();
        const reviewData: Review = {
            id: newId,
            createdAt: new Date().toISOString(),
            ...review
        };

        try {
            const docRef = doc(db, 'reviews', `rev_${newId}`);
            await setDoc(docRef, reviewData);
        } catch (error) {
            console.error('Error saving review to Firestore:', error);
            setReviews(prev => [reviewData, ...prev]);
        }
    };

    return (
        <ReviewContext.Provider value={{ reviews, loading, addReview }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviews = (): ReviewContextType => {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};
