import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Git from "../../api/Github";
import ReactHtmlParser from 'react-html-parser';
import Spinner from "../../components/Spinner";

interface IProject {
    images: string[]
    title: string;
    branch: string;
    repo: string;
    desc: string;
}

const noContent = `
    <div className="vs-project-no-content">
        <h1>No Content to load</h1>
    </div>
`;

export default function Project(){
    const [loading,setLoading] = useState<boolean>(true);
    const { id } = useParams<{id: string}>();
    const [markdown,setMarkdown] = useState<string>(noContent);
    useEffect(()=>{
        const init = async () => {
            try {
                const raw = await fetch(`${process.env.REACT_APP_API}content/projects`);
                const json = await raw.json();
                const project = json[Number(id)] as IProject;
                const markdown = await Git.get_repo_readme({repo: project.repo, branch: project.branch, user: "VisualSource"});

                setMarkdown(markdown);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        init();
    },[id]);
    
    if(loading) return (
        <div className="loading-container">
            <Spinner/>
        </div>
    )

    return (
        <div id="project" className="markdown-body">
            {ReactHtmlParser(markdown)}
        </div>
    );
}