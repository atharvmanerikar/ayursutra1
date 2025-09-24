import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import HomePage from './pages/Home';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { lightTheme, darkTheme } from './styles/theme';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: ${props => props.theme.colors.textPrimary};
    background: ${props => props.theme.colors.background};
    transition: all 0.3s ease;
    overflow-x: hidden;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  a {
    text-decoration: none;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // redirect to respective dashboard
    if (userData?.userType === 'patient') {
      navigate('/patient-dashboard');
    } else if (userData?.userType === 'doctor') {
      navigate('/doctor-dashboard');
    } else if (userData?.userType === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Header 
          user={user} 
          onLogin={handleLogin} 
          onLogout={handleLogout}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/patient-dashboard" 
            element={
              user && user.userType === 'patient' ? 
              <PatientDashboard user={user} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/doctor-dashboard" 
            element={
              user && user.userType === 'doctor' ? 
              <DoctorDashboard user={user} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              user && user.userType === 'admin' ? 
              <AdminDashboard user={user} /> : 
              <Navigate to="/" />
            } 
          />
        </Routes>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
