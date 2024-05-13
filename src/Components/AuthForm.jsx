// src/components/AuthForm.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signinUser, signupUser } from '../Components/apiService';

function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await signinUser(username, password);
      alert('Login successful');
      console.log('logging token as', data.token);
      localStorage.setItem('jwtToken', data.token);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleSignup = async () => {
    try {
      const data = await signupUser(username, password, role);
      setShowSuccessModal(true);
      localStorage.setItem('jwtToken', data.token);
    } catch (error) {
      alert('Signup failed: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <h2 className="text-center">Login / Signup</h2>
            <Form>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>
              <Form.Group controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="mechanic">Mechanic</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={handleLogin} className="mb-2">
                Login
              </Button>
              <Button variant="secondary" onClick={handleSignup}>
                Signup
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal show={showSuccessModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Signup Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Signup successful! Welcome to the platform.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Go to Dashboard
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AuthForm;
