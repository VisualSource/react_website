import {useAuth0} from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Figure, ButtonGroup, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

import EnterCodeModal from './EnterCodeModal';

export default function Account() {
    const [modal,setModal] = useState(false);
    const [loading,setLoading] = useState<boolean>(false);
    const { logout, user, isAuthenticated, isLoading } = useAuth0();


    const closeModal = () => setModal(false);
    
    useEffect(()=>{
        const init = async () => {
            try {
                setLoading(isLoading);
            } catch (error) {
                setLoading(false);
            }
        }
        init();
    },[isLoading]);


    if(loading) return (
        <div className="loading-container">
             <Spinner/>
        </div>
    );
    

    if(!isAuthenticated) return (
        <Navigate to="/signin" replace/>
    );

    return (
        <div id="vs-user-account"> 

            <EnterCodeModal state={modal} closeHandle={closeModal} />

            <div className="vs-user-options">
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


            <div className="vs-user-figure">
                <Figure>
                        <Figure.Image height={360} width={360} src={user?.picture} alt="user avitor"/>
                </Figure>
            </div>

        
        </div>
    );
}