import React from 'react';
import {Route, Redirect, withRouter} from "react-router-dom";


//nesting a route inside a component
const PrivateRoute = ({component: Component, isUserAuthenticated, ...rest}) => {
  if (isUserAuthenticated) {
    return (
      <Route 
        {...rest} 
        render={props => {
          return <Component {...props} />;
        }}
      />
    );
  }
  return <Redirect to={{pathname: '/'}} />;
};

//withRouter passes match, location, and history props to the wrapped component whenever it renders
export default withRouter(PrivateRoute);