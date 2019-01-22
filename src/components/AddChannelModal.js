import React, { Component } from 'react';
import { Button, Form, Input, Modal, Checkbox } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
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
            <Modal open={open} onClose={onClose}>
              <Modal.Header>Add Channel</Modal.Header>
              <Modal.Content>
                <Form
                  onSubmit={async e => {
                    e.preventDefault();
                    if (this.state.channelName.trim().length > 0) {
                      if (!(await createChannel())) {
                        alert('Error Occurred');
                      }
                      this.setState({ channelName: '' });
                      onClose();
                    }
                  }}
                >
                  <Form.Field>
                    <Input
                      fluid
                      placeholder={'channel name'}
                      value={this.state.channelName}
                      onChange={this.onChangeChannelNameHandler}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      label={'Private'}
                      checked={this.state.public}
                      onChange={e => {
                        this.setState(state => ({ public: !state.public }));
                      }}
                    />
                  </Form.Field>
                  <Form.Group widths={'equal'}>
                    <Button
                      fluid
                      type={'submit'}
                      disabled={this.state.channelName.trim().length < 1}
                    >
                      Creat{loading ? 'ing' : 'e Channel'}
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

export default AddChannelModal;
