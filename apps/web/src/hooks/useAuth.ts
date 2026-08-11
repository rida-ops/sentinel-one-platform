import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    setLoading(false);
  }, []);

  return { user, accessToken, loading, isAuthenticated: !!user };
}
