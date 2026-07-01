import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { authAPI } from '@/services/api';

export const useAuth = () => {
  const { token, setUser, logout } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, setUser, logout]);

  return { loading };
};
