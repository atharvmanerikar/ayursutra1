import React from 'react';

export default function Privacy() {
  return (
    <main className="container" style={{ padding: '3rem 0', position: 'relative', zIndex: 1 }}>
      <section className="appointments-section" style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          We value your privacy. This application stores minimal, non-sensitive data locally in your browser
          (such as doctor availability and appointments) to improve your experience. We do not share your data
          with third parties.
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.05rem' }}>
          For enterprise deployments, please contact us to configure a secure backend and data processing agreement.
        </p>
      </section>
    </main>
  );
}
