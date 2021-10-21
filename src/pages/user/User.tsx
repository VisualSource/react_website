import { useEffect, useState } from 'react';
import {Figure} from 'react-bootstrap';
import Spinner from '../../components/Spinner';
import { useParams } from 'react-router-dom';
interface IUser {
    picture: string;
    sub: string;
    name: string;
    user_metadata: {}
}

export default function User(){
    const [loading,setLoading] = useState(true);
    const [user, setUser ] = useState<IUser>({ picture: "", sub: "", name: "", user_metadata: {} });
    const { sub } = useParams<{ sub: string }>();

    useEffect(()=>{
        const init = async () => {
            try {
                const data: IUser = await (await fetch(`${process.env.REACT_APP_API}/users/get/${sub}`)).json();
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        init();
    },[sub]);

    if(loading){
        return (
            <div className="loading-container"> 
                <Spinner/>
            </div>
        );
    }

    return (
        <div id="user">
            <h1>{user.name}</h1>
            <hr/>
            <Figure>
                <Figure.Image src={user.picture} alt="user avitar"/>
                <Figure.Caption>{user.sub}</Figure.Caption>
            </Figure>
        </div>
    );
}