import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import UserAuthContext from '../context/UserAuthContext';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authErrorMessage: "",
    }
  }

  static contextType = UserAuthContext;

  handleSignOut = e => {
    e.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(() => {
        this.context.setIsUserAuthenticated(false);
        this.props.history.push('/');
      })
      .catch(() => {
        this.setState({authErrorMessage: 'An error occurred while attempting to sign out.'});
      })
  }

  render() {
    return (
      <main>
        <button onClick={this.handleSignOut}>Sign Out</button>
        <span className="user-error-message">{this.state.authErrorMessage}</span>
        <h2>Dashboard</h2>
      </main>
    );
  }
}