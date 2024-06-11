import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../state/AuthContext';
import NavHeader from "../components/NavHeader";
import { Container, Row, Alert } from 'react-bootstrap';

function RootLayout(){
    const { message, setMessage } = useContext(AuthContext);
    return (    
        <main>
            <NavHeader/>
            <Container fluid className='mt-3'>
                {message && <Row>
                <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                </Row> }
                <Outlet/>
            </Container>  
        </main>
    );
}

export default RootLayout;