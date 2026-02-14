import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

interface AdminRecord {
      role?: string;
      active?: boolean;
}

export function useAdmin() {
      const { user, loading: authLoading } = useAuth();
      const [isAdmin, setIsAdmin] = useState(false);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            let isMounted = true;

            const checkAdmin = async () => {
                  if (authLoading) {
                        return;
                  }

                  if (!user) {
                        if (isMounted) {
                              setIsAdmin(false);
                              setLoading(false);
                              setError(null);
                        }
                        return;
                  }

                  try {
                        setLoading(true);
                        setError(null);
                        const adminRef = doc(db, 'admins', user.uid);
                        const snapshot = await getDoc(adminRef);
                        const data = snapshot.exists() ? (snapshot.data() as AdminRecord) : null;
                        const active = data?.active !== false;
                        const roleIsAdmin = data?.role === 'admin';
                        if (isMounted) {
                              setIsAdmin(Boolean(active && roleIsAdmin));
                        }
                  } catch (err) {
                        if (isMounted) {
                              setError(err instanceof Error ? err.message : 'Failed to verify admin status');
                              setIsAdmin(false);
                        }
                  } finally {
                        if (isMounted) {
                              setLoading(false);
                        }
                  }
            };

            checkAdmin();

            return () => {
                  isMounted = false;
            };
      }, [user, authLoading]);

      return {
            user,
            isAdmin,
            loading: authLoading || loading,
            error,
      };
}
