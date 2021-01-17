import React,{useEffect,useState} from 'react';
import ReactMarkdown from 'react-markdown'
import {Spin} from 'shineout';
import {useLocation} from 'react-router-dom';
const test_data = {
    "website": {
        "title":"Website",
        "content":"https://raw.githubusercontent.com/VisualSource/polytopiajs/master/README.md"
    },
    "games":{
        "title":"Games",
        "content":"https://raw.githubusercontent.com/VisualSource/polytopiajs/master/README.md"
    },
    "projects":{
        "title":"Projects",
        "content":"https://raw.githubusercontent.com/VisualSource/polytopiajs/master/README.md"
    },
    "services":{
        "title":"Services",
        "content":"https://raw.githubusercontent.com/VisualSource/polytopiajs/master/README.md"
    }
}


export default function News(){
    const loc = useLocation();
    const [viewing,setViewing] = useState<string>("website");
    const [pages, setPages] = useState(test_data);
    const [loading,setLoading] = useState<boolean>(true);
    const [markdown,setMarkdown] = useState<string>("");
    useEffect(()=>{
        const load = async() => {
            const search = new URLSearchParams(loc.search.split("?")[1]);
            if(search.has("q")){
                setViewing(search.get("q") as string);
            }

            try {
                const raw = await fetch((pages as any)[viewing].content);
                //setMarkdown(await raw.text());
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
            <div>
               <ReactMarkdown children={markdown}/>
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

/**
 * 
 *  <h1>Website News</h1>
                <hr/> 
                <div>
                    <h2>Update 1.4.6</h2>
                    <summary>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe iure laboriosam possimus dolorem, cupiditate veniam similique sapiente quaerat libero commodi? Aspernatur iste temporibus aliquid repudiandae sit? Voluptatum ducimus iste beatae.</summary>
                    <hr/>
                    <div>
                        <h4>Fixes</h4>
                        <ul>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                        </ul>
                    </div>
                    <div>
                        <hr/>
                        <h4>Changes</h4>
                        <ul>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                        </ul>
                    </div>
                    <div>
                        <hr/>
                        <h4>New</h4>
                        <ul>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                        </ul>
                    </div>
                </div>
                <hr/> 
                <div>
                    <h2>Update 1.3.6</h2>
                    <summary>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe iure laboriosam possimus dolorem, cupiditate veniam similique sapiente quaerat libero commodi? Aspernatur iste temporibus aliquid repudiandae sit? Voluptatum ducimus iste beatae.</summary>
                    <hr/>
                    <div>
                        <h4>Fixes</h4>
                        <ul>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                        </ul>
                    </div>
                    <div>
                        <hr/>
                        <h4>Changes</h4>
                        <ul>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                        </ul>
                    </div>
                    <div>
                        <hr/>
                        <h4>New</h4>
                        <ul>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                            <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</li>
                        </ul>
                    </div>
                </div>
 * 
 * 
 */