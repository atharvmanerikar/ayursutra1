import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, error: authError } = useAuth();

  // UI state
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Update error state when authError changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Registration flow
        if (!form.name || !form.email || !form.password) {
          throw new Error('Please fill in all fields to register.');
        }
        
        await register({
          name: form.name,
          email: form.email,
          password: form.password
        });
        
        // On successful registration, the user will be automatically logged in
        // and the useEffect will handle the redirect
      } else {
        // Login flow
        if (!form.email || !form.password) {
          throw new Error('Please enter both email and password');
        }
        
        await login(form.email, form.password);
        // On successful login, the useEffect will handle the redirect
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError('');
    setIsRegister((v) => !v);
    setForm({ name: '', email: '', password: '' });
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
  };

  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '4rem auto',
        padding: '2rem',
        background: 'var(--surface-elevated, #fff)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow, 0 6px 18px rgba(0,0,0,0.08))',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--primary-green, #0f9d58)', marginBottom: '0.25rem' }}>
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: 'var(--text-secondary, #6b7280)', marginTop: 0 }}>
          {isRegister
            ? 'Join AyurSutra to access personalized healthcare'
            : 'Sign in to access your dashboard'}
        </p>
      </div>

      {error && (
        <div
          style={{
            background: 'var(--error-bg, #FEE2E2)',
            color: 'var(--error, #DC2626)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="mb-3" style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.35rem' }}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your full name"
              className="form-control"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}
              disabled={loading}
            />
          </div>
        )}

        <div className="mb-3" style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.35rem' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
            className="form-control"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3" style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.35rem' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            className="form-control"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}
            required
            disabled={loading}
          />
        </div>

        {!isRegister && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div>
              <input type="checkbox" id="rememberMe" disabled={loading} />
              <label htmlFor="rememberMe" style={{ marginLeft: '0.4rem' }}>
                Remember me
              </label>
            </div>
            <div>
              <Link
                to="/forgot-password"
                style={{ textDecoration: 'none', fontSize: '0.9rem', color: 'var(--primary-green, #0f9d58)' }}
              >
                Forgot password?
              </Link>
            </div>
          </div>
        )}

        <button
          type="submit"
          style={{
            ...buttonStyle,
            background: 'var(--primary-green, #0f9d58)',
            color: '#fff',
            opacity: loading ? 0.85 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          {loading ? (isRegister ? 'Creating...' : 'Signing in...') : isRegister ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--text-secondary, #6b7280)' }}>
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <button
          onClick={toggleMode}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-green, #0f9d58)',
            cursor: 'pointer',
            fontWeight: 600,
            padding: '0.25rem 0.5rem',
            fontSize: '1rem',
          }}
        >
          {isRegister ? 'Sign in' : 'Sign up'}
        </button>
      </p>

      {!isRegister && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary, #6b7280)', marginBottom: '0.75rem' }}>Demo Accounts:</p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              maxWidth: '360px',
              margin: '0 auto',
              background: 'var(--surface, #fafafa)',
              padding: '0.9rem',
              borderRadius: '8px',
              boxShadow: 'var(--shadow, 0 4px 12px rgba(0,0,0,0.04))',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <strong>Admin:</strong> admin@example.com
              <br />
              <strong>Password:</strong> password
            </div>
            <div style={{ textAlign: 'left' }}>
              <strong>Doctor:</strong> doctor@example.com
              <br />
              <strong>Password:</strong> password
            </div>
            <div style={{ textAlign: 'left' }}>
              <strong>Patient:</strong> patient@example.com
              <br />
              <strong>Password:</strong> password
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
