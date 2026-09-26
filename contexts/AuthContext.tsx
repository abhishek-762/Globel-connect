import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    auth, 
    googleProvider, 
    signInWithPopup, 
    firebaseSignOut, 
    onAuthStateChanged,
    FirebaseUser,
    db
} from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
    user: FirebaseUser | null;
    userProfile: UserProfile | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<boolean>;
    login: (user: string, pass: string) => boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin emails that get admin role automatically upon signing in
const ADMIN_EMAILS = [
    'abhiyadav762@gmail.com',
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLegacyAdmin, setIsLegacyAdmin] = useState<boolean>(() => {
        return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    });
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // Fetch or create user profile document in Firestore
    const syncUserProfile = async (firebaseUser: FirebaseUser) => {
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            const userEmail = (firebaseUser.email || '').toLowerCase();
            const shouldBeAdmin = ADMIN_EMAILS.includes(userEmail);

            if (userSnap.exists()) {
                const data = userSnap.data() as UserProfile;
                // If they are designated admin email, ensure role is admin
                if (shouldBeAdmin && data.role !== 'admin') {
                    await setDoc(userRef, { role: 'admin' }, { merge: true });
                    data.role = 'admin';
                }
                setUserProfile(data);
            } else {
                const newProfile: UserProfile = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Traveler',
                    photoURL: firebaseUser.photoURL || undefined,
                    role: shouldBeAdmin ? 'admin' : 'customer',
                    createdAt: new Date().toISOString(),
                };
                await setDoc(userRef, newProfile);
                setUserProfile(newProfile);
            }
        } catch (error) {
            console.error('Error syncing user profile with Firestore:', error);
            // Fallback profile if Firestore is momentarily unreachable
            const userEmail = (firebaseUser.email || '').toLowerCase();
            setUserProfile({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Traveler',
                photoURL: firebaseUser.photoURL || undefined,
                role: ADMIN_EMAILS.includes(userEmail) ? 'admin' : 'customer',
                createdAt: new Date().toISOString(),
            });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await syncUserProfile(currentUser);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async (): Promise<boolean> => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                await syncUserProfile(result.user);
                return true;
            }
            return false;
        } catch (error: any) {
            if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
                console.info('Google sign-in popup was dismissed by the user.');
            } else {
                console.warn('Google sign-in could not be completed:', error?.message || error);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Legacy credential login kept for admin console compatibility
    const login = (u: string, p: string): boolean => {
        if (u === 'admin' && p === 'password123') {
            setIsLegacyAdmin(true);
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin/dashboard');
            return true;
        }
        return false;
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (e) {
            console.error('Error signing out:', e);
        }
        setIsLegacyAdmin(false);
        sessionStorage.removeItem('isAdminAuthenticated');
        setUser(null);
        setUserProfile(null);
        navigate('/');
    };

    const isAdmin = Boolean(
        isLegacyAdmin || 
        userProfile?.role === 'admin' || 
        (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
    );

    const isAuthenticated = Boolean(user || isLegacyAdmin);

    return (
        <AuthContext.Provider value={{ 
            user, 
            userProfile, 
            isAuthenticated, 
            isAdmin, 
            loading, 
            signInWithGoogle, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
