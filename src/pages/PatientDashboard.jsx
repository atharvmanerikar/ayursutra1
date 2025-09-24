import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import DoctorCard from '../components/DoctorCard';
import MedicalHistory from '../components/MedicalHistory';
import feather from 'feather-icons';

// Add some CSS for the dashboard
const styles = `
  .dashboard-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem 0;
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 1024px) {
    .dashboard-container {
      grid-template-columns: 1fr;
    }
  }
  
  .dashboard-section {
    background: var(--surface-elevated);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    margin-bottom: 2rem;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--border);
  }
  
  .welcome-message h1 {
    margin: 0;
    color: var(--text-primary);
  }
  
  .welcome-message p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
  
  .doctors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .doctor-card {
    background: var(--surface);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    border: 1px solid var(--border);
  }
  
  .doctor-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    position: relative;
    padding-bottom: 0.75rem;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: var(--gradient-primary);
    border-radius: 2px;
  }
  
  .tabs {
    display: flex;
    border-bottom: 2px solid var(--border);
    margin-bottom: 1.5rem;
  }
  
  .tab {
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-weight: 600;
    color: var(--text-secondary);
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s ease;
  }
  
  .tab.active {
    color: var(--primary-green);
    border-bottom-color: var(--primary-green);
  }
  
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .suggested-doctors {
    margin-top: 2rem;
  }
  
  .suggested-doctors h4 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .suggested-tag {
    display: inline-block;
    background: var(--gradient-primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

export default function PatientDashboard() {
  const { 
    doctors, 
    appointments, 
    setAppointments, 
    medicalHistory, 
    setMedicalHistory,
    currentUser,
    getAppointmentsWithDoctor,
    suggestedDoctors
  } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('doctors');
  const [form, setForm] = useState({ 
    doctorId: '', 
    date: '', 
    time: '', 
    type: 'Consultation', 
    patientName: currentUser?.name || '' 
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const navigate = useNavigate();

  const doctorList = useMemo(() => {
    if (!doctors) return [];
    
    // Enhance doctors with their appointments for the current user
    return doctors.map(doctor => ({
      ...doctor,
      appointments: getAppointmentsWithDoctor(doctor.id)
    }));
  }, [doctors, getAppointmentsWithDoctor]);
  
  // Set current user's name in form if available
  useEffect(() => {
    if (currentUser?.name) {
      setForm(prev => ({
        ...prev,
        patientName: currentUser.name
      }));
    }
  }, [currentUser]);

  function openBooking(doc) {
    if (!doc.available) return;
    setSelectedDoctor(doc);
    setForm(f => ({ ...f, doctorId: String(doc.id) }));
    setShowBooking(true);
  }

  // Search functionality for doctors
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    availability: 'all',
    rating: 0
  });

  // Filter doctors based on search and filters
  const filteredDoctors = useMemo(() => {
    if (!doctorList || doctorList.length === 0) return [];
    
    return doctorList.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialization = !filters.specialization || 
                                  doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase());
      
      const matchesAvailability = filters.availability === 'all' || 
                                (filters.availability === 'available' && doctor.available) ||
                                (filters.availability === 'unavailable' && !doctor.available);
      
      const matchesRating = doctor.rating >= filters.rating;
      
      return matchesSearch && matchesSpecialization && matchesAvailability && matchesRating;
    });
  }, [doctorList, searchTerm, filters]);

  // Handle booking an appointment
  const handleBookAppointment = (doctor) => {
    if (!doctor.available) return;
    setSelectedDoctor(doctor);
    setForm(prev => ({
      ...prev,
      doctorId: String(doctor.id),
      date: new Date().toISOString().split('T')[0] // Today's date as default
    }));
    setShowBooking(true);
  };

  // Handle form submission for new appointment
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.time || !form.patientName) {
      alert('Please fill in all required fields');
      return;
    }
    
    const doctor = doctors.find(d => d.id === Number(form.doctorId));
    if (!doctor?.available) {
      alert('Selected doctor is currently busy. Please choose an available doctor.');
      return;
    }
    
    const nextId = (appointments?.[appointments.length - 1]?.id || 0) + 1;
    const newAppointment = {
      id: nextId,
      patientId: currentUser?.id || 1,
      patientName: form.patientName,
      doctorId: Number(form.doctorId),
      doctorName: doctor.name,
      date: form.date,
      time: form.time,
      type: form.type,
      status: 'pending',
      notes: `Appointment requested for ${form.type}`,
      prescription: null
    };
    
    setAppointments([...(appointments || []), newAppointment]);
    setShowBooking(false);
    alert('Appointment requested! A doctor will accept it soon.');
    
    // Reset form
    setForm({
      ...form,
      date: '',
      time: '',
      type: 'Consultation'
    });
    
    // Switch to appointments tab
    setActiveTab('appointments');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="patient-dashboard">
      <style>
        {`
          .search-filters {
            margin-bottom: 2rem;
            background: var(--surface-elevated);
{{ ... }}
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: var(--shadow);
          }
          
          .search-bar {
            margin-bottom: 1.5rem;
          }
          
          .search-bar input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 1rem;
            background: var(--surface);
            color: var(--text-primary);
          }
          
          .filter-options {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }
          
          .filter-options select {
            padding: 0.5rem 1rem;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: var(--surface);
            color: var(--text-primary);
            cursor: pointer;
          }
          
          .doctors-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }
          
          .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
          }
          
          .tab-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 1rem;
            color: var(--text-secondary);
            border-bottom: 3px solid transparent;
            transition: all 0.2s ease;
          }
          
          .tab-btn.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
            font-weight: 600;
          }
          
          .tab-content {
            margin-top: 2rem;
          }
          
          ${styles}
        `}
      </style>
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-message">
            <h1>Welcome back, {currentUser?.name || 'Patient'}</h1>
            <p>Manage your health journey with AyurSutra</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Your Dashboard</h2>
            
            <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                onClick={() => setActiveTab('doctors')}
              >
                Find Doctors
              </button>
              <button 
                className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                My Appointments
              </button>
              <button 
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Medical History
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'doctors' && (
                <div className="doctors-tab">
                  <div className="search-filters">
                    <div className="search-bar">
                      <input 
                        type="text" 
                        placeholder="Search by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="filter-options">
                      <select 
                        value={filters.specialization}
                        onChange={(e) => setFilters({...filters, specialization: e.target.value})}
                      >
                        <option value="">All Specializations</option>
                        <option value="Panchakarma">Panchakarma</option>
                        <option value="Therapy">Therapy</option>
                        <option value="Consultation">Consultation</option>
                      </select>
                      
                      <select 
                        value={filters.availability}
                        onChange={(e) => setFilters({...filters, availability: e.target.value})}
                      >
                        <option value="all">All Doctors</option>
                        <option value="available">Available Now</option>
                      </select>
                      
                      <select 
                        value={filters.rating}
                        onChange={(e) => setFilters({...filters, rating: Number(e.target.value)})}
                      >
                        <option value="0">All Ratings</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                      </select>
                    </div>
                  </div>
                  
                  <h3>Available Doctors</h3>
                  <div className="doctors-grid">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map(doctor => (
                        <DoctorCard 
                          key={doctor.id} 
                          doctor={doctor} 
                          onBook={() => openBooking(doctor)}
                        />
                      ))
                    ) : (
                      <div className="no-results">
                        <p>No doctors found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <section className="dashboard-section">
          <h2 className="section-title">My Appointments</h2>
          
          {appointments && appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments
                .filter(a => !form.patientName || a.patientName.toLowerCase() === form.patientName.toLowerCase())
                .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
                .map((appointment) => {
                  const doctor = doctors.find(d => d.id === appointment.doctorId);
                  return (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-info">
                        <div className="appointment-header">
                          <h4>{appointment.type}</h4>
                          <span className={`appointment-status status-${appointment.status}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <p className="appointment-doctor">
                          <i className="fas fa-user-md"></i> {doctor ? doctor.name : 'Doctor'}
                        </p>
                        <p className="appointment-date">
                          <i className="far fa-calendar-alt"></i> {formatDate(appointment.date)}
                        </p>
                        <p className="appointment-time">
                          <i className="far fa-clock"></i> {appointment.time}
                        </p>
                        {appointment.notes && (
                          <div className="appointment-notes">
                            <p><strong>Notes:</strong> {appointment.notes}</p>
                          </div>
                        )}
                        {appointment.prescription && (
                          <div className="appointment-prescription">
                            <p><strong>Prescription:</strong> {appointment.prescription}</p>
                          </div>
                        )}
                      </div>
                      <div className="appointment-actions">
                        <button 
                          className="btn btn-outline"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setShowBooking(true);
                          }}
                        >
                          Reschedule
                        </button>
                        <button 
                          className="btn btn-text"
                          onClick={() => {
                            // Cancel appointment logic
                            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                              setAppointments(appointments.filter(a => a.id !== appointment.id));
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="empty-state">
              <p>You don't have any upcoming appointments.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('doctors')}
              >
                Book an Appointment
              </button>
            </div>
          )}
                </section>
              )}

              {activeTab === 'suggested' && (
                <div className="tab-content">
                  <section className="dashboard-section">
                    <h2 className="section-title">Suggested Doctors</h2>
                    <p className="section-subtitle">Based on your medical history and preferences</p>
                    
                    {suggestedDoctors && suggestedDoctors.length > 0 ? (
                      <div className="doctors-grid">
                        {suggestedDoctors.map(doctor => (
                          <DoctorCard 
                            key={doctor.id} 
                            doctor={doctor} 
                            showHistory={true}
                            onBookAppointment={handleBookAppointment}
                            isSuggested={true}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No doctor suggestions available. Complete your medical history for personalized recommendations.</p>
                        <button 
                          className="btn btn-primary"
                          onClick={() => setActiveTab('medical-history')}
                        >
                          Update Medical History
                        </button>
                      </div>
                    )}
                  </section>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="tab-content">
                  <section className="dashboard-section">
                    <MedicalHistory 
                      medicalHistory={medicalHistory}
                      setMedicalHistory={setMedicalHistory}
                    />
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <div className={`modal ${showBooking ? 'show' : ''}`} onClick={() => setShowBooking(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close" onClick={() => setShowBooking(false)}>×</span>
          <h2>Book Appointment {selectedDoctor ? `with ${selectedDoctor.name}` : ''}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Doctor</label>
              <select 
                value={form.doctorId} 
                onChange={(e) => {
                  const doc = doctors.find(d => d.id === Number(e.target.value));
                  setSelectedDoctor(doc || null);
                  setForm({ ...form, doctorId: e.target.value });
                }} 
                required
              >
                <option value="">Select a doctor</option>
                {doctorList.map(d => (
                  <option key={d.id} value={d.id} disabled={!d.available}>
                    {d.name} - {d.specialization} {d.available ? '' : '(Not Available)'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={form.date} 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value })} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  value={form.time} 
                  onChange={(e) => setForm({ ...form, time: e.target.value })} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Appointment Type</label>
              <select 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              >
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Panchakarma">Panchakarma Therapy</option>
                <option value="Abhyanga">Abhyanga Therapy</option>
                <option value="Shirodhara">Shirodhara</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                Request Appointment
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowBooking(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
