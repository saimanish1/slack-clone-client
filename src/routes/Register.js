import React, { Component } from 'react';
// import { Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import { TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

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

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

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
  onSubmit = async (registerUser, e) => {
    e.preventDefault();
    console.log(this.state);
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
    const { classes } = this.props;

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
            <main className={classes.main}>
              <CssBaseline />
              <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Register
                </Typography>
                <form
                  className={classes.form}
                  onSubmit={e => this.onSubmit(registerUser, e)}
                >
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      id="username"
                      name="username"
                      label={'Username'}
                      autoFocus
                      onChange={this.onChangeInputHandler}
                      value={username}
                      variant="outlined"
                      helperText={usernameError ? 'Invalid username' : null}
                      error={!!usernameError}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      id="email"
                      name="email"
                      label={'Email Address'}
                      autoComplete="email"
                      onChange={this.onChangeInputHandler}
                      value={email}
                      variant="outlined"
                      helperText={emailError ? 'Email is Invalid' : null}
                      error={!!emailError}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      name="password"
                      type="password"
                      id="password"
                      label={'Password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={this.onChangeInputHandler}
                      variant="outlined"
                      error={!!passwordError}
                      helperText={passwordError ? 'Password is invalid' : null}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign up
                  </Button>
                </form>
              </Paper>
            </main>
          );
        }}
      </Mutation>
    );
  }
}

export default withStyles(styles)(Register);
