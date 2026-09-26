import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BookingRecord } from '../types';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { 
    collection, 
    onSnapshot, 
    doc, 
    setDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy 
} from 'firebase/firestore';

interface BookingContextType {
    bookings: BookingRecord[];
    userBookings: BookingRecord[];
    createBooking: (bookingData: Omit<BookingRecord, 'id' | 'createdAt' | 'status' | 'paymentStatus'> & {
        status?: BookingRecord['status'];
        paymentStatus?: BookingRecord['paymentStatus'];
    }) => Promise<string>;
    updateBookingStatus: (id: string, status: BookingRecord['status']) => Promise<void>;
    updatePaymentStatus: (id: string, paymentStatus: BookingRecord['paymentStatus']) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isAdmin } = useAuth();
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [userBookings, setUserBookings] = useState<BookingRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Real-time synchronization
    useEffect(() => {
        const bookingsCol = collection(db, 'bookings');

        if (isAdmin) {
            // Admins can see all bookings
            const unsubscribe = onSnapshot(bookingsCol, (snapshot) => {
                const list: BookingRecord[] = [];
                snapshot.forEach(docSnap => {
                    list.push({ ...docSnap.data() as BookingRecord, id: docSnap.id });
                });
                list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBookings(list);
                setUserBookings(user ? list.filter(b => b.userId === user.uid || b.userEmail === user.email) : []);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching admin bookings from Firestore:', error);
                setLoading(false);
            });
            return () => unsubscribe();
        } else if (user) {
            // Regular authenticated users see their own bookings
            const q = query(bookingsCol, where('userId', '==', user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const list: BookingRecord[] = [];
                snapshot.forEach(docSnap => {
                    list.push({ ...docSnap.data() as BookingRecord, id: docSnap.id });
                });
                list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setUserBookings(list);
                setBookings(list);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching user bookings from Firestore:', error);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            // Unauthenticated
            setBookings([]);
            setUserBookings([]);
            setLoading(false);
        }
    }, [user, isAdmin]);

    const createBooking = async (
        bookingData: Omit<BookingRecord, 'id' | 'createdAt' | 'status' | 'paymentStatus'> & {
            status?: BookingRecord['status'];
            paymentStatus?: BookingRecord['paymentStatus'];
        }
    ): Promise<string> => {
        const bookingId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const record: BookingRecord = {
            paymentMethod: bookingData.paymentMethod || 'online',
            status: bookingData.status || (bookingData.paymentMethod === 'cash' ? 'Confirmed' : 'Pending'),
            paymentStatus: bookingData.paymentStatus || 'Pending',
            ...bookingData,
            id: bookingId,
            createdAt: new Date().toISOString(),
        };

        try {
            const docRef = doc(db, 'bookings', bookingId);
            await setDoc(docRef, record);
            return bookingId;
        } catch (error) {
            console.error('Error creating booking in Firestore:', error);
            // Fallback to local state
            setUserBookings(prev => [record, ...prev]);
            return bookingId;
        }
    };

    const updateBookingStatus = async (id: string, status: BookingRecord['status']) => {
        try {
            const docRef = doc(db, 'bookings', id);
            await updateDoc(docRef, { status });
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    const updatePaymentStatus = async (id: string, paymentStatus: BookingRecord['paymentStatus']) => {
        try {
            const docRef = doc(db, 'bookings', id);
            await updateDoc(docRef, { paymentStatus });
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    return (
        <BookingContext.Provider value={{ 
            bookings, 
            userBookings, 
            loading, 
            createBooking, 
            updateBookingStatus, 
            updatePaymentStatus 
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = (): BookingContextType => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBookings must be used within a BookingProvider');
    }
    return context;
};
