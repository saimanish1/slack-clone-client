import React, { Component } from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
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
    email: 'frdd@test.com',
  };
  onChangeEmailHandler = e => {
    this.setState({ email: e.target.value });
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
            <Modal open={open} onClose={onClose}>
              <Modal.Header>Invite</Modal.Header>
              <Modal.Content>
                <Form
                  onSubmit={async e => {
                    e.preventDefault();
                    if (this.state.email.trim().length > 0) {
                      try {
                        const res = await addTeamMember();
                        console.log(res);
                        if (!res) {
                          alert('Error Occurred');
                        }
                        this.setState({ email: '' });
                        onClose();
                      } catch (err) {
                        this.setState({ email: '' });

                        alert('Error Occurred');

                        onClose();
                      }
                    }
                  }}
                >
                  <Form.Field>
                    <Input
                      fluid
                      placeholder={'emailId of the user'}
                      value={this.state.email}
                      onChange={this.onChangeEmailHandler}
                    />
                  </Form.Field>
                  <Form.Group widths={'equal'}>
                    <Button
                      fluid
                      type={'submit'}
                      disabled={this.state.email.trim().length < 1}
                    >
                      Invit{loading ? 'ing' : 'e Team'}
                    </Button>
                    <Button fluid onClick={onClose}>
                      Cancel
                    </Button>
                  </Form.Group>
                </Form>
              </Modal.Content>
            </Modal>
          );
        }}
      </Mutation>
    );
  }
}

export default InvitePeopleModal;
