import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // We use Basic Auth for the login request itself to authenticate
            // Or we can send a POST body if the backend supports it.
            // Our AuthController expects a JSON body.
            // However, SecurityConfig is set to httpBasic().
            // But we exposed /api/auth/** as permitAll().
            // So we can POST to /api/auth/login without Basic Auth header,
            // and the controller will check credentials using AuthenticationManager.
            
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            // If successful, we are logged in.
            // Since we are using session-based auth (default Spring Security behavior after successful auth),
            // the browser will store the JSESSIONID cookie.
            // We need to make sure axios sends credentials (cookies) in subsequent requests.
            
            login(response.data);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Invalid username or password');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;
