import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock login function - replace with actual authentication logic
  const login = (credentials) => {
    // In a real app, you would make an API call here
    console.log('Login with:', credentials);
    setUser({
      id: '1',
      name: 'John Doe',
      email: credentials.email,
      role: 'patient', // or 'doctor', 'admin'
    });
    setShowLogin(false);
  };

  // Mock register function
  const register = (userData) => {
    // In a real app, you would make an API call here
    console.log('Register with:', userData);
    setUser({
      id: '1',
      name: userData.name,
      email: userData.email,
      role: 'patient',
    });
    setShowRegister(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You might want to save this preference to localStorage
    localStorage.setItem('darkMode', !isDarkMode);
  };

  const value = {
    showLogin,
    setShowLogin,
    showRegister,
    setShowRegister,
    user,
    setUser,
    login,
    register,
    logout,
    isDarkMode,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
