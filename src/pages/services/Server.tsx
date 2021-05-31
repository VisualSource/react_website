import React, {useState,useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {Redirect} from 'react-router-dom';
import { Spin, Button, CardGroup, Message } from 'shineout';
import {Link} from 'react-router-dom';
interface PlayerListData{
   id: string;
   name: string;
   has_account: boolean;
}
interface ServerData {
  online: boolean;
  host: string;
  players: PlayerListData[];
  player_count: number;
  max_players: number;
}

enum ButtonText{
  START = "Start",
  STARTING = "Starting",
  STOP = "Stop",
  STOPING = "STOPING",
  WATING = "Wating..",
  ERROR = "Error"
}
enum ButtonColor {
  GOOD = "success",
  BAD = "danger",
  WARN = "warning"
}


function PlayerItem(data: any){
    return (
      <div className="player">
        <span className="material-icons">account_circle</span> 
        <code><Link to={`/user-account/${data.name}`}>{data.name}</Link></code>
      </div>
    )
}
let timeout = 0;
export default function Server(){
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userMetadata, setUserMetadata] = useState(null);
    const [content_loading,setContentLoading] = useState(true);
    const [status,setStatus] = useState({color: ButtonColor.WARN, loading: true, text: ButtonText.WATING});
    const [server_info, setServerInfo] = useState<ServerData>({online: false, host: '35.209.27.81', players: [], player_count: 0, max_players: 10});

    const fetchServerData = async () => {
        try {
          const server_data = await (await fetch(`${process.env.REACT_APP_SERVER_SCRIPTS}server_info.php`)).json();
          if (server_data?.type === "info") {
            switch (server_data?.data?.vm_status) {
              case "TERMINATED":{
                setStatus({color: ButtonColor.GOOD, loading: false, text: ButtonText.START});
                setServerInfo({
                  online: false,
                  host: "35.209.27.81",
                  players: Array.isArray(server_data?.data?.server?.players) ? server_data?.data?.server?.players : [],
                  player_count: server_data?.data.server?.current_players ?? 0,
                  max_players: server_data?.data?.server?.max_players ?? 10
                });
                break;
              }
              case "SUSPENDED":
              case "RUNNING":
                setServerInfo({
                  online: true,
                  host: "35.209.27.81",
                  players: Array.isArray(server_data?.data?.server?.players) ? server_data?.data?.server?.players : [],
                  player_count: server_data?.data.server?.current_players ?? 0,
                  max_players: server_data?.data?.server?.max_players ?? 10
                });
                setStatus({color: ButtonColor.BAD, loading: false, text: ButtonText.STOP});
                break;
              case "STOPPING":
              case "SUSPENDING":
              case "REPAIRING":
              case "PROVISIONING":
              case "STAGING":
                setStatus({color: ButtonColor.WARN, loading: true, text: ButtonText.WATING});
                setTimeout(()=>{
                  fetchServerData();
                },3000);
                break;
              default:{
                setStatus({color: ButtonColor.WARN, loading: true, text: ButtonText.WATING});
                if(timeout < 5){
                  setTimeout(()=>{
                    timeout++;
                    fetchServerData();
                  },3000);
                }else{
                  setStatus({color: ButtonColor.BAD, loading: true, text: ButtonText.ERROR});
                  Message.error(<div>Can not get server status</div>, 8, {
                    position: "top-right",
                    title: "Server",
                  });
                }
                break;
              }
            }
          }else{
            Message.info(<div>{server_data?.msg ?? "There was an error"}</div>, 8, {
              position: "top-right",
              title: "Server",
            });
            setStatus({color: server_info.online ? ButtonColor.BAD : ButtonColor.GOOD, loading: false, text: server_info.online ? ButtonText.STOP : ButtonText.START});
          }
        } catch (error) {
          console.error(error);  
        }
      setContentLoading(false);
    }

    const handle_button = async () => {
        setStatus({color: ButtonColor.WARN, loading: true, text: ButtonText.WATING});
        try {
          const accessToken = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:current_user read:users_app_metadata",
          });

          const request = await fetch(`${process.env.REACT_APP_SERVER_SCRIPTS}control.php`,{
            method:"POST",
            body: JSON.stringify({
              token: accessToken,
              request_type: server_info.online ? "stop" : "start",
              sub: user?.sub
            })
          });

          const responce = await request.json();

          if (responce?.type === "info"){
            Message.success(<div>{responce?.msg ?? "The request has been accepted."}</div>, 8, {
              position: "top-right",
              title: "Server",
            });
            fetchServerData();
          }else{
            setStatus({color: server_info.online ? ButtonColor.BAD : ButtonColor.GOOD, loading: false, text: server_info.online ? ButtonText.STOP : ButtonText.START});
            Message.error(<div>{responce?.msg ?? "There was an error"}</div>, 8, {
              position: "top-right",
              title: "Server",
            });
          }
        } catch (error) {
          setStatus({color: server_info.online ? ButtonColor.BAD : ButtonColor.GOOD, loading: false, text: server_info.online ? ButtonText.STOP : ButtonText.START});
          Message.error(<div>There was an error in the request</div>, 8, {
            position: "top-right",
            title: "Server",
          });
        }
    }


    useEffect(()=>{
      const getUserMetadata = async () => {
          let raw = window.sessionStorage.getItem("metadata");
          if (raw != null) {
            setUserMetadata(JSON.parse(raw));
            fetchServerData();
          }else{
              try {
                  const accessToken = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                    scope: "read:current_user read:users_app_metadata read:user_metadata",
                  });
            
                  const userDetailsByIdUrl = `${process.env.REACT_APP_AUTH0_AUDIENCE}users/${user?.sub}`;
            
                  const metadataResponse = await fetch(userDetailsByIdUrl, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  });
                  const all = await metadataResponse.json();
                  window.sessionStorage.setItem("metadata",JSON.stringify({app_metadata: all.app_metadata, user_metadata: all.user_metadata} as any));
                  setUserMetadata(all);
                  fetchServerData();
                } catch (e) {
                  setContentLoading(false);
                  console.log(e.message);
                }
          }
        };
        getUserMetadata();
  },[]);

    if (!content_loading) {
        if (isAuthenticated && (userMetadata as any)?.app_metadata?.minecraft_auth) {
            return (
                <div id="minecraft-server">
                    <aside id="server-status">
                      <h3 className={`status ${server_info?.online ? "online" : "offline"}`}>Status:</h3>
                      <span>Server Ip: <code>{server_info?.host ?? "None"}</code></span>
                    </aside>
                    <div id="controls">
                        <h1>Minecraft Server Dashboard</h1>
                        <h4>Click to {server_info.online ? "stop" : "start"} Server</h4>
                        <div>
                          <Button onClick={()=>handle_button()} type={status.color} size="large" loading={status.loading}>{status.text}</Button>
                        </div>
                    </div>
                    <div id="player-list">
                      <h3>Players Online</h3>
                      <hr/>
                      <p>{server_info.player_count}/{server_info.max_players}</p>
                      <div>
                        <CardGroup columns={1} height={100}>
                            {server_info?.players.map(v=>{
                              //@ts-ignore
                              return <CardGroup.Item key={v.id}>{PlayerItem(v)}</CardGroup.Item>
                            })}
                        </CardGroup>
                      </div>
                    </div>
                </div>
            );
        }else {
            return <Redirect to="/"/>
        }
    }else{
        return <div className="loader">
                <Spin size="54px" name="cube-grid" color="#ff3e00" />
            </div>
    }

}

