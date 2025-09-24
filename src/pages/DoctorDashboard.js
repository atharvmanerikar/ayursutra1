import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  padding: 3rem 0;
  background: ${p => p.theme.colors.surface};
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${p => p.theme.colors.textPrimary};
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Card = styled.div`
  background: ${p => p.theme.colors.surfaceElevated};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
`;

const DoctorDashboard = ({ user }) => {
  return (
    <Wrap>
      <Container>
        <Title>Doctor Dashboard</Title>
        <Card>
          <p>Welcome, {user?.name || 'Doctor'}.</p>
          <p>Here you will manage your schedule, appointments, and patient notes.</p>
        </Card>
      </Container>
    </Wrap>
  );
};

export default DoctorDashboard;
