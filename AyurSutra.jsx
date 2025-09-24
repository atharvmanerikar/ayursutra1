/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import feather from "feather-icons";

// Single-file React conversion of aay.html
// Default export: AyurSutra component
// Usage: import AyurSutra from './AyurSutra.React.jsx' and render <AyurSutra /> inside your React app

export default function AyurSutra() {
  // Theme
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch (e) {
      return "light";
    }
  });

  // Modal & dashboard state
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isPatientDashboard, setIsPatientDashboard] = useState(false);

  // Refs
  const particlesRef = useRef(null);
  const mainContentRef = useRef(null);
  const revealsRef = useRef([]);

  // Effect: apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
    updateThemeIcon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Feather icons helper
  // Call to update feather icons after DOM changes

  function updateThemeIcon() {
    // For accessibility we keep a small data attribute on the body (icon handled in JSX)
    // We'll call feather.replace after updating DOM
    setTimeout(() => {
      try { feather.replace(); } catch (e) {}
    }, 50);
  }

  // Particles creation
  useEffect(() => {
    // Ensure feather icons render once on mount as well
    try { feather.replace(); } catch (e) {}

    let particleIntervals = [];
    let globalInterval = null;

    function createParticles() {
      const container = particlesRef.current;
      if (!container) return;
      const particleCount = 15;

      for (let i = 0; i < particleCount; i++) {
        const timeout = setTimeout(() => {
          const particle = document.createElement("div");
          particle.className = "particle";
          particle.style.left = Math.random() * 100 + "%";
          particle.style.animationDelay = Math.random() * 15 + "s";
          particle.style.animationDuration = (Math.random() * 10 + 10) + "s";
          container.appendChild(particle);

          // remove after 20s
          const removeTimeout = setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }, 20000);

          particleIntervals.push(removeTimeout);
        }, i * 200);
        particleIntervals.push(timeout);
      }
    }

    createParticles();
    globalInterval = setInterval(createParticles, 15000);

    return () => {
      if (globalInterval) clearInterval(globalInterval);
      particleIntervals.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Modal close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setShowLogin(false);
        setShowRegister(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Smooth scrolling for internal anchors
  useEffect(() => {
    function handler(e) {
      const anchor = e.target.closest("a[href^='#']");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Scroll reveal & intersection observer for cards
  useEffect(() => {
    const reveals = document.querySelectorAll(".scroll-reveal");
    const onScroll = () => {
      reveals.forEach((reveal) => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        if (revealTop < windowHeight - revealPoint) {
          reveal.classList.add("revealed");
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    // Intersection observer for cards stagger
    const cards = document.querySelectorAll(".dashboard-card, .feature-card, .stat-card");
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
          }, index * 100);
        }
      });
    }, observerOptions);

    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px) scale(0.95)";
      card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
      observer.observe(card);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // Typing effect for hero title
  useEffect(() => {
    const heroTitle = document.querySelector(".hero h1");
    if (!heroTitle) return;
    const text = "AyurSutra";
    heroTitle.innerHTML = "";
    let i = 0;
    let mounted = true;

    function type() {
      if (!mounted) return;
      if (i < text.length) {
        heroTitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, 150);
      }
    }
    type();

    return () => {
      mounted = false;
    };
  }, []);

  // Stats animation
  useEffect(() => {
    function animateStats() {
      const statNumbers = document.querySelectorAll(".stat-number");
      statNumbers.forEach((stat) => {
        const finalNumber = stat.innerText;
        let currentNumber = 0;
        const numeric = parseInt(finalNumber);
        const increment = finalNumber.includes("%") ? numeric / 20 : numeric / 10;
        const counter = setInterval(() => {
          currentNumber += increment;
          if (currentNumber >= numeric) {
            stat.innerText = finalNumber;
            clearInterval(counter);
          } else {
            stat.innerText = Math.floor(currentNumber) + (finalNumber.includes("%") ? "%" : "");
          }
        }, 50);
      });
    }

    // Trigger when patient dashboard shown
    if (isPatientDashboard) animateStats();
  }, [isPatientDashboard]);

  // Login form submit
  function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const userType = form.userType.value;
    const email = form.email.value;
    const submitBtn = form.querySelector("button[type=submit]");

    if (userType && email) {
      submitBtn.innerHTML = "Logging in...";
      submitBtn.disabled = true;
      setTimeout(() => {
        setShowLogin(false);
        if (userType === "patient") {
          // hide main content and show patient dashboard
          setIsPatientDashboard(true);
        } else {
          alert(`Welcome to ${userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard! \n\nFull dashboard interface coming soon with advanced features tailored for your role.`);
        }
        submitBtn.innerHTML = "Login to Dashboard";
        submitBtn.disabled = false;
      }, 1500);
    }
  }

  // Register form submit
  function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const fullName = form.fullName.value;
    const userType = form.regUserType.value;
    const submitBtn = form.querySelector("button[type=submit]");

    if (fullName && userType) {
      submitBtn.innerHTML = "Creating Account...";
      submitBtn.disabled = true;
      setTimeout(() => {
        alert(`Welcome to AyurSutra, ${fullName}! \n\nYour ${userType} account has been created successfully. Please login with your credentials.`);
        setShowRegister(false);
        setShowLogin(true);
        submitBtn.innerHTML = "Create Account";
        submitBtn.disabled = false;
      }, 1500);
    }
  }

  function logout() {
    if (window.confirm("Are you sure you want to logout?")) {
      setIsPatientDashboard(false);
    }
  }

  return (
    <div>
      {/* Inline CSS preserved from original file */}
      <style>{`
      * { margin: 0; padding: 0; box-sizing: border-box; }
      :root { --primary-green: #1b4d3e; --secondary-green: #2d7a5f; --accent-gold: #d4af37; --light-green: #e8f5e8; --background: #ffffff; --surface: #f8fffe; --surface-elevated: #ffffff; --text-primary: #1a1a1a; --text-secondary: #4a5568; --text-muted: #718096; --border: #e2e8f0; --border-hover: #cbd5e0; --shadow: 0 4px 12px rgba(0, 0, 0, 0.15); --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15); --gradient-primary: linear-gradient(135deg, #1b4d3e 0%, #2d7a5f 100%); --gradient-accent: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); --gradient-bg: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%); }
      [data-theme="dark"] { --primary-green: #4ade80; --secondary-green: #22c55e; --accent-gold: #fbbf24; --light-green: #1f2937; --background: #0f172a; --surface: #1e293b; --surface-elevated: #334155; --text-primary: #f8fafc; --text-secondary: #cbd5e1; --text-muted: #94a3b8; --border: #334155; --border-hover: #475569; --shadow: 0 4px 12px rgba(0, 0, 0, 0.4); --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.4); --gradient-primary: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); --gradient-accent: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); --gradient-bg: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: var(--text-primary); background: var(--background); transition: all 0.3s ease; overflow-x: hidden; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2; }
      .animated-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
      .floating-shapes { position: absolute; width: 100%; height: 100%; }
      .shape { position: absolute; opacity: 0.1; animation: float 20s infinite ease-in-out; }
      .shape:nth-child(1) { top: 10%; left: 10%; width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; animation-delay: 0s; }
      .shape:nth-child(2) { top: 20%; right: 10%; width: 120px; height: 60px; background: var(--gradient-accent); border-radius: 30px; animation-delay: 3s; }
      .shape:nth-child(3) { bottom: 30%; left: 5%; width: 100px; height: 100px; background: var(--gradient-primary); border-radius: 20px; animation-delay: 6s; transform: rotate(45deg); }
      .shape:nth-child(4) { bottom: 20%; right: 20%; width: 90px; height: 90px; background: var(--gradient-accent); border-radius: 50%; animation-delay: 9s; }
      .shape:nth-child(5) { top: 50%; left: 50%; width: 60px; height: 150px; background: var(--gradient-primary); border-radius: 30px; animation-delay: 12s; }
      @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; } 33% { transform: translateY(-30px) rotate(120deg); opacity: 0.2; } 66% { transform: translateY(30px) rotate(240deg); opacity: 0.15; } }
      .particles { position: absolute; width: 100%; height: 100%; }
      .particle { position: absolute; width: 4px; height: 4px; background: var(--primary-green); border-radius: 50%; opacity: 0.3; animation: rise 15s infinite linear; }
      @keyframes rise { 0% { bottom: -10px; opacity: 0; transform: translateX(0px); } 10% { opacity: 0.3; } 90% { opacity: 0.3; } 100% { bottom: 100vh; opacity: 0; transform: translateX(100px); } }
      .header { background: var(--gradient-primary); color: var(--text-primary); padding: 1rem 0; box-shadow: var(--shadow); position: relative; z-index: 10; backdrop-filter: blur(10px); }
      .nav { display: flex; justify-content: space-between; align-items: center; }
      .logo { font-size: 2rem; font-weight: bold; color: var(--accent-gold); text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
      .nav-links { display: flex; list-style: none; gap: 2rem; }
      .nav-links a { color: var(--surface-elevated); text-decoration: none; font-weight: 600; transition: all 0.3s ease; padding: 0.5rem 1rem; border-radius: 8px; }
      .nav-links a:hover { color: var(--accent-gold); background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
      .nav-controls { display: flex; align-items: center; gap: 1rem; }
      .theme-toggle { background: transparent; border: 2px solid var(--surface-elevated); border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; color: var(--surface-elevated); }
      .theme-toggle:hover { background: var(--accent-gold); color: var(--background); transform: rotate(180deg); }
      .auth-buttons { display: flex; gap: 1rem; }
      .btn { padding: 0.875rem 2rem; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; text-decoration: none; display: inline-block; transition: all 0.3s ease; position: relative; overflow: hidden; font-size: 0.95rem; }
      .btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.5s; }
      .btn:hover::before { left: 100%; }
      .btn-primary { background: var(--gradient-accent); color: var(--background); box-shadow: var(--shadow); }
      .btn-secondary { background: transparent; color: var(--surface-elevated); border: 2px solid var(--surface-elevated); }
      .btn:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
      .hero { background: var(--gradient-bg); padding: 8rem 0; text-align: center; position: relative; z-index: 1; min-height: 80vh; display: flex; align-items: center; }
      .hero-content { position: relative; z-index: 2; }
      .hero h1 { font-size: 4rem; margin-bottom: 1.5rem; color: var(--text-primary); text-shadow: 2px 2px 4px rgba(0,0,0,0.1); animation: fadeInUp 1s ease; }
      .hero p { font-size: 1.4rem; margin-bottom: 3rem; color: var(--text-secondary); max-width: 700px; margin-left: auto; margin-right: auto; animation: fadeInUp 1s ease 0.2s both; }
      .cta-buttons { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; animation: fadeInUp 1s ease 0.4s both; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      .dashboard-preview { padding: 8rem 0; background: var(--surface); position: relative; z-index: 1; }
      .section-title { text-align: center; font-size: 3rem; margin-bottom: 4rem; color: var(--text-primary); font-weight: 700; position: relative; }
      .section-title::after { content: ''; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 100px; height: 4px; background: var(--gradient-accent); border-radius: 2px; }
      .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2.5rem; margin-top: 4rem; }
      .dashboard-card { background: var(--surface-elevated); border-radius: 20px; padding: 3rem; box-shadow: var(--shadow); border: 1px solid var(--border); transition: all 0.4s ease; position: relative; overflow: hidden; }
      .dashboard-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--gradient-primary); }
      .dashboard-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: var(--shadow-lg); border-color: var(--primary-green); }
      .card-icon { background: var(--gradient-primary); border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: var(--shadow); }
      .card-icon i { color: var(--surface-elevated); font-size: 2rem; }
      .card-title { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-primary); font-weight: 600; }
      .dashboard-card p { color: var(--text-secondary); font-size: 1.1rem; line-height: 1.8; }
      .features { padding: 8rem 0; background: var(--background); position: relative; z-index: 1; }
      .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; }
      .feature-card { background: var(--surface-elevated); padding: 3rem; border-radius: 20px; text-align: center; box-shadow: var(--shadow); transition: all 0.4s ease; border: 1px solid var(--border); position: relative; }
      .feature-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: var(--primary-green); }
      .feature-icon { background: var(--gradient-primary); border-radius: 50%; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; box-shadow: var(--shadow); transition: all 0.3s ease; }
      .feature-card:hover .feature-icon { transform: scale(1.1) rotate(5deg); }
      .feature-icon i { color: var(--surface-elevated); font-size: 2.5rem; }
      .feature-card h3 { color: var(--text-primary); font-size: 1.4rem; margin-bottom: 1rem; font-weight: 600; }
      .feature-card p { color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; }
      .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); backdrop-filter: blur(5px); animation: fadeIn 0.3s; }
      .modal.show { display: block; }
      .modal-content { background: var(--surface-elevated); margin: 5% auto; padding: 4rem; border-radius: 20px; width: 90%; max-width: 500px; position: relative; animation: slideIn 0.4s ease; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
      @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
      @keyframes slideIn { from {transform: translateY(-50px) scale(0.9); opacity: 0;} to {transform: translateY(0) scale(1); opacity: 1;} }
      .close { color: var(--text-muted); float: right; font-size: 32px; font-weight: bold; cursor: pointer; position: absolute; top: 1.5rem; right: 2rem; transition: all 0.3s ease; }
      .close:hover { color: var(--primary-green); transform: scale(1.1); }
      .form-group { margin-bottom: 2rem; }
      .form-group label { display: block; margin-bottom: 0.75rem; font-weight: 600; color: var(--text-primary); font-size: 1.05rem; }
      .form-group input, .form-group select { width: 100%; padding: 1rem; border: 2px solid var(--border); border-radius: 12px; font-size: 1.05rem; transition: all 0.3s ease; background: var(--surface); color: var(--text-primary); }
      .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--primary-green); box-shadow: 0 0 0 3px rgba(45, 122, 95, 0.1); transform: translateY(-2px); }
      .patient-dashboard { display: none; padding: 3rem 0; background: var(--surface); min-height: 100vh; }
      .patient-dashboard.show { display: block; }
      .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid var(--border); }
      .welcome-text { font-size: 2rem; color: var(--text-primary); font-weight: 600; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
      .stat-card { background: var(--gradient-primary); color: var(--surface-elevated); padding: 2.5rem; border-radius: 20px; text-align: center; box-shadow: var(--shadow); transition: all 0.3s ease; border: 1px solid var(--border); }
      .stat-card:hover { transform: translateY(-5px) scale(1.02); }
      .stat-number { font-size: 3rem; font-weight: bold; margin-bottom: 1rem; }
      .appointments-section, .treatments-section { background: var(--surface-elevated); border-radius: 20px; padding: 3rem; margin-bottom: 3rem; box-shadow: var(--shadow); border: 1px solid var(--border); }
      .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
      .section-header h3 { color: var(--text-primary); font-size: 1.5rem; font-weight: 600; }
      .appointment-card { border: 2px solid var(--border); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease; background: var(--surface); }
      .appointment-card:hover { border-color: var(--primary-green); transform: translateX(5px); box-shadow: var(--shadow); }
      .appointment-info h4 { color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.2rem; font-weight: 600; }
      .appointment-info p { color: var(--text-secondary); margin-bottom: 0.25rem; }
      .appointment-info small { color: var(--text-muted); }
      .appointment-status { padding: 0.5rem 1.25rem; border-radius: 25px; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      .status-upcoming { background: var(--light-green); color: var(--primary-green); }
      .status-completed { background: #e8f5e8; color: #2e7d32; }
      .footer { background: var(--gradient-primary); color: var(--surface-elevated); text-align: center; padding: 4rem 0 2rem; margin-top: 6rem; position: relative; z-index: 1; }
      .footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 3rem; }
      .footer-section h3 { color: var(--accent-gold); margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 600; }
      .footer-section a { color: var(--surface-elevated); text-decoration: none; display: block; margin-bottom: 0.75rem; transition: all 0.3s ease; padding: 0.25rem 0; }
      .footer-section a:hover { color: var(--accent-gold); transform: translateX(5px); }
      @media (max-width: 768px) { .nav-links { display: none; } .hero h1 { font-size: 2.8rem; } .hero p { font-size: 1.2rem; } .cta-buttons { flex-direction: column; align-items: center; } .dashboard-header { flex-direction: column; gap: 1.5rem; text-align: center; } .modal-content { padding: 2rem; margin: 10% auto; } .dashboard-grid { grid-template-columns: 1fr; } }
      .scroll-reveal { opacity: 0; transform: translateY(50px); transition: all 0.8s ease; }
      .scroll-reveal.revealed { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape" />
          <div className="shape" />
          <div className="shape" />
          <div className="shape" />
          <div className="shape" />
        </div>
        <div className="particles" id="particles" ref={particlesRef} />
      </div>

      {/* Header */}
      <header className="header">
        <nav className="nav container">
          <div className="logo">AyurSutra</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-controls">
            <button className="theme-toggle" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
              <i data-feather={theme === 'light' ? 'moon' : 'sun'} id="theme-icon" />
            </button>
            <div className="auth-buttons">
              <button className="btn btn-secondary" onClick={() => { setShowLogin(true); setShowRegister(false); }}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => { setShowRegister(true); setShowLogin(false); }}>
                Register
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" ref={mainContentRef} style={{ display: isPatientDashboard ? 'none' : 'block' }}>
        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="container">
            <div className="hero-content">
              <h1>AyurSutra</h1>
              <p>Revolutionary Panchakarma Patient Management & Therapy Scheduling System - Bridging Ancient Wisdom with Modern Technology</p>
              <div className="cta-buttons">
                <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Book Appointment</button>
                <a href="#features" className="btn btn-secondary">Explore Features</a>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="dashboard-preview scroll-reveal">
          <div className="container">
            <h2 className="section-title">Complete Healthcare Management</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-icon"><i data-feather="user-plus" /></div>
                <h3 className="card-title">Smart Patient Registration</h3>
                <p>Seamless patient onboarding with comprehensive Ayurvedic assessment, Prakriti analysis, and personalized treatment recommendations powered by AI.</p>
              </div>
              <div className="dashboard-card">
                <div className="card-icon"><i data-feather="calendar" /></div>
                <h3 className="card-title">Intelligent Therapy Scheduling</h3>
                <p>Advanced scheduling system for Panchakarma treatments with automated reminders, conflict resolution, and optimal resource allocation.</p>
              </div>
              <div className="dashboard-card">
                <div className="card-icon"><i data-feather="activity" /></div>
                <h3 className="card-title">Real-time Progress Tracking</h3>
                <p>Comprehensive monitoring of treatment progress, patient health improvements, and outcome analytics with detailed reporting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features scroll-reveal" id="features">
          <div className="container">
            <h2 className="section-title">Powerful Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><i data-feather="heart" /></div>
                <h3>Holistic Ayurvedic Care</h3>
                <p>Complete treatment management integrating traditional Ayurvedic wisdom with cutting-edge technology for personalized patient care.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i data-feather="clock" /></div>
                <h3>AI-Powered Scheduling</h3>
                <p>Intelligent appointment scheduling considering treatment sequences, practitioner availability, and patient preferences for optimal outcomes.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i data-feather="shield" /></div>
                <h3>Enterprise Security</h3>
                <p>HIPAA-compliant data protection with advanced encryption, ensuring complete patient privacy and regulatory compliance.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i data-feather="smartphone" /></div>
                <h3>Mobile-First Design</h3>
                <p>Responsive platform accessible on any device, enabling seamless healthcare management from anywhere, anytime.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i data-feather="bar-chart" /></div>
                <h3>Advanced Analytics</h3>
                <p>Comprehensive dashboards and reports providing insights into treatment outcomes, clinic performance, and patient satisfaction.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i data-feather="users" /></div>
                <h3>Multi-Role Management</h3>
                <p>Tailored interfaces for patients, doctors, therapists, and administrators with role-based access and customized workflows.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Patient Dashboard */}
      <div className={`patient-dashboard container ${isPatientDashboard ? 'show' : ''}`} id="patient-dashboard">
        <div className="dashboard-header">
          <div className="welcome-text">Welcome back, Priya Sharma</div>
          <button className="btn btn-primary" onClick={logout}>Logout</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-number">12</div><div>Completed Sessions</div></div>
          <div className="stat-card"><div className="stat-number">3</div><div>Upcoming Appointments</div></div>
          <div className="stat-card"><div className="stat-number">85%</div><div>Treatment Progress</div></div>
          <div className="stat-card"><div className="stat-number">28</div><div>Days in Treatment</div></div>
        </div>

        <div className="appointments-section">
          <div className="section-header">
            <h3>Upcoming Appointments</h3>
            <button className="btn btn-primary">Book New Appointment</button>
          </div>

          <div className="appointment-card">
            <div className="appointment-info">
              <h4>Abhyanga Massage Therapy</h4>
              <p>Tomorrow, 10:00 AM - Dr. Rajesh Kumar</p>
              <small>Room 203, Panchakarma Center</small>
            </div>
            <div className="appointment-status status-upcoming">Upcoming</div>
          </div>

          <div className="appointment-card">
            <div className="appointment-info">
              <h4>Shirodhara Therapy Session</h4>
              <p>Dec 25, 2:00 PM - Dr. Meena Patel</p>
              <small>Room 105, Therapy Wing</small>
            </div>
            <div className="appointment-status status-upcoming">Scheduled</div>
          </div>

          <div className="appointment-card">
            <div className="appointment-info">
              <h4>Nasya Treatment</h4>
              <p>Dec 26, 11:30 AM - Dr. Arun Sharma</p>
              <small>Room 301, Treatment Center</small>
            </div>
            <div className="appointment-status status-upcoming">Confirmed</div>
          </div>
        </div>

        <div className="treatments-section">
          <div className="section-header">
            <h3>Recent Treatment History</h3>
            <button className="btn btn-secondary">View Complete History</button>
          </div>

          <div className="appointment-card">
            <div className="appointment-info">
              <h4>Panchakarma Initial Consultation</h4>
              <p>Dec 20, 11:00 AM - Dr. Rajesh Kumar</p>
              <small>Comprehensive assessment and personalized treatment plan</small>
            </div>
            <div className="appointment-status status-completed">Completed</div>
          </div>

          <div className="appointment-card">
            <div className="appointment-info">
              <h4>Swedana Steam Therapy</h4>
              <p>Dec 21, 3:00 PM - Therapist Maya Singh</p>
              <small>Full body steam therapy session - 45 minutes</small>
            </div>
            <div className="appointment-status status-completed">Completed</div>
          </div>

          <div className="appointment-card">
            <div className="appointment-info">
              <h4>Virechana Preparation</h4>
              <p>Dec 22, 9:00 AM - Dr. Meena Patel</p>
              <small>Pre-treatment preparation and dietary consultation</small>
            </div>
            <div className="appointment-status status-completed">Completed</div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <div className={`modal ${showLogin ? 'show' : ''}`} id="loginModal">
        <div className="modal-content">
          <span className="close" onClick={() => setShowLogin(false)}>&times;</span>
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Login to AyurSutra</h2>
          <form id="loginForm" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="userType">User Type</label>
              <select id="userType" name="userType" required>
                <option value="">Select Your Role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="therapist">Therapist</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>Login to Dashboard</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <a href="#" onClick={() => { setShowRegister(true); setShowLogin(false); }} style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Register here</a>
          </p>
        </div>
      </div>

      {/* Register Modal */}
      <div className={`modal ${showRegister ? 'show' : ''}`} id="registerModal">
        <div className="modal-content">
          <span className="close" onClick={() => setShowRegister(false)}>&times;</span>
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Join AyurSutra</h2>
          <form id="registerForm" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="regUserType">User Type</label>
              <select id="regUserType" name="regUserType" required>
                <option value="">Select Your Role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="regEmail">Email Address</label>
              <input type="email" id="regEmail" name="regEmail" placeholder="Enter your email address" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />
            </div>
            <div className="form-group">
              <label htmlFor="regPassword">Password</label>
              <input type="password" id="regPassword" name="regPassword" placeholder="Create a strong password" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>Create Account</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            Already have an account? <a href="#" onClick={() => { setShowLogin(true); setShowRegister(false); }} style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Login here</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>AyurSutra</h3>
              <p style={{ color: 'var(--surface-elevated)', lineHeight: 1.8 }}>Revolutionizing Ayurvedic healthcare through innovative technology, bringing ancient wisdom into the modern world for better patient outcomes.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#about">About Us</a>
              <a href="#contact">Contact Support</a>
              <a href="#">Patient Portal</a>
            </div>
            <div className="footer-section">
              <h3>Healthcare Services</h3>
              <a href="#">Patient Management</a>
              <a href="#">Appointment Scheduling</a>
              <a href="#">Treatment Planning</a>
              <a href="#">Progress Tracking</a>
              <a href="#">Teleconsultation</a>
            </div>
            <div className="footer-section">
              <h3>Support & Resources</h3>
              <a href="#">Help Center</a>
              <a href="#">API Documentation</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', marginTop: '2rem' }}>
            <p style={{ color: 'var(--surface-elevated)', fontSize: '1rem' }}>&copy; 2025 AyurSutra. Developed for Smart India Hackathon - Ministry of AYUSH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}