import React,{useEffect,useState} from 'react';
import {NewsMarkdown} from '../../access/github';
import ReactHtmlParser from 'react-html-parser';
import {Spin} from 'shineout';
import {useLocation} from 'react-router-dom';
const test_data = {
    "website": {
        "title":"Website",
        "content":"website"
    },
    "games":{
        "title":"Games",
        "content":"games"
    },
    "projects":{
        "title":"Projects",
        "content":"projects"
    },
    "services":{
        "title":"Services",
        "content":"services"
    }
}


export default function News(){
    const loc = useLocation();
    const [viewing,setViewing] = useState<string>("website");
    const [pages, setPages] = useState(test_data);
    const [loading,setLoading] = useState<boolean>(true);
    const [markdown,setMarkdown] = useState<string>("<h1>Error - No content</h1>");
    useEffect(()=>{
        const load = async() => {
            const search = new URLSearchParams(loc.search.split("?")[1]);
            if(search.has("q")){
                setViewing(search.get("q") as string);
            }

            try {
                const raw = await NewsMarkdown(viewing);
                console.log(raw);
                setMarkdown(raw.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }


        }

        load();
    },[loc.search, viewing]);


    if (loading){
        return <div className="loader">
            <Spin size="54px" name="cube-grid" color="#ff3e00" />
        </div>
    }

    return (
        <div id="news">
            <div className="news-markdown markdown-body">
               {ReactHtmlParser(markdown)}
            </div>
            <aside className="options">
                <div>Website</div>
                <div>Games</div>
                <div>Projects</div>
                <div>Services</div>
            </aside>
        </div>
    );
}

