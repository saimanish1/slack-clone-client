import React, { Component } from 'react';
import Messages from '../components/Messages';
import { Comment } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($channelId: ID!) {
    messages(channelId: $channelId) {
      text
      id
      url
      filetype
      created_at
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
      url
      created_at
      filetype
      user {
        id
        username
      }
    }
  }
`;

const Message = ({ message: { url, text, filetype } }) => {
  if (url) {
    if (filetype.startsWith('image/')) {
      return (
        <React.Fragment>
          <a href={`http://localhost:4000/${url}`} target={'_blank'}>
            <img
              src={`http://localhost:4000/${url}`}
              style={{ maxWidth: '300px', maxHeight: '400px' }}
              alt={''}
            />
          </a>
        </React.Fragment>
      );
    } else if (filetype.startsWith('audio/')) {
      return (
        <audio controls>
          <source src={url} type={filetype} />
        </audio>
      );
    }
  } else return <span style={{ marginLeft: '20px' }}>{text}</span>;
};
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

  displayingDate = time => {
    const today = moment(time)
      .utcOffset(530)
      .endOf('day');
    const tomorrow = moment(time)
      .utcOffset(530)
      .add(1, 'day')
      .endOf('day');

    if (time < today) return 'today';
    if (time < tomorrow) return 'tomorrow';
    return moment(time).format('DD MM');
  };
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
          console.log(messages);
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
                          <div>
                            <span>
                              {this.displayingDate(Number(m.created_at))}{' '}
                            </span>
                            {moment(Number(m.created_at))
                              .utcOffset(530)
                              .format('h:mm A')}
                          </div>
                        </Comment.Metadata>
                        <Message message={m} />
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
