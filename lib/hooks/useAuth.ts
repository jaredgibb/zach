import { useEffect, useState } from 'react';
import { auth } from '@/lib/supabase/client';
import {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      User,
} from 'firebase/auth';

export function useAuth() {
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            // Listen for auth state changes
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                  setUser(currentUser);
                  setLoading(false);
            }, (err) => {
                  setError(err?.message || 'Failed to get user');
                  setLoading(false);
            });

            return () => unsubscribe();
      }, []);

      const signUp = async (email: string, password: string) => {
            try {
                  setError(null);
                  const result = await createUserWithEmailAndPassword(auth, email, password);
                  setUser(result.user);
                  return result.user;
            } catch (err) {
                  const message = err instanceof Error ? err.message : 'Failed to sign up';
                  setError(message);
                  throw err;
            }
      };

      const signIn = async (email: string, password: string) => {
            try {
                  setError(null);
                  const result = await signInWithEmailAndPassword(auth, email, password);
                  setUser(result.user);
                  return result.user;
            } catch (err) {
                  const message = err instanceof Error ? err.message : 'Failed to sign in';
                  setError(message);
                  throw err;
            }
      };

      const logout = async () => {
            try {
                  setError(null);
                  await signOut(auth);
                  setUser(null);
            } catch (err) {
                  const message = err instanceof Error ? err.message : 'Failed to sign out';
                  setError(message);
                  throw err;
            }
      };

      return { user, loading, error, signIn, signUp, logout };
}
