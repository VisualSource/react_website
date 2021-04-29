import React from 'react';
import {
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";
  import Server from '../pages/services/Server';
  import Home from '../pages/Home';
  import Projects from '../pages/content/Projects';
  import Project from '../pages/content/Project';
  import Profile from '../pages/account/Profile';
  import PrivateRoute from './PrivateRoute';
  import UserProfile from '../pages/account/ViewProfile';
  import Game from '../pages/content/Games';
  import Login from '../pages/account/Login';
  import News from '../pages/content/News';

export function RouterMain(){
    return (
        <Switch>
        <Route exact path="/">
              <Home/>
        </Route>
        <Route path="/index.html">
              <Redirect to="/"/>
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
        <Route path="/news">
            <News/>
        </Route>
        <Route path="/games">
            <Game/>
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
    );
}