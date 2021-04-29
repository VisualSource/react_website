import React from 'react';
import ReactDOM from 'react-dom';
import {Auth0Provider} from '@auth0/auth0-react';
import { BrowserRouter as Router,} from 'react-router-dom';
import App from './App';
import {ContentVersionChecker} from './api/LoadStorage';

import './style/index.sass';
ReactDOM.render(
  <Auth0Provider 
  domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
  clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
  audience={process.env.REACT_APP_AUTH0_AUDIENCE}
  scope="update:profile update:users update:users_app_metadata update:current_user_metadata update:current_user read:current_user read:users_app_metadata read:user_metadata"
  redirectUri={window.location.origin}>
      <React.StrictMode>
          <Router>
            <App />
          </Router>
      </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root')
);
ContentVersionChecker();







