import {useAuth0} from '@auth0/auth0-react';
import React from 'react';

export const IfAuthed = ({other = true, children}: any) => {
    const { isAuthenticated } = useAuth0();
    
    if(isAuthenticated && other){
        return children;
    }

    return (
        <div className="not-authed">
            <h4>To access this content pleace login or register.</h4>
        </div>  
    );

}
 