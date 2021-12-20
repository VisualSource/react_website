import { useEffect, useState } from 'react';
import {Figure} from 'react-bootstrap';
import Spinner from '../../components/Spinner';
import { useParams } from 'react-router-dom';
import ErrorPage from '../errors/ErrorPage';



interface IUser {
  name: string;
  picture: string;
  user_id: string;
  user_metadata: Usermetadata;
}
interface Usermetadata {
  color: string;
  friends: any[];
}


export default function User(){
    const [loading,setLoading] = useState(true);
    const [hasError,setError] = useState(false);
    const [user, setUser ] = useState<IUser>({ picture: "", user_id: "", name: "", user_metadata: { color: "red", friends: [] } });
    const { sub } = useParams<{ sub: string }>();

    useEffect(()=>{
        const init = async () => {
            try {
                setLoading(true);

                if(!sub || (sub && sub.length <= 0)) throw new Error("Sub is empty or invaild");
                
                if(user.user_id === sub) {
                    setLoading(false);
                    return;
                }

                const raw = await fetch(`${process.env.REACT_APP_API}users/get/${sub}`);
                
                if(!raw.ok){
                    throw new Error("Failed to fetch user");
                }
                const data: IUser = await raw.json();

                setUser(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(true);
            }
        }
        init();
    },[sub,user.user_id]);

    if(loading){
        return (
            <div className="loading-container"> 
                <Spinner/>
            </div>
        );
    }

    if(hasError) return <ErrorPage error={404}/>

    return (
        <div id="vs-user-account">

            <div className="vs-user-options">
                <div>
                    <h3>{user?.name}</h3>
                    <hr />
                    <span>{user?.user_id}</span>
                </div>
            </div>

            <div className="vs-user-figure">
                <Figure>
                    <Figure.Image height={360} width={360} src={user?.picture} alt="user avitor"/>
                </Figure>
            </div>
            
        </div>
    );
}