import React, { Component } from 'react';
// import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ME_QUERY } from '../routes/ViewTeam';

const ADD_MEMBER = gql`
  mutation ADD_MEMBER($teamId: ID!, $email: String!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
    }
  }
`;

class InvitePeopleModal extends Component {
  state = {
    email: '',
  };
  onChangeEmailHandler = e => {
    this.setState({ email: e.target.value });
  };
  submit = async addTeamMember => {
    await addTeamMember();
    this.setState({ email: '' });
    this.props.onClose();
  };
  render() {
    let { open, onClose, teamId } = this.props;

    return (
      <Mutation
        mutation={ADD_MEMBER}
        variables={{
          email: this.state.email,
          teamId: teamId,
        }}
        refetchQueries={[{ query: ME_QUERY }]}
      >
        {(addTeamMember, { error, loading }) => {
          if (error) return <p>Error Occured</p> || console.log(error);

          return (
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby="form-dialog-title"
              maxWidth={'sm'}
              fullWidth
            >
              <DialogTitle id="form-dialog-title">Invite People</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="text"
                  value={this.state.email}
                  fullWidth
                  onChange={this.onChangeEmailHandler}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={e => this.submit(addTeamMember, e)}
                  color="primary"
                  disabled={!this.state.email.length > 0}
                >
                  Invite
                </Button>
              </DialogActions>
            </Dialog>
          );
        }}
      </Mutation>
    );
  }
}

export default InvitePeopleModal;
