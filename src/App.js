import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import SignIn from './component/SignIn';
import Dashboard from './component/Dashboard'
import UserAuthContext from './context/UserAuthContext';
import PrivateRoute from './component/PrivateRoute';


function App() {
  // useState hook provides state to functional components
  // arg is initial state value
  // returns an array of two elements [state variable, function to update state variable value].
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // UserAuthContext.Provider props "value" contains the data avilable to the component tree.
  return (   
    <UserAuthContext.Provider value = {{isUserAuthenticated, setIsUserAuthenticated}}>
      <div className="App">
          <Router>
            <Switch>
              <PrivateRoute 
                exact 
                path="/dashboard" 
                component={Dashboard} 
                isUserAuthenticated={isUserAuthenticated} 
              />
              <Route exact path="/" component={SignIn} />
              <Redirect from="*" to="/" />
            </Switch>
          </Router>
      </div>
    </UserAuthContext.Provider>
  );
}

export default App;
