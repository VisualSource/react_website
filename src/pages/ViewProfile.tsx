import React, { useEffect, useState } from "react";
import {Spin, Image} from 'shineout';
import {Redirect, useParams} from 'react-router-dom';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorStatus, setError] = useState(false);
    const {sub} = useParams<{sub: string}>();

    useEffect(()=>{
        const getUserMetadata = async () => {
            setLoading(false);
            setUserProfile(null);
            setError(false);
        };
        getUserMetadata();
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
        return <Redirect to="/load-fail"/>
    }else{
        return <div className="loader">
                <Spin size="54px" name="cube-grid" color="#ff3e00" />
            </div>
    }
  }
};

export default UserProfile;