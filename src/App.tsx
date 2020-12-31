import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Image} from 'shineout';
import {
  Switch,
  Route,
  Link,
} from "react-router-dom";
import CONFIG from './config.json';
import Server from './pages/Server';
import Home from './pages/home';
import Projects from './pages/Projects';
import Project from './pages/Project';
import Profile from './pages/profile';
import PrivateRoute from './routes/PrivateRoute';
import UserProfile from './pages/ViewProfile';
import Login from './pages/Login';
function App() {
  const {isAuthenticated, user, getAccessTokenSilently, logout, loginWithRedirect} = useAuth0();
  const [content, setContent] = useState();
  const [show, setShow] = useState(false);
  const sidenav = useRef<HTMLUListElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  const logout_user = () => {
    window.sessionStorage.removeItem("metadata");
    logout({returnTo: window.location.origin});
  }

  const open = (close?: boolean) => {

    if (show || close) {
      setShow(false);
    }else{
      setShow(true);
    }
    if (sidenav?.current && overlay?.current) {
      if (show) {
        overlay.current.style.display = "block";
        overlay.current.style.opacity = "1";
        sidenav.current.style.width = "16rem";
      }else{
        sidenav.current.style.width = "0";
        overlay.current.style.display = "none";
        overlay.current.style.opacity = "0";
      }
    }
  }
  useEffect(()=>{
    if (overlay.current) {
      overlay.current.onclick = () => {
          open(true);
      }
    }
    const getUserMetadata = async () => {
        let raw = window.sessionStorage.getItem("metadata");
        if (raw != null) {
            setContent(JSON.parse(raw));
        }else{
            try {
                const accessToken = await getAccessTokenSilently({
                  audience: CONFIG.auth.audience,
                  scope: "read:current_user read:users_app_metadata read:user_metadata",
                });
          
                const userDetailsByIdUrl = `${CONFIG.auth.audience}users/${user.sub}`;
          
                const metadataResponse = await fetch(userDetailsByIdUrl, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
                const all = await metadataResponse.json();
                window.sessionStorage.setItem("metadata",JSON.stringify({app_metadata: all.app_metadata, user_metadata: all.user_metadata} as any));
                setContent({app_metadata: all.app_metadata, user_metadata: all.user_metadata} as any);
              } catch (e) {
                console.error(e.message);
              }
        }
      };
      getUserMetadata();
},[isAuthenticated]);

  
 
  return (
    <>
      <div ref={overlay} className="sidenav-overlay"></div>
      <ul ref={sidenav} id="slide-out" className="sidenav">
        <li>
          <div className="user-view">
            <div className="background"></div>
            <a><Image width={64} height={64} title="user" src={user?.picture ?? ""} shape="circle"/></a>
            <a><span>{user?.name ?? ""}</span></a>
            <a><span>{user?.email ?? ""}</span></a>
          </div>
        </li>
        <li className="active" onClick={()=>{open(true); }}><Link to="/">Home</Link></li>
        <li className="active" onClick={()=>{open(true); }}><Link to="/projects">Projects</Link></li>
        <li><div className="divider"></div></li>
        <li><a className="subheader">User</a></li>
       {isAuthenticated ?  <li className="active" onClick={()=>open(true)}><Link to="/account">Account</Link></li> : <li className="active" onClick={()=>loginWithRedirect()} ><a>Login/Register</a></li>}
       {(content as any)?.app_metadata?.minecraft_auth && isAuthenticated ? <li className="active" onClick={()=>open(true)}><Link to="/minecraft-server">Minecraft Server</Link></li> : null}
       {isAuthenticated ?  <li className="active" onClick={logout_user}><a>Logout</a></li> : null}
      </ul>
      <header>
        <nav id="navbar">
          <img src={`${CONFIG.root}logo.webp`} alt="logo" id="logo"/>
          <span className="material-icons" id="mobile-nav" onClick={()=>open()}>
              menu
          </span>
          <ul>
            <li><Link className="default-hover" to="/">Home</Link></li>
            <li><Link className="default-hover" to="/projects">Projects</Link></li>
            {((content as any)?.app_metadata?.minecraft_auth) && isAuthenticated ?  <li><Link className="default-hover" to="/minecraft-server">Minecraft</Link></li> : null}
            {isAuthenticated ? <li onClick={logout_user}><a className="default-hover">Logout</a></li> : null}
            <li><Link className="logo-hover" to={isAuthenticated ? "/account" : "/login"}>{isAuthenticated ? <Image width={23} height={23} shape="circle" title="user picture" src={user.picture}/> : <span className="material-icons">account_circle</span>}</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Switch>
          <Route exact path="/">
                <Home/>
          </Route>
          <Route path="/login">
                <Login/>
          </Route>
          <Route path="/projects/:project/:id">
              <Project/>
          </Route>
          <Route path="/projects">
                <Projects/>
          </Route>
          <Route path="/user-account/:sub">
              <UserProfile/>
          </Route>
          <PrivateRoute path="/account">
            <Profile/>
          </PrivateRoute>
          <PrivateRoute path="/minecraft-server">
                <Server/>
          </PrivateRoute>
          <Route path="*">
              <div id="login-screen">
                  <div className="lines">
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                  </div>
              </div>
              <div className="content no-page">
                  <h1>Thats a 404</h1>
                  <p>Try someplace else</p>
             </div>
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
