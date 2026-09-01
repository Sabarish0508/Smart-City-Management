import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken, setToken, getUser, setUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState(getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authAPI
        .getCurrentUser()
        .then((userData) => {
          setCurrentUserState(userData);
          setUser(userData);
        })
        .catch(() => {
          // Token may be invalid/expired
          setToken(null);
          setUser(null);
          setCurrentUserState(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const loginCitizen = async (email, password) => {
    const res = await authAPI.login(email, password);
    setToken(res.token);
    setUser(res);
    setCurrentUserState(res);
    return res;
  };

  const loginOfficial = async (email, password, role) => {
    const res = await authAPI.loginOfficial(email, password, role);
    setToken(res.token);
    setUser(res);
    setCurrentUserState(res);
    return res;
  };

  const registerCitizen = async (data) => {
    const res = await authAPI.registerCitizen(data);
    setToken(res.token);
    setUser(res);
    setCurrentUserState(res);
    return res;
  };

  const registerOfficial = async (data) => {
    const res = await authAPI.registerOfficial(data);
    setToken(res.token);
    setUser(res);
    setCurrentUserState(res);
    return res;
  };

  const updateProfile = async (profileData) => {
    const res = await authAPI.updateProfile(profileData);
    // Keep existing token and merge new user details
    const updatedUser = {
      ...currentUser,
      ...res,
      token: currentUser?.token || getToken(),
    };
    setUser(updatedUser);
    setCurrentUserState(updatedUser);
    return updatedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCurrentUserState(null);
  };

  const value = {
    user: currentUser,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'ROLE_ADMIN',
    isDeptHead: currentUser?.role === 'ROLE_HEAD',
    isOfficer: currentUser?.role === 'ROLE_OFFICER',
    isCitizen: currentUser?.role === 'ROLE_CITIZEN',
    loginCitizen,
    loginOfficial,
    registerCitizen,
    registerOfficial,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
