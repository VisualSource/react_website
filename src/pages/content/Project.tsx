import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Spin} from 'shineout';
import CONFIG from '../../config.json';
import {fetchContent} from '../../components/LoadStroage';
import ReactHtmlParser from 'react-html-parser';
import {Markdown} from '../../access/github';
import "../../style/markdown.css"


export default function Project(){
    const [isLoading, setIsLoading] = useState(true);
    const [content,setContent] = useState<any>();
    const [desc,setDesc] = useState<any>();
    const {project, id} = useParams<{project: string, id: string}>();
 
    const getStyle = () => {
        if (desc) {
            if (desc?.images[0]){
                return {backgroundColor: "orange", backgroundImage: `url(${CONFIG.root}${desc.images[0]})` ,backgroundSize:"100% 100%"};
            }else{
                return {backgroundColor: desc?.carousel_color ?? "orange"}
            }
        }

        return {backgroundColor: "orange"}
    }
    useEffect(()=>{
        const init = async () => {
            try {
                const content = await fetchContent("projects","posts");
                setDesc(content[Number(id)]);

                /*let raw = window.localStorage.getItem("projects"); 
                if (raw == null) {
                    try {
                        //TODO: make sure if times out or something this "projects" needs not to be set.
                        const data = await (await fetch(CONFIG.db)).json();
                      
                        window.localStorage.setItem("projects",JSON.stringify(data.posts));
                        setDesc(data.posts[Number(id)]);
                    } catch (error) {
                        console.error(error);
                    }
                }else {
                    setDesc(JSON.parse(raw)[Number(id)])
                }
                console.log(desc);*/
                
            } catch (error) {
                console.error(error);
            }
        
            try {
                let markdown = await Markdown(project);
                setContent(markdown.data);
            } catch (error) {
                setContent("<div class=\"no-readme\"><h1>404 - Theres no content to display</h1><div>");
                console.error(error);
                
            }
            setIsLoading(false);

        }
        init();
        
    },[]);
    if (!isLoading){
        return  <div id="project" style={getStyle()}>
                        <div className="markdown-content markdown-body">{ReactHtmlParser(content)}</div>
                </div>
    }
    return <div className="loader">
            <Spin size="54px" name="cube-grid" color="#ff3e00" />
        </div>

} 