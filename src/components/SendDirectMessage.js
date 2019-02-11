import React, { Component } from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_DIRECT_MESSAGE_MUTATION = gql`
  mutation CREATE_DIRECT_MESSAGE_MUTATION(
    $teamId: ID!
    $text: String!
    $receiverId: ID!
  ) {
    createDirectMessage(teamId: $teamId, text: $text, receiverId: $receiverId)
  }
`;
const MessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

class SendDirectMessage extends Component {
  state = {
    message: '',
  };
  messageOnChangeHandler = e => {
    this.setState({ message: e.target.value });
  };
  handleSubmit = async (e, createDirectMessage) => {
    e.preventDefault();
    if (this.state.message.trim().length > 0) {
      if (!(await createDirectMessage())) {
        alert('Error Occurred');
      }
      this.setState({ message: '' });
    }
  };
  render() {
    let { teamId, receiverId, userName } = this.props;

    return (
      <Mutation
        mutation={CREATE_DIRECT_MESSAGE_MUTATION}
        variables={{ teamId, text: this.state.message, receiverId }}
      >
        {(createDirectMessage, { loading, error }) => {
          if (error) return <p>Error occured</p> || console.log(error);

          return (
            <MessageWrapper>
              <form onSubmit={e => this.handleSubmit(e, createDirectMessage)}>
                <Input
                  fluid
                  placeholder={`Message # ${userName}`}
                  onChange={this.messageOnChangeHandler}
                  value={this.state.message}
                  disabled={loading}
                />
              </form>
            </MessageWrapper>
          );
        }}
      </Mutation>
    );
  }
}

export default SendDirectMessage;
