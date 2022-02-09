import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import Spinner from '../../components/Spinner';

interface CardProps {
    image: string;
    title: string;
    description: string;
    id: number;
}

interface Project {
    images: string[]
    title: string;
    branch: string;
    repo: string;
    desc: string;
}

function Card({id, image, title= "Project", description = "No Description"}: CardProps){
    return (
    <div className="card bg-dark text-light" style={{width: "18rem"}}>
        <img src={image ?? "/images/projects.webp"} className="card-img-top" alt="project thumbnail"/>
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <Link to={`/project/${id}`} className="btn btn-secondary">View</Link>
        </div>
    </div>
    )
}

export default function Projects() {
    const [loading,setLoading] = useState<boolean>(true);
    const [projects,setProjects] = useState<Project[]>([]);
    useEffect(()=>{
        const init = async () => {
            try {
                const raw = await fetch(`${process.env.REACT_APP_API}content/projects`);
                const json = await raw.json();
                setProjects(json);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        init();
    },[]);

    if(loading){
        return (
            <div className="loading-container">
                <Spinner/>
            </div>
        );
    }

    return (
        <div id="vs-projects">
            {
                projects.map((value,id)=>{
                    return <Card id={id} key={id} title={value.title} description={value.desc} image={value.images[0]}/>
                })
            }

        </div>
    );
}