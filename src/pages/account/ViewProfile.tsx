import React, { useEffect, useState } from "react";
import {Spin, Image} from 'shineout';
import {Redirect, useParams} from 'react-router-dom';
import CONFIG from '../../config.json';
const UserProfile = () => {
    const [userProfile, setUserProfile] = useState<{name: string, picture: string, sub: string} | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorStatus, setError] = useState(false);
    const {sub} = useParams<{sub: string}>();

    useEffect(()=>{
        const getUser = async () => {
            try {
                const raw = await fetch(`${CONFIG.scipts}/view_profile.php?user=${sub}`);
                const user = await raw.json();
                
                if(!user?.type){
                    setUserProfile(user);
                }else{
                    setError(true);
                }
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        };
        getUser();
    },[]);
  
  if (!loading && !errorStatus ){
      return <div id="user-profile">
                  <div id="info">
                      <h1>{userProfile?.name ?? "UNKNOWN"}</h1>
                      <hr/>
                  </div>
                  <div>
                      <Image src={userProfile?.picture ?? ""} shape="circle" width={250} height={250}/>
                      <hr/>
                      <code>{userProfile?.sub ?? sub}</code>
                  </div>
            </div>
  }else{
    if (errorStatus){
        return <Redirect to="/404"/>
    }else{
        return <div className="loader">
                <Spin size="54px" name="cube-grid" color="#ff3e00" />
            </div>
    }
  }
};

export default UserProfile;