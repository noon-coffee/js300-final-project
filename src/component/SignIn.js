import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import "./SignIn.css"
import UserAuthContext from '../context/UserAuthContext';


class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      authErrorMessage: "",
    }
  }

  //this approach is limited to consuming only one context
  static contextType = UserAuthContext;
  
  resetCredentialFields = () => this.setState({email: "", password: ""});

  handleSignIn = e => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        if (response.user) {
          this.context.setIsUserAuthenticated(true);
          this.props.history.push('/dashboard');
        }
      })
      .catch(error => {
        let errorMessage;
        error.code.includes('auth/')
          ? errorMessage = 'Invalid credentials'
          : errorMessage = 'An unexpected error occurred';

        this.setState({authErrorMessage: errorMessage});
        this.resetCredentialFields();
      })
  }
  handleEmailInput = e => this.setState({email: e.target.value});
  handlePasswordInput = e => this.setState({password: e.target.value});
  
  render() {
    return (
      <main id="container-main-signin">
        <form id="form-signin" onSubmit={this.handleSignIn}>
          <h2>Please Sign In</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              name="email"
              id="email"
              className="form-control"
              type="email"           
              value={this.state.email}
              onChange={this.handleEmailInput}
              required
              placeholder="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input                        
              name="password"
              id="password"
              className="form-control"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordInput}
              required
              placeholder="password"
            />
          </div>

          <span className="user-error-message">{this.state.authErrorMessage}</span>

          <button type="submit">Sign In</button>
        </form>
      </main>
    );
  }
}

export default SignIn;