import React, { Component } from 'react';
import Messages from '../components/Messages';
import { Comment } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($channelId: ID!) {
    messages(channelId: $channelId) {
      text
      id
      __typename
      user {
        id
        username
      }
    }
  }
`;
const NEW_CHANNEL_MESSAGE_SUBSCRIPTION = gql`
  subscription NEW_CHANNEL_MESSAGE_SUBSCRIPTION($channelId: ID!) {
    newChannelMessage(channelId: $channelId) {
      text
      id
      __typename
      user {
        id
        username
      }
    }
  }
`;

let unsubscribe = null;

class MessageContainer extends Component {
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.channelId !== nextProps.channelId) {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props.channelId !== nextProps.channelId;
  }

  componentWillUnmount() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }

  render() {
    return (
      <Query
        query={MESSAGES_QUERY}
        variables={{ channelId: this.props.channelId }}
        fetchPolicy={'network-only'}
      >
        {({ loading, error, data: { messages }, subscribeToMore }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error Occurred</p> || console.log(error);
          if (!unsubscribe) {
            unsubscribe = subscribeToMore({
              document: NEW_CHANNEL_MESSAGE_SUBSCRIPTION,
              variables: { channelId: this.props.channelId },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                  return prev;
                }

                const response = {
                  messages: [
                    ...prev.messages,
                    { ...subscriptionData.data.newChannelMessage },
                  ],
                };
                return response;
              },
            });
          }
          return (
            <Messages>
              <Comment.Group>
                {messages.map(m => {
                  return (
                    <Comment key={`${m.id}-message`}>
                      <Comment.Content>
                        <Comment.Author as="a">
                          {m.user.username}
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

export default MessageContainer;
