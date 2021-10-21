import MCServer from "./MCServer";
import MCInstaller from "./MCInstaller";

import {Tabs, Tab} from 'react-bootstrap';


export default function Services() {
    return (
        <div id="vs-services">
            <Tabs defaultActiveKey="mc-server"> 
                <Tab eventKey="mc-server" title="MC Server">
                    <MCServer/>
                </Tab>
                <Tab eventKey="mc-installer" title="MC Installer" className="markdown-body">
                    <MCInstaller/>
                </Tab>
            </Tabs>
        </div>
    );
}