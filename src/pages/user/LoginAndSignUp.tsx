import {useAuth0} from '@auth0/auth0-react';
import Particles from "react-tsparticles";
import {config} from '../../api/PartialConfig';

export default function LoginOrSignUp (){
    const { loginWithRedirect } = useAuth0();

    return (
        <div id="vs-account-login">
            <Particles id="vs-singin-bg" options={config}/>
            <main>
                <h3>Login or Signup to continue</h3>
                <button className="btn btn-secondary" onClick={()=>loginWithRedirect({screen_hint: "signup"})}>Sign up</button>
                <div>
                    <h5>Or</h5>
                </div>
                <button className="btn btn-secondary" onClick={()=>loginWithRedirect()}>Login</button>
            </main>
        </div>
    );
}