
import { useState, useCallback } from 'react';

const ADMIN_PASSWORD = 'Prueba123';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login,
    logout
  };
};
