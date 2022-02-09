import { useAuth0 } from '@auth0/auth0-react';
import { Toaster, toast } from 'react-hot-toast';
import { Button, Form, Container } from 'react-bootstrap';
import { SpinnerWrapper } from '../../components/Spinner';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';


export default function BugReport(){
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
    const [ isSubmited, setSubmited ] = useState<boolean>(false);
   
    const submit =  async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!user) {
            toast.error("Unauthencated");
            return;
        }

        setSubmited(true);

        const issues: any = {
            sub: user.sub
        };

        const data = new FormData(event.currentTarget);

        for(const [key,value] of data) {
            issues[key] = value;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API}report`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${await getAccessTokenSilently()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(issues)
            });

            if(res.status === 202) {
                toast.success("Issuse has been submited");
                return;
            }

            toast.error(res.statusText);
        } catch (error) {
            console.error(error);
            toast.error("A error has happened!");
        }
    }

    if(isLoading) return (<SpinnerWrapper/>);
    if(!isAuthenticated) navigate("/signin");

    if(isSubmited) return (
        <div id="vs-report">
            <Toaster position="bottom-right"/>
            <Container id="submited">
                <h1 className="text-light">Issue submited</h1>
                <div>
                    <Button variant="secondary" onClick={()=>setSubmited(false)}>New issue</Button>
                </div>
            </Container>
        </div>
    );


    return (
        <div id="vs-report">
            <Toaster position="bottom-right"/>
            <Container>
                <h1 className="text-light">Submit a issue</h1>
                <Form onSubmit={submit}>
                    <Form.Group className="mb-3" controlId="app.product">
                        <Form.Label className="text-light">Product</Form.Label>
                        <Form.Select name="product" aria-label="Product" className="bg-dark text-light border-dark" required>
                            <option value="VisualSource Website">VisualSource Website</option>
                            <option value="Rusty Minecraft Launcher">Rusty Minecraft Launcher</option>
                            <option value="PolytopiaJS">PolytopiaJS</option>
                            <option value="2048">2048</option>
                            <option value="Panio Tiles">Panio Tiles</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="app.product_version">
                        <Form.Label className="text-light">Product version</Form.Label>
                        <Form.Control title="1.1.1, or 1.1.1-beta" name="product_version" type="text" placeholder="1.0.0" pattern='^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$'  required className="bg-dark text-light border-dark"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="app.browser">
                        <Form.Label className="text-light">Browser</Form.Label>
                        <Form.Select name="browser" aria-label="browser" className="bg-dark text-light border-dark" required>
                            <option value="Chrome Desktop">Chrome/Edge</option>
                            <option value="Firefox IOS">Firefox</option>
                            <option value="Safari">Safari</option>
                            <option value="Other" disabled>Place other browsers type in notes</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="app.os">
                        <Form.Label className="text-light">OS</Form.Label>
                        <Form.Select name="os" aria-label="OS" className="bg-dark text-light border-dark" required>
                            <option value="Chrome Desktop">Windows</option>
                            <option value="Chrome Android">MaxOS</option>
                            <option value="Chrome IOS">IOS</option>
                            <option value="Firefox Desktop">Android</option>
                            <option value="Firefox Android">Linux Ubuntu</option>
                            <option value="Other" disabled>Place other os version in notes</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="app.title">
                        <Form.Label className="text-light">Issues Title</Form.Label>
                        <Form.Control name="title" type="text" required className="bg-dark text-light border-dark"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="app.description">
                        <Form.Label className="text-light">Issuse description</Form.Label>
                        <Form.Control name="description" as="textarea" rows={3} required className="bg-dark text-light border-dark"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="app.notes">
                        <Form.Label className="text-light">Other notes</Form.Label>
                        <Form.Control name="notes" as="textarea" rows={3} className="bg-dark text-light border-dark"/>
                    </Form.Group>
                    <Button type="submit" variant="success">Submit</Button>
                </Form>
            </Container>
        </div>
    );
}