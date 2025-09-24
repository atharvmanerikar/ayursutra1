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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: ${p => p.theme.colors.surfaceElevated};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 16px;
  padding: 1.25rem;
`;

const AdminDashboard = ({ user }) => {
  return (
    <Wrap>
      <Container>
        <Title>Admin Dashboard</Title>
        <Grid>
          <Card>
            <strong>Users</strong>
            <p>Manage patients, doctors and therapists.</p>
          </Card>
          <Card>
            <strong>Appointments</strong>
            <p>Oversee clinic-wide scheduling.</p>
          </Card>
          <Card>
            <strong>Reports</strong>
            <p>View analytics and performance.</p>
          </Card>
          <Card>
            <strong>Settings</strong>
            <p>System configurations and roles.</p>
          </Card>
        </Grid>
      </Container>
    </Wrap>
  );
};

export default AdminDashboard;
