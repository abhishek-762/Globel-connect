import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Destination } from '../types';
import { destinations as initialDestinations } from '../constants';
import { db } from '../firebase';
import { 
    collection, 
    onSnapshot, 
    doc, 
    setDoc, 
    deleteDoc, 
    getDocs, 
    writeBatch 
} from 'firebase/firestore';

interface DestinationContextType {
    destinations: Destination[];
    loading: boolean;
    updateDestination: (updatedDestination: Destination) => Promise<void>;
    addDestination: (newDestination: Omit<Destination, 'id'>) => Promise<void>;
    deleteDestination: (id: number) => Promise<void>;
    seedInitialDestinations: () => Promise<void>;
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export const DestinationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
    const [loading, setLoading] = useState<boolean>(true);

    // Function to seed Firestore with initial destinations
    const seedInitialDestinations = async () => {
        try {
            const batch = writeBatch(db);
            for (const dest of initialDestinations) {
                const destDocRef = doc(db, 'destinations', `dest_${dest.id}`);
                batch.set(destDocRef, dest);
            }
            await batch.commit();
            console.log('Seeded initial destinations to Firestore.');
        } catch (error: any) {
            console.warn('Could not seed initial destinations to Firestore:', error?.message || error);
        }
    };

    useEffect(() => {
        const destinationsCol = collection(db, 'destinations');

        // Check if collection is empty or missing newly introduced destinations
        const checkAndSeed = async () => {
            try {
                const snapshot = await getDocs(destinationsCol);
                if (snapshot.empty) {
                    console.log('No destinations in Firestore. Seeding curated destinations...');
                    await seedInitialDestinations();
                } else {
                    const existingIds = new Set<number>();
                    snapshot.forEach(docSnap => {
                        const data = docSnap.data() as Destination;
                        if (data.id) existingIds.add(data.id);
                    });
                    const missingDestinations = initialDestinations.filter(d => !existingIds.has(d.id));
                    if (missingDestinations.length > 0) {
                        const batch = writeBatch(db);
                        for (const missing of missingDestinations) {
                            const ref = doc(db, 'destinations', `dest_${missing.id}`);
                            batch.set(ref, missing);
                        }
                        await batch.commit();
                        console.log(`Synced ${missingDestinations.length} newly added destinations to Firestore.`);
                    }
                }
            } catch (err: any) {
                console.warn('Could not verify destinations collection, using local fallback:', err?.message || err);
            }
        };

        checkAndSeed();

        // Real-time snapshot listener
        const unsubscribe = onSnapshot(destinationsCol, (snapshot) => {
            if (!snapshot.empty) {
                const loadedDestinations: Destination[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as Destination;
                    loadedDestinations.push({
                        ...data,
                        id: Number(data.id)
                    });
                });
                // Sort by ID
                loadedDestinations.sort((a, b) => a.id - b.id);
                setDestinations(loadedDestinations);
            } else {
                setDestinations(initialDestinations);
            }
            setLoading(false);
        }, (error) => {
            console.warn('Firestore real-time destinations error, falling back to local:', error);
            setDestinations(initialDestinations);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateDestination = async (updatedDestination: Destination) => {
        setDestinations(prev => prev.map(d => d.id === updatedDestination.id ? updatedDestination : d));
        try {
            const destDocRef = doc(db, 'destinations', `dest_${updatedDestination.id}`);
            await setDoc(destDocRef, updatedDestination, { merge: true });
        } catch (error: any) {
            console.error('Failed to update destination in Firestore:', error);
            throw error;
        }
    };

    const addDestination = async (newDest: Omit<Destination, 'id'>) => {
        const nextId = destinations.length > 0 ? Math.max(...destinations.map(d => d.id)) + 1 : 1;
        const completeDest: Destination = {
            id: nextId,
            ...newDest
        };

        setDestinations(prev => [...prev, completeDest]);
        try {
            const destDocRef = doc(db, 'destinations', `dest_${nextId}`);
            await setDoc(destDocRef, completeDest);
        } catch (error: any) {
            console.error('Failed to add destination to Firestore:', error);
            throw error;
        }
    };

    const deleteDestination = async (id: number) => {
        setDestinations(prev => prev.filter(d => d.id !== id));
        try {
            const destDocRef = doc(db, 'destinations', `dest_${id}`);
            await deleteDoc(destDocRef);
        } catch (error: any) {
            console.error('Failed to delete destination from Firestore:', error);
            throw error;
        }
    };

    return (
        <DestinationContext.Provider value={{
            destinations,
            loading,
            updateDestination,
            addDestination,
            deleteDestination,
            seedInitialDestinations
        }}>
            {children}
        </DestinationContext.Provider>
    );
};

export const useDestinations = (): DestinationContextType => {
    const context = useContext(DestinationContext);
    if (!context) {
        throw new Error('useDestinations must be used within a DestinationProvider');
    }
    return context;
};
