import React from 'react';
import styled from 'styled-components';
import { X, Calendar as CalendarIcon, Clock, User, MessageSquare } from 'react-feather';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }
  }
`;

const IconInput = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
  
  input, select {
    padding-left: 40px !important;
  }
`;

const SubmitButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  transition: background 0.2s;
  
  &:hover {
    background: #3a7bc8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const AppointmentBookingModal = ({ isOpen, onClose, doctor }) => {
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
        
        <h2>Book an Appointment</h2>
        {doctor && (
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            With Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="date">Appointment Date</label>
            <IconInput>
              <CalendarIcon size={20} />
              <input 
                type="date" 
                id="date" 
                required 
                min={new Date().toISOString().split('T')[0]}
              />
            </IconInput>
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="time">Preferred Time</label>
            <IconInput>
              <Clock size={20} />
              <select id="time" required>
                <option value="">Select a time</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
              </select>
            </IconInput>
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="name">Full Name</label>
            <IconInput>
              <User size={20} />
              <input 
                type="text" 
                id="name" 
                placeholder="Enter your full name" 
                required 
              />
            </IconInput>
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              placeholder="Enter your phone number" 
              required 
              pattern="[0-9]{10}"
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="notes">Additional Notes (Optional)</label>
            <IconInput>
              <MessageSquare size={20} />
              <textarea 
                id="notes" 
                rows="3" 
                placeholder="Any specific concerns or questions?"
              />
            </IconInput>
          </FormGroup>
          
          <SubmitButton type="submit">
            Book Appointment
          </SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AppointmentBookingModal;
