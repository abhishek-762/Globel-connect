import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Package } from '../types';
import { packages as initialPackages } from '../constants';
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

interface PackageContextType {
    packages: Package[];
    loading: boolean;
    updatePackage: (updatedPackage: Package) => Promise<void>;
    addPackage: (newPackage: Omit<Package, 'id'>) => Promise<void>;
    deletePackage: (id: number) => Promise<void>;
    seedInitialPackages: () => Promise<void>;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [packages, setPackages] = useState<Package[]>(initialPackages);
    const [loading, setLoading] = useState<boolean>(true);

    // Function to seed Firestore if empty
    const seedInitialPackages = async () => {
        try {
            const batch = writeBatch(db);
            for (const pkg of initialPackages) {
                const pkgDocRef = doc(db, 'packages', `pkg_${pkg.id}`);
                batch.set(pkgDocRef, pkg);
            }
            await batch.commit();
            console.log('Seeded initial packages to Firestore.');
        } catch (error: any) {
            console.warn('Could not seed initial packages to Firestore:', error?.message || error);
        }
    };

    useEffect(() => {
        const packagesCol = collection(db, 'packages');

        // Check if database needs seeding or syncing
        const checkAndSeed = async () => {
            try {
                const snapshot = await getDocs(packagesCol);
                if (snapshot.empty) {
                    console.log('No packages found in Firestore. Seeding curated packages...');
                    await seedInitialPackages();
                } else {
                    // Check if newly introduced curated packages (e.g. Varanasi) are missing
                    const existingIds = new Set<number>();
                    snapshot.forEach(docSnap => {
                        const data = docSnap.data() as Package;
                        if (data.id) existingIds.add(data.id);
                    });
                    const missingPackages = initialPackages.filter(p => !existingIds.has(p.id));
                    if (missingPackages.length > 0) {
                        const batch = writeBatch(db);
                        for (const missing of missingPackages) {
                            const ref = doc(db, 'packages', `pkg_${missing.id}`);
                            batch.set(ref, missing);
                        }
                        await batch.commit();
                        console.log(`Synced ${missingPackages.length} newly added curated packages to Firestore.`);
                    }
                }
            } catch (err: any) {
                console.warn('Could not check packages collection, using fallback:', err?.message || err);
            }
        };

        checkAndSeed();

        // Subscribe to real-time updates from Firestore
        const unsubscribe = onSnapshot(packagesCol, (snapshot) => {
            if (!snapshot.empty) {
                const loadedPackages: Package[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as Package;
                    loadedPackages.push(data);
                });
                // Sort by ID ascending
                loadedPackages.sort((a, b) => a.id - b.id);
                setPackages(loadedPackages);
            } else {
                setPackages(initialPackages);
            }
            setLoading(false);
        }, (error: any) => {
            console.warn('Could not fetch packages from Firestore, using local defaults:', error?.message || error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addPackage = async (newPackage: Omit<Package, 'id'>) => {
        try {
            const newId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
            const packageToAdd: Package = { id: newId, ...newPackage };
            const docRef = doc(db, 'packages', `pkg_${newId}`);
            await setDoc(docRef, packageToAdd);
        } catch (error) {
            console.error('Error adding package to Firestore:', error);
            // Fallback local update
            const newId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
            setPackages(prev => [...prev, { id: newId, ...newPackage }]);
        }
    };

    const updatePackage = async (updatedPackage: Package) => {
        try {
            const docRef = doc(db, 'packages', `pkg_${updatedPackage.id}`);
            await setDoc(docRef, updatedPackage, { merge: true });
        } catch (error) {
            console.error('Error updating package in Firestore:', error);
            // Fallback local update
            setPackages(prev => prev.map(p => p.id === updatedPackage.id ? updatedPackage : p));
        }
    };

    const deletePackage = async (id: number) => {
        try {
            const docRef = doc(db, 'packages', `pkg_${id}`);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting package from Firestore:', error);
            // Fallback local update
            setPackages(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <PackageContext.Provider value={{ 
            packages, 
            loading, 
            updatePackage, 
            addPackage, 
            deletePackage,
            seedInitialPackages 
        }}>
            {children}
        </PackageContext.Provider>
    );
};

export const usePackages = (): PackageContextType => {
    const context = useContext(PackageContext);
    if (context === undefined) {
        throw new Error('usePackages must be used within a PackageProvider');
    }
    return context;
};