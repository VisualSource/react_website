import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';

import Navbar from './Navbar';

import Routes from './Routes';
import ErrorBoundary from "./ErrorBoundary";

import {  } from 'bootstrap';

function App() {
  return (
    <Auth0Provider 
      scope="update:users update:users_app_metadata"
      domain="visualsource.auth0.com"
      clientId="6c6YuGZXmG2Z33zyAKM1pR546vj85Ca1"
      redirectUri={window.location.origin}>
      <Router>
          <Navbar/>
          <ErrorBoundary>
            <main id="vs-content-warpper">
              <Routes/>
            </main>
          </ErrorBoundary>
      </Router>
    </Auth0Provider>
  );
}

export default App;
