import { Routes, Route } from "react-router-dom";

import Home from '../pages/Home';
import News from '../pages/news/News';

import Projects from '../pages/projects/Projects';
import Project from "../pages/projects/Project";

import LoginAndSignUp from '../pages/user/LoginAndSignUp';
import Account from '../pages/user/Account';
import EditProfile from "../pages/user/EditProfile";
import User from "../pages/user/User";

import Services from "../pages/services/Services";
import ServerResources from "../pages/services/mcserver/ServerResources";

import Games from "../pages/games/Games";
import AdminPage from "../pages/services/mcserver/AdminPage";
import ErrorPage from "../pages/errors/ErrorPage";

export default function RoutesPaths(){
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/news" element={<News/>}/>
            <Route path="/projects" element={<Projects/>}/>
            <Route path="/services" element={ <Services/>}/>
            <Route path="/server/resources" element={ <ServerResources/>}/>
            <Route path="/server/resources/admin" element={<AdminPage/>}/>
            <Route path="/signin" element={<LoginAndSignUp/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/account/edit" element={<EditProfile/>}/>
            <Route path="/user/:sub" element={<User/>}/>
            <Route path="/project/:id" element={ <Project/>}/>
            <Route path="/games" element={<Games/>}/>
            <Route path="*" element={<ErrorPage error={404}/>} />
        </Routes>
    );
} 