import styled from 'styled-components';
import { Header } from 'semantic-ui-react';
import React from 'react';

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

const HeaderComponent = ({ channelName }) => (
  <HeaderWrapper>
    <Header textAlign={'center'}># {channelName}</Header>
  </HeaderWrapper>
);

export default HeaderComponent;
