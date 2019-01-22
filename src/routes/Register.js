import React, { Component } from 'react';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

const REGISTER_MUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

class Register extends Component {
  state = {
    username: '',
    password: '',
    email: '',
    usernameError: null,
    passwordError: null,
    emailError: null,
  };
  onChangeInputHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = async registerUser => {
    this.setState({
      usernameError: null,
      passwordError: null,
      emailError: null,
    });
    const res = await registerUser();
    console.log(res);
    const { ok, errors } = res.data.register;
    if (ok) {
      this.setState({
        username: '',
        email: '',
        password: '',
      });
      this.props.history.push('/login');
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
    const {
      username,
      password,
      email,
      usernameError,
      emailError,
      passwordError,
    } = this.state;

    const errorsList = [];
    if (usernameError) {
      errorsList.push(usernameError);
    }
    if (emailError) {
      errorsList.push(emailError);
    }
    if (passwordError) {
      errorsList.push(passwordError);
    }

    return (
      <Mutation
        mutation={REGISTER_MUTATION}
        variables={{
          username,
          password,
          email,
        }}
      >
        {(registerUser, { loading, error, called }) => {
          return (
            <Container text>
              {called && <p>Registered</p>}
              <Link to={'/'}>Home</Link>
              <Header as="h2">Register</Header>
              <Input
                fluid
                placeholder="Username"
                value={username}
                name="username"
                onChange={this.onChangeInputHandler}
                error={usernameError ? true : false}
              />
              <Input
                fluid
                placeholder="Email"
                value={email}
                name={'email'}
                onChange={this.onChangeInputHandler}
                error={emailError ? true : false}
              />
              <Input
                fluid
                placeholder="Password"
                type={'password'}
                value={password}
                name={'password'}
                onChange={this.onChangeInputHandler}
                error={passwordError ? true : false}
              />
              <Button
                onClick={() => this.onSubmit(registerUser)}
                disabled={loading}
              >
                Submit{loading ? 'ing' : ''}
              </Button>
              {usernameError || emailError || passwordError ? (
                <Message
                  error
                  headers={'There was some error with your submission'}
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

export default Register;
