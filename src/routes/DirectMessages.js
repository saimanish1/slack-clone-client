import React, { Component } from 'react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../Containers/Sidebar';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import SendDirectMessage from '../components/SendDirectMessage';
import DirectMessageContainer from '../components/DirectMessageContainer';
import DirectMessageHeader from '../components/DirectMessageHeader';

export const ME_QUERY = gql`
  query ME_QUERY {
    me {
      id
      email
      username
      teams {
        admin
        name
        id
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

class DirectMessages extends Component {
  render() {
    let { teamId: currentTeamId, userId } = this.props.match.params;
    return (
      <Query query={ME_QUERY} fetchPolicy={'network-only'}>
        {({ loading, error, data: { me } }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p> Error Occurred</p> || console.log(error);
          console.log(me);
          const { teams, username } = me;
          if (!teams.length) {
            return <Redirect to={'/createteam'} />;
          }
          let teamIdInteger = parseInt(currentTeamId, 10);

          const teamIndex = teamIdInteger
            ? teams.findIndex(team => parseInt(team.id, 10) === teamIdInteger)
            : 0;
          const team = teams[teamIndex];

          // const channelIdInteger = parseInt(currentChannelId, 10);

          // const channelsIndex = channelIdInteger
          //   ? team.channels.findIndex(
          //       channel => parseInt(channel.id, 10) === channelIdInteger
          //     )
          //   : 0;
          // const channel = team.channels[channelsIndex];

          return (
            <AppLayout>
              <Sidebar
                currentTeamId={currentTeamId}
                teams={teams.map(t => ({
                  id: t.id,
                  letter: t.name.charAt(0).toUpperCase(),
                }))}
                team={team}
                username={username}
              />
              <DirectMessageHeader userId={userId} />

              <DirectMessageContainer
                teamId={parseInt(currentTeamId, 10)}
                otherUserId={parseInt(userId, 10)}
              />

              <SendDirectMessage
                receiverId={userId}
                userName={userId}
                teamId={teamIdInteger}
              />
              {/*TODO change userName to original userName*/}
            </AppLayout>
          );
        }}
      </Query>
    );
  }
}

export default DirectMessages;
