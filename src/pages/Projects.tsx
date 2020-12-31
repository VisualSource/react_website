import React, {useEffect,useState} from 'react';
import { Carousel, Spin} from 'shineout';
import {useHistory} from 'react-router-dom';
import CONFIG from '../config.json';

export default function Projects(){
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState();
    const history = useHistory();

    useEffect(()=>{
        const loadContent = async () => {

            let raw = window.localStorage.getItem("projects");

            let parse = [];

            if (raw == null) {
                try {
                    const data =  await (await fetch(CONFIG.db)).json();
                  
                    window.localStorage.setItem("projects",JSON.stringify(data));
                    parse = data;
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            }else{
                let a = JSON.parse(raw);
                parse = a;
            }

            setProjects(parse.map(({images, title, carousel_color, text_bg_color, repo, text_shadow}: any, index: number)=>{
                return <div key={repo} className="carousel-card" style={{ background: carousel_color ?? "#292933", backgroundImage: images[0] ? `url(${images[0]})` : "none", backgroundSize: "100% 100%"}}>
                            <div onClick={()=>{history.push(`/projects/${repo}/${index}`);}} 
                                 style={{ background: text_bg_color ?? '#ff3e00'}} 
                                 className={`project-text${text_shadow ? " project-bg-shadow" : ""}`}>{title}</div>
                        </div>
            }));
            setLoading(false);
         
        }
        loadContent();
    },[]);

    if (!loading) {
        return <Carousel interval={5000} animation="slide-y" indicatorPosition="left" indicatorType="line">
                    <div className="carousel-card" style={{  backgroundImage: `url(${CONFIG.root}/content/projects.webp)` , backgroundSize: "100% 100%"}}>
                            <div style={{ background: '#ff3e00'}} className={`project-text project-bg-shadow`}>Projects</div>
                    </div>
                    {projects}
                </Carousel>
    }

    return <div className="loader">
            <Spin size="54px" name="cube-grid" color="#ff3e00" />
        </div>
}

