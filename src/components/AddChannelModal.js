import React, { Component } from 'react';
// import { Button, Form, Input, Modal, Checkbox } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ME_QUERY } from '../routes/ViewTeam';

const CREATE_CHANNEL_MUTATION = gql`
  mutation CREATE_CHANNEL_MUTATION($teamId: ID!, $name: String!) {
    createChannel(name: $name, teamId: $teamId) {
      ok
      channel {
        name
      }
    }
  }
`;

class AddChannelModal extends Component {
  state = {
    channelName: '',
    public: false,
  };
  onChangeChannelNameHandler = e => {
    this.setState({ channelName: e.target.value });
  };
  submit = async (createChannel, e) => {
    await createChannel();
    this.setState({ channelName: '' });
    this.props.onClose();
  };
  render() {
    let { open, onClose, currentTeamId } = this.props;
    return (
      <Mutation
        mutation={CREATE_CHANNEL_MUTATION}
        variables={{
          name: this.state.channelName,
          teamId: currentTeamId,
        }}
        refetchQueries={[{ query: ME_QUERY }]}
        errorPolicy={'all'}
      >
        {(createChannel, { error, loading }) => {
          if (error) return <p>Error Occured</p> || console.log(error);

          return (
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby="form-dialog-title"
              maxWidth={'sm'}
              fullWidth
            >
              <DialogTitle id="form-dialog-title">Create a Channel</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Channel Name"
                  type="text"
                  value={this.state.channelName}
                  fullWidth
                  onChange={this.onChangeChannelNameHandler}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={e => this.submit(createChannel, e)}
                  color="primary"
                  disabled={!this.state.channelName.length > 0}
                >
                  create
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Mutation>
    );
  }
}

export default AddChannelModal;
