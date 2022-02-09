import {useAuth0} from '@auth0/auth0-react';
import Particles from "react-tsparticles";
import {config} from '../../api/PartialConfig';

export default function LoginOrSignUp (){
    const { loginWithRedirect } = useAuth0();

    return (
        <div id="vs-account-login">
            <Particles id="vs-singin-bg" options={config}/>
            <main>
                <h2>Login or Signup to continue</h2>
                <div>
                    <button className="btn btn-secondary" onClick={()=>loginWithRedirect({screen_hint: "signup"})}>Sign up</button>
                    <h5>or</h5>
                    <button className="btn btn-secondary" onClick={()=>loginWithRedirect()}>Login</button>
                </div>
            </main>
        </div>
    );
}