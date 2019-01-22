import styled from 'styled-components';
import { Header } from 'semantic-ui-react';
import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

const GET_USERNAME_QUERY = gql`
  query GET_USERNAME_QUERY($userId: ID!) {
    getUserName(userId: $userId) {
      username
    }
  }
`;

const DirectMessageHeader = ({ userId }) => (
  <HeaderWrapper>
    <Query variables={{ userId: userId.toString() }} query={GET_USERNAME_QUERY}>
      {({ loading, error, data: { getUserName } }) => {
        if (loading) return <p>Loading...</p>;
        return <Header textAlign={'center'}># {getUserName.username}</Header>;
      }}
    </Query>
  </HeaderWrapper>
);

export default DirectMessageHeader;
