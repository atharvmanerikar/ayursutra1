import React from 'react';

export default function About() {
  return (
    <main className="container" style={{ padding: '3rem 0', position: 'relative', zIndex: 1 }}>
      <section className="appointments-section" style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>About AyurSutra</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          AyurSutra is a modern Ayurveda platform designed to connect patients with expert doctors,
          streamline appointment scheduling, and support holistic wellness journeys.
        </p>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.05rem' }}>
          We combine a clean, elegant interface with powerful features like role-based dashboards,
          doctor availability, and an integrated assistant to help you get things done faster.
        </p>
      </section>
    </main>
  );
}
