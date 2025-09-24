import React, { useContext, useMemo, useState } from 'react';
import AppContext from '../context/AppContext';

export default function DoctorDashboard() {
  const { doctors, appointments, setAppointments } = useContext(AppContext);
  const [doctorId, setDoctorId] = useState(() => (doctors && doctors[0] ? doctors[0].id : ''));

  const myAppointments = useMemo(() => {
    if (!doctorId) return [];
    return (appointments || []).filter(a => a.doctorId === Number(doctorId));
  }, [appointments, doctorId]);

  function acceptAppointment(id) {
    setAppointments((prev) => prev.map(a => a.id === id ? { ...a, status: 'accepted' } : a));
  }

  function completeAppointment(id) {
    setAppointments((prev) => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
  }

  return (
    <main className="container" style={{ padding: '2rem 0', position: 'relative', zIndex: 1 }}>
      <div className="dashboard-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p className="welcome-text">Review and accept appointments</p>
        </div>
        <div style={{ minWidth: 280 }}>
          <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-secondary)' }}>Select Doctor</label>
          <select className="" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--border)', borderRadius: 8 }}>
            {(doctors || []).map(d => (
              <option key={d.id} value={d.id}>{d.name} {d.available ? '(Available)' : '(Busy)'}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="appointments-section">
        <div className="section-header">
          <h3>Your Appointments</h3>
        </div>
        <div className="appointments-list">
          {myAppointments.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>No appointments yet.</p>
          )}
          {myAppointments.map((a) => (
            <div key={a.id} className="appointment-card doctor-view">
              <div className="appointment-info">
                <h4>{a.patientName}</h4>
                <p>Type: {a.type}</p>
                <p>Date: {a.date}</p>
                <p>Time: {a.time}</p>
                <small>Status: {a.status}</small>
              </div>
              <div className="appointment-actions">
                {a.status === 'pending' && (
                  <button className="btn btn-small btn-primary" onClick={() => acceptAppointment(a.id)}>Accept</button>
                )}
                {a.status === 'accepted' && (
                  <button className="btn btn-small" onClick={() => completeAppointment(a.id)}>Mark Completed</button>
                )}
              </div>
              <div className={`status ${a.status === 'accepted' ? 'upcoming' : (a.status === 'completed' ? 'completed' : '')}`}>
                {a.status}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
