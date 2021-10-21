import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function AccountItem(){
    const { isAuthenticated, user } = useAuth0();
    console.log(user);
    return (
        <Link className="vs-navbar-account" to={isAuthenticated ? "account" : "signin"}>
             <span>{isAuthenticated ? "Account" : "Sign in"}</span>
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