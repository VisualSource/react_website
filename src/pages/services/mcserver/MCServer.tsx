import { useEffect, useState } from 'react';
import {Dropdown, DropdownButton, Image} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import InnerImageZoom from 'react-inner-image-zoom';
import Spinner from '../../../components/Spinner';
import { motdParser } from '@sfirew/mc-motd-parser';
import { useMetadata } from '../../../api/useMetadata';
interface IMaps {
    Overworld: string;
    Nether: string;
    End: string;
    Aether: string;
}

interface IServer {
    description: {
        [key: string]: string | boolean | object | Array<object> | undefined;
        font?: string;
        color?: string;
        text?: string;
        extra?: object[];
    };
    players: {
        max: number;
        online: number;
        users: string[]
    };
    version: string[]
    favicon: string;
}

export default function MCServer(){
    const [ worldMaps, setWorldMaps ] = useState<IMaps | undefined>();
    const [loading,setLoading] = useState<boolean>(true);
    const [selectedMap,setSelectedMap] = useState<string>("Overworld");
    const [server,setServer] = useState<IServer>({description: {text:"Server MOTD"}, players: {max: 0, online: 0, users: []}, version: ["1.17.0"], favicon: ""});
    const auth = useMetadata();
    useEffect(()=>{
        const init = async () => {
            try {
                const raw = await fetch(`${process.env.REACT_APP_API}minecraft/maps`);

                const maps = await raw.json();

                const queryRaw = await fetch(`${process.env.REACT_APP_API}minecraft/query`);

                const query = await queryRaw.json();

                setServer(query);

                setWorldMaps(maps);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        init();
    },[]);

    if(loading || auth.isLoading) {
        return (
            <div className="vs-spinner-wrapper">
                <Spinner/>
            </div>
        )
    }

    return (
        <div id="vs-mc-server">
            <div id="vs-server-stats">
                <h2>Server Status</h2>
                <hr/>
                <span>
                    <Image src={server.favicon} alt="server icon" fluid/>
                </span>
                <p id="vs-motd">{ ReactHtmlParser(motdParser.JSONToHtml(server.description))}</p>
                <hr />
                <div id="vs-player-list">
                    <h5>Players {server.players.online}/{server.players.max}</h5>
                    <ol>
                        {server.players.users.map(((user,i)=>(
                            <li key={i}>{user}</li>
                        )))}
                    </ol>
                </div>
                <hr />
                <Link className="btn btn-secondary" to="/server/resources?type=plugins">View Plugins</Link>
                <Link className="btn btn-secondary" to="/server/resources?type=datapacks">View Datapacks</Link>
                <Link className="btn btn-secondary" to="/server/resources?type=resource-packs">View Resource Packs</Link>
                <Link className="btn btn-secondary" to="/server/resources?type=mods">View Mods</Link>
                {
                    auth.appdata?.minecraft === "server_admin" ? <Link className="btn btn-secondary" to="/server/resources/admin">Admin View</Link> : null
                }
            </div>
            <div id="vs-server-map">
                <div id="vs-map-wrapper">
                    <InnerImageZoom src={worldMaps ? (worldMaps as any)[selectedMap] : ""} height={500} width={600}/>
                </div>
                <DropdownButton title="Select Map" variant="secondary">
                    <Dropdown.Item onClick={()=>setSelectedMap("Overworld")}>Overworld</Dropdown.Item>
                    <Dropdown.Item onClick={()=>setSelectedMap("Nether")}>Nether</Dropdown.Item>
                    <Dropdown.Item onClick={()=>setSelectedMap("Aether")}>Aether</Dropdown.Item>
                    <Dropdown.Item onClick={()=>setSelectedMap("End")}>The End</Dropdown.Item>
                </DropdownButton>
            </div>
        </div>
    );
}