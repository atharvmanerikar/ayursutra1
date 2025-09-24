import React, { useState } from 'react';
import styled from 'styled-components';
import { X } from 'react-feather';

const ModalOverlay = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surfaceElevated};
  margin: 5% auto;
  padding: 4rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  position: relative;
  animation: slideIn 0.4s ease;
  box-shadow: ${props => props.theme.colors.shadowLg};
  border: 1px solid ${props => props.theme.colors.border};

  @keyframes slideIn {
    from { transform: translateY(-50px) scale(0.9); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 10% auto;
  }
`;

const CloseButton = styled.button`
  color: ${props => props.theme.colors.textMuted};
  background: none;
  border: none;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primaryGreen};
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2.5rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.05rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primaryGreen};
    box-shadow: 0 0 0 3px rgba(45, 122, 95, 0.1);
    transform: translateY(-2px);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primaryGreen};
    box-shadow: 0 0 0 3px rgba(45, 122, 95, 0.1);
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background: ${props => props.theme.gradients.accent};
  color: ${props => props.theme.colors.background};
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.colors.shadow};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.colors.shadowLg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SwitchLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primaryGreen};
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

const RegisterModal = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    userType: '',
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userType || !formData.fullName || !formData.email || !formData.phone || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      alert(`Welcome to AyurSutra, ${formData.fullName}! Your ${formData.userType} account has been created successfully. Please login with your credentials.`);
      onRegister();
      setIsLoading(false);
      setFormData({ userType: '', fullName: '', email: '', phone: '', password: '' });
    }, 1500);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
        <Title>Join AyurSutra</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="userType">User Type</Label>
            <Select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">Select Your Role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="therapist">Therapist</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>
        <SwitchText>
          Already have an account?{' '}
          <SwitchLink onClick={onSwitchToLogin}>
            Login here
          </SwitchLink>
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RegisterModal;
