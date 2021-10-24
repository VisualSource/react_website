import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {InputGroup, Button, FormControl, Form, DropdownButton, Dropdown, Card} from 'react-bootstrap';
import Spinner from '../../components/Spinner';

type ResourceType = "datapacks" | "mods" | "plugins" | "resourcepacks" | "all";
type ResourceState = "active" | "admited" | "rejected" | "all";

interface IDataCard {
    id: number;
    name: string;
    description: string;
    icon: string | null;
    state: "admited" | "rejected" | "active",
    links: { link: string, name: string }[]
    type: "datapack" | "mod" | "plugin" | "resourcepack";
    added: string;
    required: number[]
}

const validSerachType = ["plugins","datapacks","mods","resourcepacks","all"];
const validSerachState = ["active","admited","rejected","all"];

const typeMap = {
    "plugins" : "plugin",
    "datapacks" : "datapack",
    "mods" : "mod",
    "resourcepacks" : "resourcepack"
}

const typeColor = {
    "datapack": "text-indigo",
    "mod": "text-cyan",
    "plugin": "text-purple",
    "resourcepack": "text-red"
}

const stateColor = {
    "admited": "text-warning",
    "rejected": "text-danger",
    "active": "text-success"
}

let old: IDataCard[] = [];

let complieteData: IDataCard[] = [];

export default function ServerResources(){
    const location = useLocation();
    const history = useHistory();
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
        history.push(`/server/resources?type=${type}&state=${state}`);
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

            <div id="vs-search">
                <Form onSubmit={submit}>
                    <InputGroup className="mb-3">
                            <FormControl
                                placeholder="search"
                                aria-label="search"
                                aria-describedby="search box"
                                name="name"
                            />
                            <Button type="submit" variant="secondary" id="button-addon2">
                                Search
                            </Button>
                    </InputGroup>
                    <InputGroup id="vs-search-params">
                        <div className="vs-serach-param">
                            <DropdownButton menuVariant="dark"
                                variant="secondary"
                                title="Search Type"
                                id="input-group-dropdown-3"
                                >
                                <Dropdown.Item onClick={()=>setQuery("all",searchState)}>All</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery("mods",searchState)}>Mods</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery("plugins",searchState)}>Plugins</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery("datapacks",searchState)}>Datapacks</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery("resourcepacks",searchState)}>Resource Packs</Dropdown.Item>
                            </DropdownButton>
                            <FormControl readOnly value={searchType.toUpperCase()}/>
                        </div>
                        <div className="vs-serach-param">
                            <DropdownButton
                                variant="secondary"
                                title="Search State"
                                id="input-group-dropdown-3"
                                menuVariant="dark"
                                >
                                <Dropdown.Item onClick={()=>setQuery(searchType,"all")}>All</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery(searchType,"active")}>Active</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery(searchType,"admited")}>Admited</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery(searchType,"rejected")}>Rejected</Dropdown.Item>
                            </DropdownButton>
                            <FormControl readOnly value={searchState.toUpperCase()}/>
                        </div>
                    
                    </InputGroup>
                </Form>
            </div>

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
                                            <Card id={`${resouce.id}-${encodeURI(resouce.name)}`} key={resouce.id} bg="dark" text="light">
                                                <Card.Header>
                                                    {resouce.name}
                                                </Card.Header>
                                                <Card.Body>
                                                    <Card.Text>
                                                        {resouce.description}
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card.Footer className="text-muted">
                                                    Type: <span className={typeColor[resouce.type]}>{resouce.type}</span>
                                                    <br/>
                                                    State: <span className={stateColor[resouce.state]}>{resouce.state} </span>
                                                    <div className="vs-card-links">
                                                        {resouce.links.map((link,key)=>{
                                                            return (
                                                                <a href={link.link}>
                                                                    <img src={`https://img.shields.io/badge/Link-${encodeURI(link.name)}-blue?style=flat-square&cacheSeconds=31536000`} alt="external link" />
                                                                </a>
                                                            );
                                                        })}
                                                        {resouce.required.map((required,key)=>{
                                                            const requiredPack = complieteData.find(({id}) => id === required);
                                                            return (
                                                                <a href={`#${requiredPack?.id ?? 0}-${encodeURI(requiredPack?.name ?? "")}`}>
                                                                    <img src={`https://img.shields.io/badge/Required-${encodeURI(requiredPack?.name ?? "Required Item")}-red?style=flat-square&cacheSeconds=31536000`} alt="required item link" />
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </Card.Footer>
                                            </Card>
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