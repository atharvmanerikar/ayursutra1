import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

export default function AdminDashboard() {
  const { doctors, setDoctors, appointments, setAppointments } = useContext(AppContext);

  function toggleAvailability(id) {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, available: !d.available } : d));
  }

  function removeAppointment(id) {
    if (!window.confirm('Delete this appointment?')) return;
    setAppointments(prev => prev.filter(a => a.id !== id));
  }

  return (
    <main className="container" style={{ padding: '2rem 0', position: 'relative', zIndex: 1 }}>
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="welcome-text">Manage doctors and appointments</p>
        </div>
      </div>

      <section className="appointments-section">
        <div className="section-header">
          <h3>Doctors</h3>
        </div>
        <div className="doctors-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(doctors || []).map(d => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.specialization}</td>
                  <td>{d.experience}</td>
                  <td>⭐ {d.rating}</td>
                  <td>
                    <span className={`status ${d.available ? 'available' : 'busy'}`}>
                      {d.available ? 'Available' : 'Busy'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-small btn-primary" onClick={() => toggleAvailability(d.id)}>
                      {d.available ? 'Mark Busy' : 'Mark Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="appointments-section">
        <div className="section-header">
          <h3>All Appointments</h3>
        </div>
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(appointments || []).map(a => {
                const doc = (doctors || []).find(d => d.id === a.doctorId);
                return (
                  <tr key={a.id}>
                    <td>{a.patientName}</td>
                    <td>{doc ? doc.name : a.doctorId}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.type}</td>
                    <td>
                      <span className={`status ${a.status === 'accepted' ? 'upcoming' : (a.status === 'completed' ? 'completed' : '')}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-small btn-danger" onClick={() => removeAppointment(a.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
