import React, { Component } from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { ApolloConsumer } from 'react-apollo';
import debounce from 'lodash.debounce';
import Downshift from 'downshift';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

const GET_ALL_TEAM_MEMBERS_QUERY = gql`
  query GET_ALL_TEAM_MEMBERS_QUERY($teamId: ID!) {
    getAllTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;

class DirectMessageModal extends Component {
  state = {
    teamMembers: [],
    loading: false,
  };
  onChange = debounce(async (e, client) => {
    this.setState({ loading: true });

    const response = await client.query({
      query: GET_ALL_TEAM_MEMBERS_QUERY,
      variables: { teamId: this.props.currentTeamId },
    });

    console.log(response);
    this.setState({
      teamMembers: response.data.getAllTeamMembers,
      loading: false,
    });
  }, 350);

  routeToTeamMember = item => {
    this.props.history.push(
      `/view-team/user/${this.props.currentTeamId}/${item.id}`
    );
  };
  render() {
    let { open, onClose } = this.props;
    return (
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Add Channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Downshift
                onChange={this.routeToTeamMember}
                itemToString={item => (item === null ? '' : item.username)}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                }) => (
                  <div>
                    <ApolloConsumer>
                      {client => (
                        <Input
                          {...getInputProps({
                            placeholder: 'Add TeamMember',
                            id: 'search',
                            className: this.state.loading ? 'loading' : '',
                            onClick: e => {
                              e.persist();
                              this.onChange(e, client);
                            },
                          })}
                          fluid
                        />
                      )}
                    </ApolloConsumer>
                    {isOpen ? (
                      <div style={{ border: '1px solid #ccc' }}>
                        {this.state.teamMembers
                          .filter(
                            i =>
                              !inputValue ||
                              i.username
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                          )
                          .map((item, index) => (
                            <p
                              {...getItemProps({ item })}
                              key={item.id}
                              style={{
                                backgroundColor:
                                  highlightedIndex === index ? 'gray' : 'white',
                                fontWeight:
                                  selectedItem === item ? 'bold' : 'normal',
                              }}
                            >
                              {item.username}
                            </p>
                          ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </Downshift>
            </Form.Field>
            <Button fluid onClick={onClose}>
              Cancel
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default withRouter(DirectMessageModal);
