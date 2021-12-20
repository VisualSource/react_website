import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../../components/Spinner';
import ResourceCard from './ResourceCard';
import type {ResourceState,ResourceType} from "./ServerResouceTypes";
import ResourceSearch from './ResourceSearch';

interface IDataCard {
    id: number;
    name: string;
    description: string;
    icon: string | null;
    state: "admited" | "rejected" | "active" | "removed",
    links: { link: string, name: string }[]
    type: "datapack" | "mod" | "plugin" | "resourcepack";
    added: string;
    required: number[]
}

const validSerachType = ["plugins","datapacks","mods","resourcepacks","all"];
const validSerachState = ["active","admited","rejected","all","removed"];

const typeMap = {
    "plugins" : "plugin",
    "datapacks" : "datapack",
    "mods" : "mod",
    "resourcepacks" : "resourcepack"
}

let old: IDataCard[] = [];

let complieteData: IDataCard[] = [];

export default function ServerResources(){
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data,setData] = useState<IDataCard[]>([]);
    const [searchType,setSearchType] = useState<ResourceType>("all");
    const [searchState,setSearchState] = useState<ResourceState>("all");


    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const content = new FormData(event.target as HTMLFormElement);

        const serachName: string = content.get("name") as string;
       
        if(serachName.length <= 0) {
            setData(old);
            return;
        }

        old = data;
        const filtered = data.filter(data=>data.name.toLowerCase().includes(serachName.toLowerCase()));
        setData(filtered);
    }

    const setQuery = (type: ResourceType, state: ResourceState) => {
        navigate(`/server/resources?type=${type}&state=${state}`);
    }

    useEffect(()=>{
        const init = async () => {

            try {
                setLoading(true);
                const serach = new URLSearchParams(location.search);
                const params = serach.get("type");
                const stateSearch = serach.get("state");

                if(params && validSerachType.includes(params)){
                    setSearchType(params as ResourceType);
                   
                } 

                if(stateSearch && validSerachState.includes(stateSearch)){
                    setSearchState(stateSearch as ResourceState);
                } 

                if(complieteData.length <= 0){
                    const raw = await fetch(`${process.env.REACT_APP_API}minecraft/all`);

                    const content = await raw.json();

                    complieteData = content;
                }

                old = complieteData.filter((item)=>{
                    const getState = (): boolean => {
                        if(searchState === "all") return true;
                        return searchState === item.state;
                    }

                    const getType = () : boolean => {
                        if(searchType === "all") return true;
                        return typeMap[searchType] === item.type;
                    }

                    return getType() && getState();
                });

            
                setData(old);
                setLoading(false);
            } catch (error) {
                console.error(error);   
            }
        }
        init();
    },[location.search, searchState, searchType]);

    return (
        <div id="vs-server-resources">  

            <ResourceSearch submit={submit} setQuery={setQuery} searchState={searchState} searchType={searchType} />

            <article>
                {
                    loading ? (
                        <div id="vs-server-spinner">
                            <Spinner/>   
                        </div>
                    ) : (
                        <>
                            {
                                data.length <= 0 ? ( 
                                    <div id="vs-server-no-content">
                                        <h2>No Content to display</h2>
                                    </div>
                                ) : (
                                    data.map((resouce)=>{
                                        return (
                                            <ResourceCard key={resouce.id} {...resouce} complieteData={complieteData} />
                                        );
                                    })
                                )
                            }
                        </>
                    )
                }
            </article>

        </div>
    );
}