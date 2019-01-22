import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import decode from 'jwt-decode';
import Home from './routes/Home';
import Register from './routes/Register';
import Login from './routes/Login';
import CreateTeam from './routes/CreateTeam';
import ViewTeam from './routes/ViewTeam';
import DirectMessages from './routes/DirectMessages';
import UploadOneFile from './routes/UploadTest';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  // const refreshToken = localStorage.getItem('refreshToken');
  try {
    const decoded = decode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route path="/upload" exact component={UploadOneFile} />
          {/*this is a test uploading*/}

          <PrivateRoute
            path={'/view-team/:teamId?/:channelId?'}
            exact
            component={ViewTeam}
          />
          <PrivateRoute
            path={'/view-team/user/:teamId/:userId'}
            exact
            component={DirectMessages}
          />
          <PrivateRoute path="/createteam" exact component={CreateTeam} />
        </Switch>
      </Router>
    );
  }
}

export default App;
