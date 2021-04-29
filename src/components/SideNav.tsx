import React, { useRef, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Image } from 'shineout';
import { Link } from "react-router-dom";
import UseMetadata from '../hooks/UseMetadata';
import {useSharedSideNav} from '../hooks/UseSideNav';

export default function Sidenav(){
    const sidenav = useRef<HTMLDivElement>(null);
    const {isAuthenticated, user, logout, loginWithRedirect} = useAuth0();
    const metadata = UseMetadata();
    const {state, open} = useSharedSideNav();
    const logout_user = () => {
        window.sessionStorage.removeItem("metadata");
        logout({returnTo: window.location.origin});
    }
    const routeTo = (loc: string)=>{
        open(true);
        window.location.pathname = loc;
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
                <li onClick={()=>routeTo("/")}><a>Home</a></li>
                <li onClick={()=>routeTo("/news")}><a>News</a></li>
                <li onClick={()=>routeTo("/games")}><a>Games</a></li>
                <li onClick={()=>routeTo("/projects")}><a>Projects</a></li>
                <li><div className="divider"></div></li>
                <li><a className="subheader">User</a></li>
                {
                    isAuthenticated ? (
                        <>
                            <li className="active" onClick={()=>routeTo("/account")}><a>Account</a></li>
                            {metadata?.app_metadata?.minecraft_auth ? <li className="active" onClick={()=>routeTo("/minecraft-server")}><a>Minecraft Server</a></li> : null}
                            <li className="active" onClick={logout_user}><a>Logout</a></li>
                        </>
    
                    ) : (
                        <>
                            <li onClick={()=>loginWithRedirect()}><a>Login</a></li>
                            <li onClick={()=>loginWithRedirect({screen_hint: "signup"})}><a>Register</a></li>
                        </>
                    )
                }
            </ul>
        </div>
      </>
    );
} 
