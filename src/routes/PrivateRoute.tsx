import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Route, Redirect} from "react-router-dom";
import {Spin} from 'shineout';

export default function PrivateRoute({children, ...rest}:any){
    const {isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return  <div className="loader">
                    <Spin size="54px" name="cube-grid" color="#ff3e00" />
                </div>
    }

    return (
        <Route 
            {...rest} 
            render={({location})=>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect to={{pathname:"/login", state: {from: location}}}/>
                )
        }/>
    );
}