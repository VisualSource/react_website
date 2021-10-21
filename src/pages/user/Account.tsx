import {useAuth0} from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Figure, ButtonGroup, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

import EnterCodeModal from './EnterCodeModal';

export default function Account() {
    const [modal,setModal] = useState(false);
    const [loading,setLoading] = useState<boolean>(false);
    const {getAccessTokenSilently,logout, user, isAuthenticated } = useAuth0();


    const closeModal = () => setModal(false);
    
    useEffect(()=>{
        const init = async () => {
            try {
                
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        init();
    },[]);


    if(loading) {
        return (
            <div className="loading-container">
                <Spinner/>
            </div>
        );
    }

    if(!isAuthenticated) {
        return (
            <Redirect to="/"/>
        );     
    }

    return (
        <div id="user-account"> 

            <EnterCodeModal state={modal} closeHandle={closeModal} />

            <div>
                <div>
                    <h3>{user?.name}</h3>
                    <hr />
                    <span>{user?.sub}</span>
                </div>

                <ButtonGroup>
                    <Button variant="secondary" onClick={()=>logout()}>Logout</Button>
                    <Button variant="secondary" onClick={()=>setModal(true)}>Enter Code</Button>
                    <Link to="/account/edit" className="btn btn-secondary">Edit Profile</Link>
                </ButtonGroup>
            </div>


            <div>
                <Figure>
                        <Figure.Image src={user?.picture} alt="user avitor"/>
                </Figure>
            </div>

        
        </div>
    );
}