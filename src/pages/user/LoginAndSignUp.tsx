import {useAuth0} from '@auth0/auth0-react';
export default function LoginOrSignUp (){
    const {loginWithPopup,loginWithRedirect} = useAuth0();

    return (
        <div>
            <button className="btn btn-primary vs-btn-theme" onClick={()=>loginWithPopup({screen_hint: "signup"})}>Sign up</button>
            <div>Or</div>
            <button className="btn btn-primary vs-btn-theme" onClick={()=>loginWithRedirect()}>Login</button>
        </div>
    );
}