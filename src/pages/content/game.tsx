import React,{useState, useEffect} from 'react';
import {Spin} from 'shineout';
import {fetchContent} from '../../components/LoadStroage';
interface GameContent {
    title: string;
    description: string;
    route: string;
}
export default function Game(){
    const [isLoading,setLoading] = useState<boolean>(true);
    const [content,setContent] = useState<GameContent[]>([]);
    const [showing,setShowing] = useState<number>(0);
    useEffect(()=>{
        const init = async ()=>{
           try {
            const data = await fetchContent("games","comments");
            setContent(data);
            setLoading(false);
           } catch (error) {
               setLoading(false);
           }
        }
        init();
    },[]);

    if(isLoading){
        return (
            <div className="loader">
                <Spin size="54px" name="cube-grid" color="#ff3e00" />
            </div>
        );
    }

    return (
        <div className="games-content">
            <div className="showing-game"></div>
            <button onClick={()=>{
                if((showing + 1) < content.length) setShowing(showing + 1);
            }} className="btn-right">{">"}</button>
            <button onClick={()=>{
                if((showing - 1) >= 0) setShowing(showing - 1);
            }} className="btn-left">{"<"}</button>
        </div>
    );
}