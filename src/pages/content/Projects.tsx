import React, {useEffect,useState} from 'react';
import { Spin, Button } from 'shineout';
import {useHistory} from 'react-router-dom';
import {fetchContent} from '../../components/LoadStroage';
import CONFIG from '../../config.json';
interface Project {
    tags: string[];
    images: string[];
    title: string;
    repo: string;
    bg_color: string;
}

export default function Projects(){
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const history = useHistory();

    useEffect(()=>{
        const init = async () => {
            try {
                const content = await fetchContent("projects","posts");
                setProjects(content);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        init();
    },[]);

    if (loading) {
        return (
            <div className="loader">
                <Spin size="54px" name="cube-grid" color="#ff3e00" />
            </div>
        );
    }

    return (
       <div className="project-content">
           {
               projects?.map((value,key)=>{
                   return (
                        <div className="card" key={key}>
                            <header>
                                <img src={`${CONFIG.root}${value.images[0] ?? "content/projects.webp"}`} alt="project preview"/>
                            </header>
                            <main>
                                <h3><b>{value.title}</b></h3>
                                <div className="action-button">
                                    <Button onClick={()=>{history.push(`/projects/${value.repo}/${key}`);}} type="primary">View</Button>
                                </div>
                            </main>
                        </div>
                   );
               })
           }
       </div>
    );
    

   
}

