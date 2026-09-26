import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuditLogEntry } from '../types';
import { db, auth } from '../firebase';
import { 
    collection, 
    onSnapshot, 
    doc, 
    setDoc, 
    query, 
    orderBy, 
    limit 
} from 'firebase/firestore';

interface AuditLogContextType {
    logs: AuditLogEntry[];
    loading: boolean;
    addLog: (action: 'CREATE' | 'EDIT' | 'DELETE' | 'STATUS_CHANGE' | 'LOGIN', details: string) => Promise<void>;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const AuditLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auditLogsCol = collection(db, 'auditLogs');
        const q = query(auditLogsCol, orderBy('timestamp', 'desc'), limit(100));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedLogs: AuditLogEntry[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data() as AuditLogEntry;
                loadedLogs.push({ ...data, id: data.id || docSnap.id });
            });
            setLogs(loadedLogs);
            setLoading(false);
        }, (error) => {
            console.warn('Could not fetch audit logs from Firestore:', error?.message || error);
            // Fallback to localStorage if any
            try {
                const storedLogs = localStorage.getItem('auditLogs');
                if (storedLogs) setLogs(JSON.parse(storedLogs));
            } catch (e) {
                // ignore
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addLog = async (action: 'CREATE' | 'EDIT' | 'DELETE' | 'STATUS_CHANGE' | 'LOGIN', details: string) => {
        const currentEmail = auth.currentUser?.email || (sessionStorage.getItem('isAdminAuthenticated') ? 'admin' : 'system');
        const logId = Date.now();
        const newLog: AuditLogEntry = {
            id: logId,
            action,
            details,
            adminUser: currentEmail,
            timestamp: new Date().toISOString(),
        };

        try {
            const docRef = doc(db, 'auditLogs', `log_${logId}`);
            await setDoc(docRef, newLog);
        } catch (error) {
            console.error('Error writing audit log to Firestore:', error);
            setLogs(prev => [newLog, ...prev]);
        }
    };

    return (
        <AuditLogContext.Provider value={{ logs, loading, addLog }}>
            {children}
        </AuditLogContext.Provider>
    );
};

export const useAuditLog = (): AuditLogContextType => {
    const context = useContext(AuditLogContext);
    if (context === undefined) {
        throw new Error('useAuditLog must be used within an AuditLogProvider');
    }
    return context;
};
