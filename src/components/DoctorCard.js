import React from 'react';
import styled from 'styled-components';
import { MapPin, Star, Briefcase, Clock } from 'react-feather';

const Card = styled.div`
  background: ${props => props.theme.colors.surfaceElevated};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.colors.shadowLg};
  }
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.surfaceElevated};
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.h4`
  margin: 0 0 0.25rem 0;
  color: ${props => props.theme.colors.textPrimary};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Tags = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BookButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 10px;
  background: ${props => props.theme.gradients.accent};
  color: ${props => props.theme.colors.background};
  font-weight: 600;
  border: none;
`;

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <Card>
      <Avatar>
        {doctor.image ? (
          <img src={doctor.image} alt={doctor.name} />
        ) : (
          doctor.name.split(' ').map(s => s[0]).slice(0,2).join('')
        )}
      </Avatar>
      <Info>
        <Name>{doctor.name}</Name>
        <Row><Briefcase size={16} /> {doctor.specialization} • {doctor.experience}</Row>
        <Row><Clock size={16} /> {doctor.availability}</Row>
        <Row><MapPin size={16} /> {doctor.location}</Row>
        <Row><Star size={16} color="#fbbf24" /> {doctor.rating}</Row>
        <Tags>
          {doctor.treatments?.slice(0,4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Tags>
      </Info>
      <Actions>
        <BookButton onClick={() => onBook(doctor)}>Book</BookButton>
      </Actions>
    </Card>
  );
};

export default DoctorCard;
