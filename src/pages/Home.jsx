import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { setShowLogin, setShowRegister } = useContext(AppContext) || {};

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <h1>AyurSutra</h1>
          <p>
            Personalized Ayurveda care. Book expert consultations, track your treatments, and
            manage your wellness journey in one beautiful dashboard.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => (setShowRegister ? setShowRegister(true) : navigate('/patient'))}>
              Get Started
            </button>
            <button className="btn" onClick={() => (setShowLogin ? setShowLogin(true) : navigate('/patient'))}>
              Login
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
