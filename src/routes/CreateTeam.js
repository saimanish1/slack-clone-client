import React, { Component } from 'react';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

const CREATE_TEAM_MUTATION = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        message
        path
      }
      team {
        id
      }
    }
  }
`;

class CreateTeam extends Component {
  state = {
    name: '',
    nameError: null,
  };
  onChangeInputHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = async createTeam => {
    this.setState({
      nameError: '',
    });
    const res = await createTeam();
    console.log(res);

    const { ok, errors, team } = res.data.createTeam;

    if (errors) {
      try {
        errors.forEach(({ path }) => {
          if (path === 'token') {
            throw new Error('tokens not provided');
          }
        });
      } catch (e) {}
      this.props.history.push('/login');
      return;
    }

    if (ok) {
      this.setState({
        name: '',
      });
      this.props.history.push(`/view-team/${team.id}`);
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState(err);
      console.log(this.state);
    }
  };

  render() {
    const { name, nameError } = this.state;

    const errorsList = [];
    if (nameError) {
      errorsList.push(nameError);
    }

    return (
      <Mutation
        mutation={CREATE_TEAM_MUTATION}
        variables={{
          name,
        }}
      >
        {(loginUser, { loading, error }) => {
          if (error) return console.log(error);
          return (
            <Container text>
              <Link to={'/'}>Home</Link>
              <Header as="h2">Create a Team</Header>
              <Input
                fluid
                placeholder="Name"
                type={'name'}
                value={name}
                name={'name'}
                onChange={this.onChangeInputHandler}
                error={!!nameError}
              />
              <Button
                onClick={() => this.onSubmit(loginUser)}
                disabled={loading}
              >
                Submit{loading ? 'ing' : ''}
              </Button>
              {errorsList.length > 1 ? (
                <Message
                  error
                  headers={'There was some errors with your submission'}
                  list={errorsList}
                />
              ) : null}
            </Container>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateTeam;
