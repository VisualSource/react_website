import React from 'react';
import ReactDOM from 'react-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'
import './index.sass';
import App from './components/App';
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

if(process.env.NODE_ENV === "production" && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register("/sw.js",{scope:"/"})
    .then(req=>{
      console.log("Registration succeeded");
    }).catch(error=>{
      console.error("Registration Failed");
    });
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

