import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Here you would typically make an API call to register the user
    console.log('Registering user:', formData);
    
    // For demo purposes, we'll just log in the user
    localStorage.setItem('ayur_user', JSON.stringify({
      name: formData.name,
      email: formData.email,
      role: formData.userType
    }));
    
    // Redirect to the appropriate dashboard
    navigate(`/${formData.userType}`);
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem' }}>
      <h2>Create an Account</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="userType">I am a:</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Register
        </button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Already have an account? <a href="/login" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Login here</a>
      </p>
    </div>
  );
}

export default Register;
