import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import UserAuthContext from '../context/UserAuthContext';


class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    }
  }

  //this approach is limited to consuming only one context
  static contextType = UserAuthContext;
  
  handleSignIn = e => {
    e.preventDefault();
    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(this.state.email, this.state.password)
    //   .then(response => {
    //     if (response.user) {
    //       this.context.setIsUserAuthenticated(true);
    //       this.props.history.push('/dashboard');
    //     }
    //   })
    //   .catch(error => console.log(error))
    this.context.setIsUserAuthenticated(true);
    this.props.history.push('/dashboard');
  }
  handleEmailInput = e => this.setState({email: e.target.value});
  handlePasswordInput = e => this.setState({password: e.target.value});
  
  render() {
    return (
      <main>
        <h2>Sign In</h2>

        <form id="form-signin" onSubmit={this.handleSignIn}>
          <input 
            type="email"
            id="email"
            name="email"
            value={this.state.email}
            onChange={this.handleEmailInput}
            required
            placeholder="email"
          />

          <input 
            type="password"
            id="password"
            name="password"
            value={this.state.password}
            onChange={this.handlePasswordInput}
            required
            placeholder="password"
          />

          <button type="submit">Sign In</button>
        </form>
      </main>
    );
  }
}

export default SignIn;