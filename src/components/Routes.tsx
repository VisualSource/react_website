import { Switch, Route } from "react-router-dom";

import Home from '../pages/Home';
import News from '../pages/news/News';

import Projects from '../pages/projects/Projects';
import Project from "../pages/projects/Project";

import LoginAndSignUp from '../pages/user/LoginAndSignUp';
import Account from '../pages/user/Account';
import EditProfile from "../pages/user/EditProfile";
import User from "../pages/user/User";

import Services from "../pages/services/Services";
import ServerResources from "../pages/services/ServerResources";

import Games from "../pages/games/Games";

export default function Routes(){
    return (
        <Switch>
              <Route exact path="/">
                  <Home/>
              </Route>
              <Route exact path="/news">
                  <News/>
              </Route>
              <Route path="/projects">
                  <Projects/>
              </Route>
              <Route path="/services">
                  <Services/>
              </Route>
              <Route path="/server/resources">
                  <ServerResources/>
              </Route>
              <Route path="/signin">
                <LoginAndSignUp/>
              </Route>
              <Route exact path="/account">
                    <Account/>
              </Route>
              <Route exact path="/account/edit">
                    <EditProfile/>
              </Route>
              <Route path="/user/:sub">
                  <User/>
              </Route>
              <Route path="/project/:id">
                  <Project/>
              </Route>
              <Route path="/games">
                    <Games/>
              </Route>
        </Switch>
    );
} 