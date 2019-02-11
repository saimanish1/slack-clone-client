import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';

const TeamWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #3f0e40;
  color: #958993;
`;

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = styled.li`
  width: 50px;
  height: 50px;
  background: #676066;
  color: white;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 11px;
  &:hover {
    border-style: solid;
    border-width: thick;
    border-color: #767676;
  }
`;

const team = ({ id, letter }) => {
  return (
    <Link to={`/view-team/${id}`} key={id}>
      <TeamListItem>{letter}</TeamListItem>
    </Link>
  );
};
const Team = ({ teams }) => {
  return (
    <TeamWrapper>
      <TeamList>
        {teams.map(team)}
        <Link to={`/createTeam`} key="add-team">
          <TeamListItem>+</TeamListItem>
        </Link>
      </TeamList>
    </TeamWrapper>
  );
};

export default Team;
