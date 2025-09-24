import React, { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Clock, MapPin } from 'react-feather';
import DoctorCard from '../components/DoctorCard';
import AppointmentBookingModal from '../components/AppointmentBookingModal';

const DashboardContainer = styled.div`
  padding: 3rem 0;
  background: ${props => props.theme.colors.surface};
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const WelcomeText = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.gradients.primary};
  color: ${props => props.theme.colors.surfaceElevated};
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: ${props => props.theme.colors.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    transform: translateY(-5px) scale(1.02);
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Section = styled.div`
  background: ${props => props.theme.colors.surfaceElevated};
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: ${props => props.theme.colors.shadow};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const AppointmentCard = styled.div`
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.surface};

  &:hover {
    border-color: ${props => props.theme.colors.primaryGreen};
    transform: translateX(5px);
    box-shadow: ${props => props.theme.colors.shadow};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const AppointmentInfo = styled.div`
  flex: 1;
`;

const AppointmentTitle = styled.h4`
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const AppointmentDetails = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { width: 1rem; height: 1rem; }
`;

const AppointmentLocation = styled.small`
  color: ${props => props.theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { width: 0.875rem; height: 0.875rem; }
`;

const AppointmentStatus = styled.div`
  padding: 0.5rem 1.25rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.upcoming {
    background: ${props => props.theme.colors.lightGreen};
    color: ${props => props.theme.colors.primaryGreen};
  }

  &.completed {
    background: #e8f5e8;
    color: #2e7d32;
  }
`;

const DoctorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
`;

const PatientDashboard = ({ user }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    { id: 1, name: 'Dr. Rajesh Kumar', specialization: 'Panchakarma Specialist', experience: '15 years', rating: 4.8, image: '', availability: 'Mon-Fri: 9AM-5PM', location: 'Panchakarma Center', treatments: ['Abhyanga','Shirodhara','Virechana','Basti'] },
    { id: 2, name: 'Dr. Meena Patel', specialization: 'Ayurvedic Physician', experience: '12 years', rating: 4.9, image: '', availability: 'Mon-Sat: 10AM-6PM', location: 'Therapy Wing', treatments: ['Nasya','Shirodhara','Udvartana','Karna Purana'] },
    { id: 3, name: 'Dr. Arun Sharma', specialization: 'Traditional Ayurveda', experience: '20 years', rating: 4.7, image: '', availability: 'Tue-Sat: 8AM-4PM', location: 'Treatment Center', treatments: ['Pizhichil','Njavarakizhi','Akshi Tarpana','Kati Basti'] },
    { id: 4, name: 'Dr. Priya Nair', specialization: "Women's Ayurvedic Health", experience: '10 years', rating: 4.9, image: '', availability: 'Mon-Fri: 11AM-7PM', location: "Women's Health Wing", treatments: ['Yoni Pichu','Uttara Basti','Abhyanga','Shirodhara'] }
  ];

  const upcomingAppointments = [
    { id: 1, title: 'Abhyanga Massage Therapy', doctor: 'Dr. Rajesh Kumar', date: 'Tomorrow', time: '10:00 AM', location: 'Room 203, Panchakarma Center', status: 'upcoming' },
    { id: 2, title: 'Shirodhara Therapy Session', doctor: 'Dr. Meena Patel', date: 'Dec 25', time: '2:00 PM', location: 'Room 105, Therapy Wing', status: 'upcoming' },
    { id: 3, title: 'Nasya Treatment', doctor: 'Dr. Arun Sharma', date: 'Dec 26', time: '11:30 AM', location: 'Room 301, Treatment Center', status: 'upcoming' }
  ];

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
    alert('Appointment booked successfully!');
  };

  return (
    <DashboardContainer>
      <Container>
        <DashboardHeader>
          <WelcomeText>Welcome back, {user?.name || 'Patient'}</WelcomeText>
        </DashboardHeader>

        <StatsGrid>
          <StatCard>
            <StatNumber>12</StatNumber>
            <div>Completed Sessions</div>
          </StatCard>
          <StatCard>
            <StatNumber>3</StatNumber>
            <div>Upcoming Appointments</div>
          </StatCard>
          <StatCard>
            <StatNumber>85%</StatNumber>
            <div>Treatment Progress</div>
          </StatCard>
          <StatCard>
            <StatNumber>28</StatNumber>
            <div>Days in Treatment</div>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionHeader>
            <SectionTitle>Upcoming Appointments</SectionTitle>
          </SectionHeader>
          {upcomingAppointments.map(appt => (
            <AppointmentCard key={appt.id}>
              <AppointmentInfo>
                <AppointmentTitle>{appt.title}</AppointmentTitle>
                <AppointmentDetails><Clock /> {appt.date}, {appt.time} - {appt.doctor}</AppointmentDetails>
                <AppointmentLocation><MapPin /> {appt.location}</AppointmentLocation>
              </AppointmentInfo>
              <AppointmentStatus className={appt.status}>Upcoming</AppointmentStatus>
            </AppointmentCard>
          ))}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Find Doctors</SectionTitle>
          </SectionHeader>
          <DoctorsGrid>
            {doctors.map(doc => (
              <DoctorCard key={doc.id} doctor={doc} onBook={handleBookAppointment} />
            ))}
          </DoctorsGrid>
        </Section>
      </Container>

      <AppointmentBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        doctor={selectedDoctor}
        onBooked={handleBookingSuccess}
      />
    </DashboardContainer>
  );
};

export default PatientDashboard;
