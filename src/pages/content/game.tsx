import React,{useState, useEffect} from 'react';
import {Spin} from 'shineout';
import {fetchContent} from '../../components/LoadStroage';
import CONFIG from '../../config.json';
interface GameContent {
    title: string;
    description: string;
    route: string;
    image: string;
}
export default function Game(){
    const [isLoading,setLoading] = useState<boolean>(true);
    const [content,setContent] = useState<GameContent[]>([]);
    useEffect(()=>{
        const init = async ()=>{
           try {
            const data = await fetchContent("games","comments");
            setContent(data.games);
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
            {
                content?.map((item,key)=>{
                    return (
                        <div className="card" key={key}>
                            <img src={`${CONFIG.root}${item.image ?? "content/projects.webp"}`} alt="game preview"/>
                            <div className="container">
                                <h4><b>{`Title: ${item.title}`}</b></h4>
                                <p>{`Description: ${item.description}`}</p>
                                <div>Play game: <a href={`${CONFIG.root}${item.route}`}>Here</a></div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}