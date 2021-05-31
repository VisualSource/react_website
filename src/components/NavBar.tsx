import React from 'react';
import { Image } from 'shineout';
import {
  Link,
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useMetadata from '../hooks/UseMetadata';
import {useSharedSideNav} from '../hooks/UseSideNav';

export default function NavBar(){
    const {isAuthenticated,logout, user} = useAuth0();
    const { open } = useSharedSideNav();
    const metadata = useMetadata();
    const logout_user = () => {
        window.sessionStorage.removeItem("metadata");
        logout({returnTo: window.location.origin});
    }
    return (
        <nav id="navbar">
            <img src={`${process.env.REACT_APP_ROOT}logo.webp`} alt="logo" id="logo"/>
            <span className="material-icons" id="mobile-nav" onClick={()=>open()}>menu</span>
            <ul>
                <li>
                    <Link className="default-hover" to="/">Home</Link>
                </li>
                <li>
                    <Link className="default-hover" to="/news">News</Link>
                </li>
                <li>
                    <Link className="default-hover" to="/games">Games</Link>
                </li>
                <li>
                    <Link className="default-hover" to="/projects">Projects</Link>
                </li>
                {
                    isAuthenticated ? (
                        <>
                            {(metadata?.app_metadata?.minecraft_auth) ? <li><Link className="default-hover" to="/minecraft-server">Services</Link></li> : null}
                            <li onClick={logout_user}><a className="default-hover">Logout</a></li>
                        </>
                    ) : null
                }
                <li>
                    <Link className="logo-hover" to={isAuthenticated ? "/account" : "/login"}>
                    {isAuthenticated ? <Image width={23} height={23} shape="circle" title="user picture" src={user?.picture}/> : <span className="material-icons">account_circle</span> }
                    </Link>
                </li>
            </ul>
        </nav>
    );
}