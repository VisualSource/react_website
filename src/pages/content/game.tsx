import React,{useState, useEffect} from 'react';
import {Spin} from 'shineout';
import {fetchContent} from '../../components/LoadStroage';
import CONFIG from '../../config.json';
import {Button} from 'shineout';
interface GameContent {
    title: string;
    description: string;
    route: string;
    image: string;
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
            <div className="sidecard-a">
                <span>Game</span>
                <div className="discription">
                    <span>Play</span>
                    <span>Photo by Carl Raw on Unsplash</span>
                </div>
            </div>
            <div className="sidecard-b">
                <span>Game</span>
                <div className="discription">
                    <span>Play</span>
                    <span>Photo by Alexey Savchenko on Unsplash</span>
                </div>
            </div>
            <div className="showing-game" style={{backgroundSize: "100% 100%", backgroundImage: `url('${CONFIG.root}${content[showing].image}')`}}>
                <span>{content[showing].title}</span>
                <div className="discription">
                    <span>Play <a href={`${CONFIG.root}${content[showing].route}`}>Here</a></span>
                    <span>{content[showing].description}</span>
                </div>
            </div>
            <Button className="btn-right" onClick={()=>{
                if((showing + 1) < content.length) setShowing(showing + 1);
            }}>{">"}</Button>
            <Button onClick={()=>{
                if((showing - 1) >= 0) setShowing(showing - 1);
            }} className="btn-left">{"<"}</Button>
        </div>
    );
}