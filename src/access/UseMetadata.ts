import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import CONFIG from '../config.json';

interface Metadata {
    app_metadata: {
        [key: string]: any
    }
    user_metadata: {
        [key: string]: any
    }
}

export default function useMetadata(){
    const [metadata,setMetadata] = useState<Metadata | undefined>(undefined);
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    useEffect(()=>{
        const init = async()=>{
            try {
                let raw = window.sessionStorage.getItem("metadata");
                if(raw !== null){
                    setMetadata(JSON.parse(raw));
                }else{
                    const accessToken = await getAccessTokenSilently({
                        audience: CONFIG.auth.audience,
                        scope: "read:current_user read:users_app_metadata read:user_metadata",
                    });

                    const userDetailsByIdUrl = `${CONFIG.auth.audience}users/${user.sub}`;

                    const metadataResponse = await fetch(userDetailsByIdUrl, {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const all = await metadataResponse.json();

                    window.sessionStorage.setItem("metadata", JSON.stringify({app_metadata: all.app_metadata, user_metadata: all.user_metadata} as any));
                    setMetadata({app_metadata: all.app_metadata, user_metadata: all.user_metadata} as any);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        if(isAuthenticated) init();
    },[isAuthenticated]);

    return metadata;
}
