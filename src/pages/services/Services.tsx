import React from 'react';
import { Tabs } from 'shineout';
import {IfAuthed} from '../../components/ShowIfAuthed';
import useMetadata from "../../hooks/UseMetadata";
import Server from './Server';

/*

{
    isAuthenticated ? (
    <>
        {(metadata?.app_metadata?.minecraft_auth) ? <li><Link className="default-hover" to="/services">Services</Link></li> : null}
    </>
    ) : null
}

*/

export const Services = () => {
    const metadata = useMetadata();
    return (
        <div className="services-page">
            <Tabs switchToTop={true} tabBarStyle={{color:"#ffffff"}} align={window.innerWidth < 520 ?  "left" : "vertical-right"} shape="line" className="services-tabs">
                <Tabs.Panel style={{color:"#ffffff"}} tab="Minecraft" className="services-tab">
                    <IfAuthed other={metadata?.app_metadata?.minecraft_auth}>
                        <Server/>
                    </IfAuthed>
                </Tabs.Panel>
                <Tabs.Panel color="#ffffff" tab="Servers" className="services-tab">
                   
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}