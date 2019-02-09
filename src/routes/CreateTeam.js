import React, { Component } from 'react';
// import { Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import { TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

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
    marginRight: '10px',
  },
});

class CreateTeam extends Component {
  state = {
    name: '',
    nameError: null,
  };
  onChangeInputHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = async (createTeam, e) => {
    e.preventDefault();
    console.log(this.state);

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
    const { classes } = this.props;

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
        {(createTeam, { loading, error }) => {
          if (error) return console.log(error);
          return (
            <main className={classes.main}>
              <CssBaseline />
              <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                  Create a Team
                </Typography>
                <form
                  className={classes.form}
                  onSubmit={e => this.onSubmit(createTeam, e)}
                >
                  <FormControl margin="normal" required fullWidth>
                    <TextField
                      id="team"
                      name="name"
                      label={'Enter Team Name'}
                      autoFocus
                      onChange={this.onChangeInputHandler}
                      value={name}
                      variant="outlined"
                      helperText={
                        nameError ? 'Team name already exists/Invalid' : null
                      }
                      error={!!nameError}
                      autoComplete={'off'}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!this.state.name > 0}
                  >
                    Create
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.history.push('/view-team');
                    }}
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Cancel
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

export default withStyles(styles)(CreateTeam);
