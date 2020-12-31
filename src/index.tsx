import React from 'react';
import ReactDOM from 'react-dom';
import {Auth0Provider} from '@auth0/auth0-react';
import { BrowserRouter as Router,} from 'react-router-dom';
import App from './App';
import './style/index.sass';
import CONFIG from './config.json';
import CheckContent from './access/check_content';
window.addEventListener('load',()=>{ 
  try {
    let get = document.querySelectorAll('div')[1];
    get.style.display = "none";
  } catch (_) {}
});
ReactDOM.render(
  <Auth0Provider 
  domain={CONFIG.auth.domain}
  clientId={CONFIG.auth.clientId}
  audience={CONFIG.auth.audience}
  scope="update:connection update:current_user read:current_user update:users_app_metadata update:users update:current_user_metadata read:users_app_metadata read:user_metadata"
  redirectUri={window.location.origin}>
      <React.StrictMode>
          <Router>
            <App />
          </Router>
      </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root')
);
CheckContent();







