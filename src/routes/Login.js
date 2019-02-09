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
  onSubmit = async (loginUser, e) => {
    e.preventDefault();
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
    const { classes } = this.props;

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
            <main className={classes.main}>
              <CssBaseline />
              <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form
                  className={classes.form}
                  onSubmit={e => this.onSubmit(loginUser, e)}
                >
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      id="email"
                      name="email"
                      label={'Email Address'}
                      autoComplete="email"
                      autoFocus
                      onChange={this.onChangeInputHandler}
                      value={email}
                      variant="outlined"
                      helperText={
                        emailError ? "Email doesn't exist or is Invalid" : null
                      }
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
                    Sign in
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

export default withStyles(styles)(Login);
