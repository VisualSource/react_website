import { Form, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

export default function EditProfile() {
    const { isAuthenticated, user } = useAuth0();

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        console.log(data.getAll("name"));
    }

    if(!isAuthenticated) {
        return (
            <Redirect to="/"/>
        );
    }

    return (
        <div id="account-edit">
            <Form onSubmit={submit}>
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
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}