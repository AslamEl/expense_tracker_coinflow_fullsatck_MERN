import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken;
  });

  // Set up axios interceptor for authentication
  useEffect(() => {
    // Always set up the interceptor, but only add token if it exists
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Get the current token from localStorage to ensure we have the latest
        const currentToken = localStorage.getItem('token') || token;
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Also set the default headers for good measure
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }

    // Cleanup function to remove the interceptor when token changes
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Check if user is authenticated on app start
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          if (response.data.success) {
            setUser(response.data.data.user);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (emailOrUsername, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        emailOrUsername,
        password
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);

        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);

      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);

        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      const errors = error.response?.data?.errors || [];
      return { success: false, message, errors };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);

      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      const errors = error.response?.data?.errors || [];
      return { success: false, message, errors };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      return { success: false, message };
    }
  };

  const deleteAccount = async (password) => {
    try {
      const response = await axios.delete('/api/auth/delete-account', {
        data: { password }
      });

      if (response.data.success) {
        // Log out user after successful account deletion
        logout();
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Account deletion failed';
      return { success: false, message };
    }
  };

  // Function to update user data directly (for Settings component)
  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};