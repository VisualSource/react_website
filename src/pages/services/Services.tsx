import MCServer from "./mcserver/MCServer";
import MCInstaller from "./MCInstaller";

import {Tabs, Tab} from 'react-bootstrap';


export default function Services() {
    return (
        <div id="vs-services">
            <Tabs defaultActiveKey="mc-server"> 
                <Tab eventKey="mc-server" title="MC Server" tabClassName="bg-dark text-light">
                    <MCServer/>
                </Tab>
                <Tab eventKey="mc-installer" title="MC Installer" className="markdown-body" tabClassName="bg-dark text-light">
                    <MCInstaller/>
                </Tab>
            </Tabs>
        </div>
    );
}