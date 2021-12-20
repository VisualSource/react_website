import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function AccountItem(){
    const { isAuthenticated, user } = useAuth0();
    return (
        <Link className="vs-navbar-account" to={isAuthenticated ? "/account" : "/signin"}>
             <span>{isAuthenticated ? user?.name : "Sign in"}</span>
            {
                isAuthenticated ? (
                    <img src={user?.picture} alt="user avitar"/>
                ) : (
                    <span className="material-icons">account_circle</span>
                )
            }
        </Link>
    );
}