import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';

import Navbar from './Navbar';

import RoutesPaths from './Routes';
import ErrorBoundary from "./ErrorBoundary";

import {  } from 'bootstrap';

function App() {
  return (
    <Auth0Provider 
      scope="read:users update:current_user_metadata read:current_user read:current_user_metadata"
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      redirectUri={window.location.origin}>
      <Router>
          <Navbar/>
          <ErrorBoundary>
            <main id="vs-content-warpper">
              <RoutesPaths/>
            </main>
          </ErrorBoundary>
      </Router>
    </Auth0Provider>
  );
}

export default App;
