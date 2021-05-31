import React,{useEffect,useState} from 'react';
import {NewsMarkdown} from '../../api/Github';
import HtmlParser from "react-html-parser";
import {Spin, Tabs} from 'shineout';

const hiddenPanel = { display: "none" };

export default function News(){
    const [viewing,setViewing] = useState<string>("website");
    const [loading,setLoading] = useState<boolean>(true);
    const [markdown,setMarkdown] = useState<string>("<h1>Error - Failed to load content</h1>");
    useEffect(()=>{
        const load = async() => {
            try {
                const raw = await NewsMarkdown(viewing);
                setMarkdown(raw.data);
                setLoading(false);
            } catch (error) {
                console.error("There was a loading error");
                setLoading(false);
            }
        }

        load();
    },[viewing]);

    return (
        <div id="news">
           { loading ? <div className="loader"><Spin size="54px" name="cube-grid" color="#ff3e00" /></div> : <div className="news-markdown markdown-body">
               { HtmlParser(markdown) }
            </div>}
            <aside className="options">
                <Tabs defaultActive="website" border="#ffffff" align={window.innerWidth < 520 ? "right" : "vertical-right"} shape="line" onChange={(key)=>{setLoading(true); setViewing(key) }}>
                    <Tabs.Panel id="website" style={hiddenPanel} tab="Website"></Tabs.Panel>
                    <Tabs.Panel id="projects" style={hiddenPanel} tab="Projects"></Tabs.Panel>
                    <Tabs.Panel id="games" style={hiddenPanel} tab="Games"></Tabs.Panel>
                    <Tabs.Panel id="services" style={hiddenPanel} tab="Services"></Tabs.Panel>
                </Tabs>
            </aside>
        </div>
    );
}

