'use client';

// Import React hooks for context creation and state management
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create React Context for customer authentication and profile state
const AuthContext = createContext(null);

// AuthProvider component to wrap the application and share profile state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize customer state from localStorage & fetch live backend profile
  useEffect(() => {
    async function initAuth() {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedToken) {
          setToken(savedToken);
          // Fetch live customer profile from backend database
          const res = await fetch('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          const data = await res.json();
          if (res.ok && data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  // Function to update customer profile details in Context, localStorage, and backend
  const updateUserProfile = async (updatedFields) => {
    try {
      const payload = {
        full_name: updatedFields.name || updatedFields.full_name || user?.full_name || user?.name || '',
        phone: updatedFields.phone ?? user?.phone ?? '',
        address: updatedFields.address ?? user?.address ?? '',
      };

      const activeToken = token || localStorage.getItem('token');

      if (activeToken) {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok && data.success && data.user) {
          const merged = { ...user, ...data.user, full_name: data.user.full_name, name: data.user.full_name };
          setUser(merged);
          localStorage.setItem('user', JSON.stringify(merged));
          return { success: true };
        }
      }

      // Local state fallback if offline or backend warning
      const newUserState = {
        ...user,
        ...updatedFields,
        full_name: payload.full_name,
        name: payload.full_name,
        phone: payload.phone,
        address: payload.address,
      };

      setUser(newUserState);
      localStorage.setItem('user', JSON.stringify(newUserState));
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      const newUserState = { ...user, ...updatedFields };
      setUser(newUserState);
      localStorage.setItem('user', JSON.stringify(newUserState));
      return { success: true, warning: 'Saved locally.' };
    }
  };

  // Function to log out customer and clear session storage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/authentication/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, updateUserProfile, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      loading: false,
      updateUserProfile: async () => ({ success: false }),
      logout: () => {},
    };
  }
  return context;
};
