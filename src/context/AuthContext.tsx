/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { isFirebaseConfigured, auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { AuthUser } from '../types/studio';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const MOCK_ADMIN = { uid: 'mock-admin-uid', email: 'admin@pradnya.com', role: 'admin' as const };
const ADMIN_ACCESS_ERROR =
  'This account is not authorized for admin access. Create a users/{your-uid} document in Firestore with role set to "admin" (the document ID must be your Firebase UID).';

// A client session is admitted only after both Firebase Authentication and the
// matching Firestore role document have been verified.
const resolveAdminUser = async (firebaseUser: User): Promise<AuthUser> => {
  if (!db) throw new Error('Firestore is unavailable. Check the Firebase configuration.');

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  if (userDoc.exists() && userDoc.data().role === 'admin') {
    return { uid: firebaseUser.uid, email: firebaseUser.email, role: 'admin' };
  }

  throw new Error(ADMIN_ACCESS_ERROR);
};

const clearUnauthorizedSession = async () => {
  if (auth?.currentUser) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Could not clear unauthorized Firebase session:', error);
    }
  }
};

const isValidMockSession = (value: unknown): value is AuthUser => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AuthUser>;
  return candidate.uid === MOCK_ADMIN.uid && candidate.email === MOCK_ADMIN.email && candidate.role === 'admin';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock credentials exist only for local development. A production build with
  // missing/broken Firebase configuration fails closed instead of granting demo access.
  const isMockMode = import.meta.env.DEV && !isFirebaseConfigured;
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (!isMockMode) return null;
    try {
      const savedUser = sessionStorage.getItem('mock_admin_user');
      if (!savedUser) return null;
      const parsed: unknown = JSON.parse(savedUser);
      if (isValidMockSession(parsed)) return parsed;
    } catch {
      // Clear malformed local demo sessions below.
    }
    sessionStorage.removeItem('mock_admin_user');
    return null;
  });
  const [loading, setLoading] = useState(() => !isMockMode && !!auth);

  useEffect(() => {
    if (isMockMode) return undefined;
    if (!auth) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (!firebaseUser) {
          if (active) setUser(null);
          return;
        }
        const adminUser = await resolveAdminUser(firebaseUser);
        if (active) setUser(adminUser);
      } catch (error) {
        if (active) setUser(null);
        if (error instanceof Error && error.message === ADMIN_ACCESS_ERROR) {
          await clearUnauthorizedSession();
        } else {
          console.error('Admin role verification failed:', error);
        }
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [isMockMode]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setUser(null);
    try {
      if (isMockMode) {
        if (email.trim().toLowerCase() !== MOCK_ADMIN.email || password !== 'admin123') {
          throw new Error('Invalid demo credentials. Use the credentials shown for local development.');
        }
        sessionStorage.setItem('mock_admin_user', JSON.stringify(MOCK_ADMIN));
        setUser(MOCK_ADMIN);
        return;
      }

      if (!isFirebaseConfigured || !auth || !db) {
        throw new Error('Admin sign-in is unavailable because Firebase is not fully configured.');
      }

      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      try {
        setUser(await resolveAdminUser(credential.user));
      } catch (error) {
        await clearUnauthorizedSession();
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setUser(null);
      if (isMockMode) {
        sessionStorage.removeItem('mock_admin_user');
      } else if (auth) {
        await signOut(auth);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
