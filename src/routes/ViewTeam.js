import React, { Component } from 'react';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../Containers/Sidebar';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import MessageContainer from '../Containers/MessageContainer';

export const ME_QUERY = gql`
  query ME_QUERY {
    me {
      id
      email
      username
      teams {
        admin
        name
        directMessageMembers {
          id
          username
        }
        id
        channels {
          id
          name
        }
      }
    }
  }
`;

class ViewTeam extends Component {
  render() {
    let {
      teamId: currentTeamId,
      channelId: currentChannelId,
    } = this.props.match.params;
    return (
      <Query query={ME_QUERY} fetchPolicy={'network-only'}>
        {({ loading, error, data: { me } }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p> Error Occurred</p> || console.log(error);
          const { teams, username } = me;
          if (!teams.length) {
            return <Redirect to={'/createteam'} />;
          }
          let teamIdInteger = parseInt(currentTeamId, 10);

          const teamIndex = teamIdInteger
            ? teams.findIndex(team => parseInt(team.id, 10) === teamIdInteger)
            : 0;
          const team = teams[teamIndex];

          const channelIdInteger = parseInt(currentChannelId, 10);

          const channelsIndex = channelIdInteger
            ? team.channels.findIndex(
                channel => parseInt(channel.id, 10) === channelIdInteger
              )
            : 0;
          const channel = team.channels[channelsIndex];

          return (
            <AppLayout>
              <Sidebar
                currentTeamId={currentTeamId}
                currentChannelId={currentChannelId}
                teams={teams.map(t => ({
                  id: t.id,
                  letter: t.name.charAt(0).toUpperCase(),
                }))}
                team={team}
                username={username}
              />
              {channel ? (
                <React.Fragment>
                  <Header channelName={channel.name} />
                  <MessageContainer channelId={channel.id} />

                  <SendMessage
                    channelName={channel.name}
                    channelId={channel.id}
                  />
                </React.Fragment>
              ) : null}
            </AppLayout>
          );
        }}
      </Query>
    );
  }
}

export default ViewTeam;
