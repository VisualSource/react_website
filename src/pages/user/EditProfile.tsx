import { Form, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Link } from 'react-router-dom';
import Particles from "react-tsparticles";
import {config} from '../../api/PartialConfig';

export default function EditProfile() {
    const { isAuthenticated, user } = useAuth0();

    const particlesInit = (main: any) => {};
    const particlesLoaded = (container: any) => {};

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
       // const data = new FormData(event.target as HTMLFormElement);
        
    }

    if(!isAuthenticated) {
        return (
            <Navigate to="/signin" replace/>
        );
    }

    return (
        <div id="account-edit">
            <Link className="btn btn-secondary" to="/account">Back</Link>
            <Particles id="vs-edit-bg" init={particlesInit} loaded={particlesLoaded} options={config}/>
            <Form onSubmit={submit} id="vs-edit-form">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" defaultValue={user?.email}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" name="name" defaultValue={user?.name}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password"/>
                </Form.Group>
                <Button variant="success" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}