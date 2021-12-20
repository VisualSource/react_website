import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';


export function useMetadata(){
    const [metadata,setMetadata] = useState<any>(null);
    const [appdata,setAppdata] = useState<any>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const auth = useAuth0();


    useEffect(()=>{
        if(auth.isLoading) return;
        if(!auth.isAuthenticated) return;

        const init = async() => {
           try {
                const token = await auth.getAccessTokenSilently();

                const metadataResponse = await fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}users/${encodeURI(auth.user?.sub ?? "")}?fields=app_metadata%2Cuser_metadata&include_fields=true`,{
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });

                const {user_metadata,app_metadata} = await metadataResponse.json();

                setAppdata(app_metadata);
                setMetadata(user_metadata);
                setLoading(false);
           } catch (error) {
               console.error(error);
           }
        }
        init(); 
    },[auth,auth.isAuthenticated,auth.isLoading,auth.user?.sub]);



    return {
        ...auth,
        metadata,
        appdata,
        loading
    };
}