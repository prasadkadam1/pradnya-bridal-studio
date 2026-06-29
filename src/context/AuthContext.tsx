/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isFirebaseConfigured, auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
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

const ADMIN_ACCESS_ERROR =
  'This account is not authorized for admin access. In Firestore, create users/{your-uid} with role set to "admin" (document ID must be your Firebase UID, not your email).';

const resolveAdminUser = async (firebaseUser: { uid: string; email: string | null }) => {
  if (!db) {
    throw new Error('Firestore is not available. Check your Firebase configuration.');
  }

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (userDoc.exists() && userDoc.data()?.role === 'admin') {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: 'admin' as const,
    };
  }

  if (auth) {
    await signOut(auth);
  }

  throw new Error(ADMIN_ACCESS_ERROR);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMockMode = !isFirebaseConfigured;
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (!isMockMode) {
      return null;
    }

    const savedUser = sessionStorage.getItem('mock_admin_user');
    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as AuthUser;
    } catch {
      sessionStorage.removeItem('mock_admin_user');
      return null;
    }
  });
  const [loading, setLoading] = useState(() => !isMockMode);

  useEffect(() => {
    if (!isMockMode && auth) {
      const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            try {
              setUser(await resolveAdminUser(firebaseUser));
            } catch (error) {
              console.warn(
                error instanceof Error ? error.message : 'Admin access check failed.'
              );
              setUser(null);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error resolving admin session:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });
      return unsubscribe;
    } else {
      return undefined;
    }
  }, [isMockMode]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!isMockMode && auth) {
        const credential = await signInWithEmailAndPassword(auth!, email, password);
        setUser(await resolveAdminUser(credential.user));
      } else if (email === 'admin@pradnya.com' && password === 'admin123') {
        const mockUser: AuthUser = {
          uid: 'mock-admin-uid',
          email: 'admin@pradnya.com',
          role: 'admin',
        };
        sessionStorage.setItem('mock_admin_user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw new Error('Invalid admin credentials. Use admin@pradnya.com / admin123 for Mock Mode.');
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message === ADMIN_ACCESS_ERROR) {
        throw error;
      }

      throw new Error(
        error instanceof Error ? error.message : 'Authentication failed',
        { cause: error }
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    if (!isMockMode && auth) {
      await signOut(auth!);
    } else {
      sessionStorage.removeItem('mock_admin_user');
      setUser(null);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
