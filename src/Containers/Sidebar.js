import React, { Component } from 'react';
import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';

class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    channelName: '',
    openInvitePeopleModal: false,
    openDirectMessageModal: false,
  };

  toggleDirectMessageModal = e => {
    this.setState(state => ({
      openDirectMessageModal: !state.openDirectMessageModal,
    }));
  };

  handleAddChannelClick = e => {
    this.setState({ openAddChannelModal: true });
  };
  handleCloseAddChannelClick = e => {
    this.setState({ openAddChannelModal: false });
  };

  handleInvitePeopleClick = e => {
    this.setState({ openInvitePeopleModal: true });
  };
  handleCloseInvitePeopleClick = e => {
    this.setState({ openInvitePeopleModal: false });
  };
  render() {
    let { teams, team, username } = this.props;
    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          userName={username}
          channels={team.channels}
          users={team.directMessageMembers}
          onAddChannelClick={this.handleAddChannelClick}
          teamId={team.id}
          onInvitePeopleClick={this.handleInvitePeopleClick}
          isOwner={team.admin}
          onDirectMessageClick={this.toggleDirectMessageModal}
        />
        <DirectMessageModal
          currentTeamId={team.id}
          open={this.state.openDirectMessageModal}
          onClose={this.toggleDirectMessageModal}
        />
        <AddChannelModal
          open={this.state.openAddChannelModal}
          onClose={this.handleCloseAddChannelClick}
          currentTeamId={team.id}
        />
        <InvitePeopleModal
          open={this.state.openInvitePeopleModal}
          onClose={this.handleCloseInvitePeopleClick}
          teamId={team.id}
        />
      </React.Fragment>
    );
  }
}

export default Sidebar;
