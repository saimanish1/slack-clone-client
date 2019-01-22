import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

const GET_ALL_USERS = gql`
  query {
    allUsers {
      id
      email
    }
  }
`;

const Home = props => {
  return (
    <Query query={GET_ALL_USERS}>
      {({ loading, error, data: { allUsers } }) => {
        if (loading) return <p>"Loading..."</p>;
        if (error) return <p>{error.message}</p>;
        return (
          <React.Fragment>
            <Link to={'/register'}>Register</Link>
            <Link to={'/login'}>Login</Link>
            <Link to={'/createteam'}>CreateTeam</Link>
            <Link to={'/view-team'}>View Team</Link>
            {allUsers.map(user => {
              return <h2 key={user.id}>{user.email}</h2>;
            })}
          </React.Fragment>
        );
      }}
    </Query>
  );
};

export default Home;
