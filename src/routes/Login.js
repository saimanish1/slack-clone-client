import React, { Component } from 'react';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
      token
      refreshToken
    }
  }
`;

class Login extends Component {
  state = {
    password: '',
    email: '',
    passwordError: null,
    emailError: null,
  };
  onChangeInputHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = async loginUser => {
    this.setState({
      passwordError: null,
      emailError: null,
    });
    const res = await loginUser();
    console.log(res);
    const { ok, errors, token, refreshToken } = res.data.login;
    if (ok) {
      this.setState({
        email: '',
        password: '',
      });
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      this.props.history.push('/');
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
    const { password, email, emailError, passwordError } = this.state;

    const errorsList = [];
    if (emailError) {
      errorsList.push(emailError);
    }
    if (passwordError) {
      errorsList.push(passwordError);
    }

    return (
      <Mutation
        mutation={LOGIN_MUTATION}
        variables={{
          password,
          email,
        }}
      >
        {(loginUser, { loading, error, called }) => {
          if (error) return console.log(error);
          return (
            <Container text>
              <Link to={'/'}>Home</Link>
              <Header as="h2">Login</Header>
              <Input
                fluid
                placeholder="Email"
                value={email}
                name={'email'}
                onChange={this.onChangeInputHandler}
                error={!!emailError}
              />
              <Input
                fluid
                placeholder="Password"
                type={'password'}
                value={password}
                name={'password'}
                onChange={this.onChangeInputHandler}
                error={!!passwordError}
              />
              <Button
                onClick={() => this.onSubmit(loginUser)}
                disabled={loading}
              >
                Submit{loading ? 'ing' : ''}
              </Button>
              {emailError || passwordError ? (
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

export default Login;
