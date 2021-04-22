import React,{ useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

export default function Login(){
    const location = useLocation();
    const {loginWithRedirect} = useAuth0();
    const { from } = location.state as any ?? { from:{ pathname:"/" }};

    useEffect(()=>{
        if(location.search === "?force=login") loginWithRedirect({appState: from });
        if(location.search === "?force=register") loginWithRedirect({ screen_hint: "signup" });
    },[]);

    return <>
            <div id="login-screen">
                <div className="lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
            </div>
            <div className="content">
                <h2>Signin to View Content</h2>
                <span className="login-options"><a onClick={()=>loginWithRedirect({appState: from })}>Login</a> / <a onClick={()=>loginWithRedirect({ screen_hint: "signup" })}>Register</a></span>
            </div>
        </>

} 