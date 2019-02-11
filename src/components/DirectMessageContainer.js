import React, { Component } from 'react';
import Messages from '../components/Messages';
import { Comment } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const DIRECT_MESSAGES_QUERY = gql`
  query DIRECT_MESSAGES_QUERY($teamId: ID!, $otherUserId: ID!) {
    directMessages(teamId: $teamId, otherUserId: $otherUserId) {
      text
      id
      __typename
      sender {
        id
        username
      }
      receiverId
    }
  }
`;
const NEW_DIRECT_MESSAGE_SUBSCRIPTION = gql`
  subscription NEW_DIRECT_MESSAGE_SUBSCRIPTION($teamId: ID!, $userId: ID!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      text
      id
      __typename
      sender {
        id
        username
      }
      receiverId
    }
  }
`;

let unsubscribe = null;

class DirectMessageContainer extends Component {
  componentWillReceiveProps(nextProps, nextContext) {
    if (
      this.props.teamId !== nextProps.teamId ||
      this.props.otherUserId !== nextProps.otherUserId
    ) {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.props.teamId !== nextProps.teamId ||
      this.props.otherUserId !== nextProps.otherUserId
    );
  }

  componentWillUnmount() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  render() {
    const { teamId, otherUserId } = this.props;
    return (
      <Query
        query={DIRECT_MESSAGES_QUERY}
        variables={{ teamId, otherUserId }}
        fetchPolicy={'network-only'}
      >
        {({ loading, error, data: { directMessages }, subscribeToMore }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error Occurred</p> || console.log(error);
          if (!unsubscribe) {
            unsubscribe = subscribeToMore({
              document: NEW_DIRECT_MESSAGE_SUBSCRIPTION,
              variables: { teamId: this.props.teamId, userId: otherUserId },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }
                console.log(subscriptionData);
                const response = {
                  directMessages: [
                    ...prev.directMessages,
                    { ...subscriptionData.data.newDirectMessage },
                  ],
                };
                return response;
              },
            });
          }
          return (
            <Messages>
              <Comment.Group>
                {directMessages.map(m => {
                  return (
                    <Comment key={`${m.id}-message`}>
                      <Comment.Content>
                        <Comment.Author as="a">
                          {m.sender.username}
                        </Comment.Author>
                        <Comment.Metadata>
                          {/*<div>{m.created_at}</div>*/}
                        </Comment.Metadata>
                        <Comment.Text>{m.text}</Comment.Text>
                        <Comment.Actions>
                          <Comment.Action />
                        </Comment.Actions>
                      </Comment.Content>
                    </Comment>
                  );
                })}
              </Comment.Group>
            </Messages>
          );
        }}
      </Query>
    );
  }
}

export default DirectMessageContainer;
