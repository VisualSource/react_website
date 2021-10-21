import NewsContent from './NewsContent';
import {Tabs, Tab} from 'react-bootstrap';
// Projects Website Games Services
export default function News(){
    return (
        <div id="vs-news">
            <Tabs defaultActiveKey="website">
                <Tab eventKey="website" title="Website" className="markdown-body">
                    <NewsContent page="website" />
                </Tab>
                <Tab eventKey="games" title="Games" className="markdown-body">
                    <NewsContent page="games" />
                </Tab>
                <Tab eventKey="projects" title="Projects" className="markdown-body" >
                    <NewsContent page="projects" />
                </Tab>
                <Tab eventKey="services" title="Services" className="markdown-body">
                    <NewsContent page="services" />
                </Tab>
            </Tabs>
        </div>
    );
}