import React, { useState } from 'react';
import styled from 'styled-components';
import { Sun, Moon, Info } from 'react-feather';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const HeaderContainer = styled.header`
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.textPrimary};
  padding: 1rem 0;
  box-shadow: ${props => props.theme.colors.shadow};
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.accentGold};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${props => props.theme.colors.surfaceElevated};
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;

  &:hover {
    color: ${props => props.theme.colors.accentGold};
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: 2px solid ${props => props.theme.colors.surfaceElevated};
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.surfaceElevated};

  &:hover {
    background: ${props => props.theme.colors.accentGold};
    color: ${props => props.theme.colors.background};
    transform: rotate(180deg);
  }
`;

const InfoButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.surfaceElevated};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-left: 1rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${props => props.theme.colors.accentGold};
    transform: scale(1.1);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-size: 0.95rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.colors.shadowLg};
  }
`;

const PrimaryButton = styled(Button)`
  background: ${props => props.theme.gradients.accent};
  color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.colors.shadow};
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.surfaceElevated};
  border: 2px solid ${props => props.theme.colors.surfaceElevated};
`;

const UserInfo = styled.div`
  color: ${props => props.theme.colors.surfaceElevated};
  font-weight: 600;
`;

const Header = ({ user, onLogin, onLogout, toggleTheme, isDarkMode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginSuccess = (userData) => {
    onLogin(userData);
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo>AyurSutra</Logo>
        <InfoButton onClick={() => alert('AyurSutra - Your Ayurvedic Health Companion\n\nManage your wellness journey with our comprehensive platform.')}>
          <Info size={20} />
        </InfoButton>
        <NavControls>
          <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeToggle>
          {user ? (
            <AuthButtons>
              <UserInfo>Welcome, {user.name}</UserInfo>
              <SecondaryButton onClick={onLogout}>Logout</SecondaryButton>
            </AuthButtons>
          ) : (
            <AuthButtons>
              <SecondaryButton onClick={() => setShowLoginModal(true)}>
                Login
              </SecondaryButton>
              <PrimaryButton onClick={() => setShowRegisterModal(true)}>
                Register
              </PrimaryButton>
            </AuthButtons>
          )}
        </NavControls>
      </Nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </HeaderContainer>
  );
};

export default Header;
