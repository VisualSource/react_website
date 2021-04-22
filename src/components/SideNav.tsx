import React, { useRef, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Image } from 'shineout';
import { Link } from "react-router-dom";
import UseMetadata from '../access/UseMetadata';
import {useSharedSideNav} from '../access/UseSideNav';

export default function Sidenav(){
    const sidenav = useRef<HTMLDivElement>(null);
    const {isAuthenticated, user, logout, loginWithRedirect} = useAuth0();
    const metadata = UseMetadata();
    const {state, open} = useSharedSideNav();
    const logout_user = () => {
        window.sessionStorage.removeItem("metadata");
        logout({returnTo: window.location.origin});
    }
    useEffect(()=>{
        if(sidenav?.current){
            if(state){
                sidenav.current.style.display = "flex";
            }else{
                sidenav.current.style.display = "none";
            }
        }
    },[state]);
    return (
      <>
        <div className="sidenav show" ref={sidenav}>
            <span>
                <button className="sidenav-close" onClick={()=>open()}>&times;</button>
            </span>
            <div className="profile">
                <Image width={64} height={64} title="user" src={user?.picture ?? "https://robohash.org/VisualSourceWebsiteTempUser?bgset=bg2"} shape="circle"/>
                <div className="info">
                    <span className="username">{user?.name ?? ""}</span>
                    <pre className="email">{user?.email ?? ""}</pre>
                </div>
            </div>
            <ul>
                <li onClick={()=>open(true)}><Link to="/">Home</Link></li>
                <li onClick={()=>open(true)}><Link to="/news">News</Link></li>
                <li onClick={()=>open(true)}><Link to="/games">Games</Link></li>
                <li onClick={()=>open(true)}><Link to="/projects">Projects</Link></li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">User</a></li>
                {
                    isAuthenticated ? (
                        <>
                            <li className="active" onClick={()=>open(true)}><Link to="/account">Account</Link></li>
                            {metadata?.app_metadata?.minecraft_auth ? <li className="active" onClick={()=>open(true)}><Link to="/minecraft-server">Minecraft Server</Link></li> : null}
                            <li className="active" onClick={logout_user}><a>Logout</a></li>
                        </>
    
                    ) : (
                        <>
                            <li onClick={()=>loginWithRedirect()} ><a>Login</a></li>
                            <li onClick={()=>loginWithRedirect({screen_hint: "signup"})}><a>Register</a></li>
                        </>
                    )
                }
            </ul>
        </div>
      </>
    );
} 
