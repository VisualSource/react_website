import {InputGroup, Button, FormControl, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import {ResourceState,ResourceType} from "./ServerResouceTypes";
import {Link} from 'react-router-dom';
import { useMetadata } from '../../../api/useMetadata';

interface IResourceSerachProps {
    submit: (event: React.FormEvent<HTMLFormElement>) => void;
    setQuery: (type: ResourceType, state: ResourceState) => void;
    searchType: ResourceType;
    searchState: ResourceState;
}


export default function ResourceSearch({ submit, searchState, searchType, setQuery }: IResourceSerachProps){
    const auth = useMetadata();
    return (
        <div id="vs-search">
            <Form onSubmit={submit}>
                <InputGroup className="mb-3">
                    <FormControl placeholder="search" aria-label="search" aria-describedby="search box" name="name"/>
                    <Button type="submit" variant="success" id="button-addon2">
                        Search
                    </Button>
                </InputGroup>
                <InputGroup id="vs-search-params">
                    <div className="vs-serach-param">
                        <DropdownButton menuVariant="dark"
                                        variant="secondary"
                                        title="Type"
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
                                title="State"
                                id="input-group-dropdown-3"
                                menuVariant="dark"
                                >
                                <Dropdown.Item onClick={()=>setQuery(searchType,"all")}>All</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery(searchType,"active")}>Active</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery(searchType,"admited")}>Admited</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery(searchType,"rejected")}>Rejected</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setQuery(searchType,"removed")}>Removed</Dropdown.Item>
                            </DropdownButton>
                            <FormControl readOnly value={searchState.toUpperCase()}/>
                            {
                               auth.appdata?.minecraft === "server_admin" ? <Link  className="btn btn-warning" to="/server/resources/admin">Edit</Link> : null
                            }
                        </div>
                    
                    </InputGroup>
                </Form>
            </div>
    );
}