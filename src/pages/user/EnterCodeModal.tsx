import {Modal,Button, Form } from 'react-bootstrap';

interface IModal {
    state: boolean;
    closeHandle: () => void;
}

export default function EnterCodeModal({ state,closeHandle}: IModal){
  
    return (
        <Modal show={state} onHide={closeHandle}>
             <Modal.Header closeButton className="bg-dark text-light">
                <Modal.Title>Enter Code</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                <Form>
                    <Form.Control type="text" placeholder="code"></Form.Control>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={closeHandle}>
                Close
            </Button>
            <Button variant="success" onClick={closeHandle}>
                Submit
            </Button>
            </Modal.Footer>
        </Modal>
    );
}