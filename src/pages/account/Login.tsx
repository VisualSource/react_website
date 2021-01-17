import React from 'react';
import {useLocation} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import {Button} from 'shineout';

export default function Login(){
    const location = useLocation();
    const {loginWithRedirect} = useAuth0();
    const { from } = location.state as any ?? {from:{pathname:"/"}};

    return <>
            <div id="login-screen">
                <div className="lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
            </div>
            <div className="content">
                    <h2>Login/Register to view content</h2>
                    <Button type="primary" size="large" onClick={()=>loginWithRedirect({appState: from})}>Login</Button>
            </div>
        </>

} 