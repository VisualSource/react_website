import { useEffect, useState, useRef } from 'react';
import {Toaster, toast } from 'react-hot-toast';
import {SpinnerWrapper} from '../../../components/Spinner';
import ErrorPage from '../../errors/ErrorPage';

import { Card, Button, Form, Image, Col, ListGroup } from 'react-bootstrap';
import { useMetadata } from '../../../api/useMetadata';

function AdminResouceCard({ name, id, description, state, type, icon, required, links, editId, deleteCard }: any) {
    return (
    <Card className="bg-dark text-white mb-3">
        <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
                <p>ID: {id}</p>
                <p>Description: {description}</p>
                <p>State: {state}</p>
                <p>Type: {type} </p>
                <p>Icon: {icon ?? "null"}</p>
                <p>Required</p>
                <ul>
                    {required.map((value: number)=>{
                        return <li key={value}>{value}</li>
                    })}
                </ul>
                <p>Links</p>
                <ul>
                    {links.map((value: any)=>{
                        return <li key={value.name}>{value.name} | {value.link}</li>
                    })}
                </ul>
            </Card.Text>
        </Card.Body>
        <Card.Footer>
            <Button className="me-2" variant="warning" onClick={()=>editId(id)}>Edit</Button>
            <Button variant="danger" onClick={()=>deleteCard(id)}>Delete</Button>
        </Card.Footer>
    </Card>
    );
}

export default function AdminPage(){
    const [loading,setLoading] = useState(true);
    const [editing,setEditing] = useState<any>({ name: "", icon: null, description: "", state: "admited", type: "datapack", links: [], required: []  });
    const [resources,setResources] = useState<any[]>([]);
    const [editId,setEditId] = useState<null | number>(null);
    const [submitState,setSubmitState] = useState("new");
    const requiredElementInt = useRef<HTMLInputElement | null>(null);
    const LinkNameRef = useRef<HTMLInputElement | null>(null);
    const LinkPath = useRef<HTMLInputElement | null>(null);
    const auth = useMetadata();

    const init = async()=> {
        try {
            const raw = await fetch(`${process.env.REACT_APP_API}minecraft/all`);

            const content = await raw.json();

            setResources(content);
            setLoading(false);

        } catch (error) {
            console.error(error);
        }
    }

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_API}minecraft/resource${submitState === "new" ? "" : `/update/${editId}`}`,{
                method: submitState === "new" ? "POST" : "PATCH",
                headers: {
                    "Authorization": `Bearer ${await auth.getAccessTokenSilently()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editing)
            });

            if(res.ok) {
                await init();
                toast.success(submitState === "new" ? "Created new resource" : "Resource updated");
            } 
        } catch (error) {
            console.error(error);
            toast.error(submitState === "new" ? "Failed to create" : "Failed to update");
        }
    }

    const deleteResource =  async (id: number) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API}minecraft/resource/${id}`,{
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${await auth.getAccessTokenSilently()}`
                }
            });
            if(res.ok) {
                await init();
                toast.success("Deleted Resource")
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete resource");
        }
    }

    useEffect(()=>{
        if(!editId || !resources){
            setEditing({ name: "", icon: "https://media.forgecdn.net/avatars/377/691/637555914455642734.png", description: "", state: "admited", type: "datapack", links: [], required: []  });
            return;
        };

        const resource = resources.find((value)=> value.id === editId);

        if(!resource) return;
        
        setEditing(resource);
        setSubmitState("edit");

    },[editId]);

    useEffect(()=>{
        init();
    },[auth.isLoading]);

    if(loading || auth.isLoading || auth.loading) return ( <SpinnerWrapper/> );    
    if(!auth.isAuthenticated || auth.appdata?.minecraft !== "server_admin") return ( <ErrorPage error={401}/> );

    return (
        <div id="vs-server-resouces-admin">
            <Toaster position="bottom-right"/>
            <div id="content-view">
                {resources.map((value,i)=>{
                    return <AdminResouceCard deleteCard={deleteResource} editId={setEditId} {...value} key={i}/>
                })}
            </div>
            <div id="editing-view">
                    <Form onSubmit={submit} data-type={submitState}>
                        <Form.Group className="mb-3" controlId="resource.name">
                            <Form.Label className="text-white">Name</Form.Label>
                            <Form.Control onChange={(event)=>{
                                setEditing({
                                    ...editing,
                                    name: event.target.value
                                });
                            }} value={editing?.name ?? ""} className='bg-dark border-dark text-white' type="text" placeholder="resource name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="resource.description">
                            <Form.Label className="text-white">Description</Form.Label>
                            <Form.Control onChange={(event)=>{
                                setEditing({
                                    ...editing,
                                    description: event.target.value
                                });
                            }} value={editing?.description ?? ""} className='bg-dark border-dark text-white' as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group id="vs-resource-icon" className="mb-3" controlId='resource.icon'>
                            <Image alt="preview" src={editing?.icon ?? "https://media.forgecdn.net/avatars/377/691/637555914455642734.png"} rounded/>
                            <div>
                                <Form.Label className="text-white">Icon url</Form.Label>
                                <Form.Control onChange={(event)=>{
                                    setEditing({
                                        ...editing,
                                        icon: event.target.value
                                    });
                                }} value={editing?.icon ?? ""} className='bg-dark border-dark text-white' type="url" placeholder="Icon url"/>
                            </div>
                        </Form.Group>

                        <Form.Group as={Col} controlId="resource.state" className='mb-2'>
                            <Form.Label className="text-white">State</Form.Label>
                            <Form.Select onChange={(event)=>{
                                setEditing({
                                    ...editing,
                                    state: (event.target as HTMLSelectElement).value
                                });
                            }} value={editing?.state ?? "admited"} className='bg-dark border-dark text-white'>
                                <option value="admited">Admited</option>
                                <option value="active">Active</option>
                                <option value="removed">Removed</option>
                                <option value="rejected">Rejected</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="resource.type" className='mb-2'>
                            <Form.Label className="text-white">Type</Form.Label>
                            <Form.Select onChange={(event)=>{
                                setEditing({
                                    ...editing,
                                    type: (event.target as HTMLSelectElement).value
                                });
                            }} value={editing?.type ?? "datapack"} className='bg-dark border-dark text-white'>
                                <option value="datapack">Datapack</option>
                                <option value="plugin">Plugin</option>
                                <option value="mod">Mod</option>
                                <option value="resoucepack">Resouce pack</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group id="vs-resouce-required" className='mb-2'>
                            <Form.Label className="text-white">Required Resouce</Form.Label>
                            <div className='mb-3'>
                                <Form.Control ref={requiredElementInt} className='bg-dark border-dark text-white me-2' type="number" placeholder="required item id"/>
                                <Button variant="success" onClick={()=>{
                                    if(!requiredElementInt.current) return;

                                    const value = requiredElementInt.current.valueAsNumber;

                                    if(!value) return; 
                                    setEditing({
                                        ...editing,
                                        required: editing.required.concat([value])
                                    });

                                    requiredElementInt.current.value = "";
                                    
                                }}>Add</Button>
                            </div>
                            <ListGroup className="resource-item-list">
                                {(editing?.required ?? []).map((value: number, key: number)=>{
                                    return (
                                        <ListGroup.Item key={key} className="bg-dark text-white vs-required-item">
                                            <span>REQUIRED ITEM ID: {value}</span>
                                            <Button variant='danger' onClick={()=>{
                                                setEditing({
                                                    ...editing,
                                                    required: editing.required.filter((i: number)=> i !== value)
                                                });
                                            }}>Remove</Button>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Form.Group>

                        <Form.Group className='mb-2'>
                            <Form.Label className="text-white">Links</Form.Label>
                            <div className='mb-3' id="vs-resource-link">
                                <Form.Control ref={LinkNameRef} className='bg-dark border-dark text-white me-2' type="text" placeholder="Display text"/>
                                <Form.Control ref={LinkPath} className='bg-dark border-dark text-white me-2' type="url" placeholder="Link url"/>
                                <Button variant="success" onClick={()=>{
                                    if(!LinkNameRef.current || !LinkPath.current) return;
                                    const valueName = LinkNameRef.current.value;
                                    const valueLink = LinkPath.current.value;

                                    if(!(valueName.length > 0) || !(valueLink.length > 0)) return;

                                    setEditing({
                                        ...editing,
                                        links: editing.links.concat([{ name: valueName, link: valueLink }])
                                    });

                                    LinkPath.current.value = "";
                                    LinkNameRef.current.value = "";

                                }}>Add</Button>
                            </div>
                            <ListGroup className="resource-item-list">
                                {(editing?.links ?? []).map((value: any, i: number)=>{
                                    return (
                                        <ListGroup.Item key={i} className="bg-dark text-white vs-required-item">
                                            <span>
                                                {value.name} | <a href={value.link}>{value.link}</a> 
                                            </span>
                                            <Button variant='danger' onClick={()=>{
                                                setEditing({
                                                    ...editing,
                                                    links: editing.links.filter((i: {link: string, name: string })=> (i.link !== value.link) && (i.name !== value.name) )
                                                });
                                            }}>Remove</Button>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Form.Group>
                        <Button className="me-2" variant="secondary" onClick={()=>{
                            setSubmitState("new");
                            setEditId(null);
                        }}>New</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Form>
            </div>
        </div>
    );

} 