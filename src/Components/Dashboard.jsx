// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { Button, Modal, Form, DropdownButton, Dropdown, Card, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Directory = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [routeType, setRouteType] = useState('create'); // default route type
  const [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
    initializeFormData(type);
  };

  const initializeFormData = (type) => {
    switch (type) {
      case 'vehicles':
        setFormData({ type: 'sedan' });
        break;
      case 'inventory':
        setFormData({ type: 'engine' });
        break;
      case 'maintenance':
        setFormData({});
        break;
      default:
        setFormData({});
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRouteTypeChange = (route) => {
    setRouteType(route);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = `${VITE_SERVER_URL}/api/v2/${modalType}`;
    if (routeType === 'getOne' || routeType === 'update' || routeType === 'delete') {
      url += `/${formData.id}`;
    }

    const token = localStorage.getItem('jwtToken');
    const AuthToken = 'Basic ' + token;

    try {
      let response;
      switch (routeType) {
        case 'getAll':
          response = await axios.get(url, {
            headers: {
              authorization: AuthToken
            }
          });
          break;
        case 'getOne':
          response = await axios.get(url, formData, {
            headers: {
              authorization: AuthToken
            }
          });
          break;
        case 'create':
          response = await axios.post(url, formData, {}, {
            headers: {
              authorization: AuthToken
            }
          });
          break;
        case 'update':
          response = await axios.put(url, formData, {}, {
            headers: {
              authorization: AuthToken
            }
          });
          break;
        case 'delete':
          response = await axios.delete(url, {
            headers: {
              authorization: AuthToken
            }
          });
          break;
        default:
          throw new Error('Invalid route type');
      }

      if (response.data.success) {
        setResponseData(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
        alert('Success: ' + response.data.message);
      } else {
        alert('Error: ' + response.data.message);
      }

      handleCloseModal();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <Container>
       <div className="title-container">
    <div className="title">
      <h1>Dashboard</h1>
    </div>
  </div>
    <div className="button-container">
      <Button variant="primary" onClick={() => handleShowModal('vehicles')}>Vehicles</Button>
      <Button variant="primary" onClick={() => handleShowModal('inventory')}>Inventory</Button>
      <Button variant="primary" onClick={() => handleShowModal('maintenance')}>Maintenance</Button>
      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType.charAt(0).toUpperCase() + modalType.slice(1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton id="dropdown-basic-button" title="Select Route Type" onSelect={handleRouteTypeChange}>
            <Dropdown.Item eventKey="getAll">Get All</Dropdown.Item>
            <Dropdown.Item eventKey="getOne">Get One</Dropdown.Item>
            <Dropdown.Item eventKey="create">Create</Dropdown.Item>
            <Dropdown.Item eventKey="update">Update</Dropdown.Item>
            <Dropdown.Item eventKey="delete">Delete</Dropdown.Item>
          </DropdownButton>
          <Form onSubmit={handleSubmit}>
            {['getOne', 'update', 'delete'].includes(routeType) && (
              <Form.Group controlId="formId">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" name="id" onChange={handleChange} />
              </Form.Group>
            )}
            {(routeType === 'create' || routeType === 'update') && modalType === 'vehicles' && (
              <>
                <Form.Group controlId="formMake">
                  <Form.Label>Make</Form.Label>
                  <Form.Control type="text" name="make" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formModel">
                  <Form.Label>Model</Form.Label>
                  <Form.Control type="text" name="model" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control type="number" name="year" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formColor">
                  <Form.Label>Color</Form.Label>
                  <Form.Control type="text" name="color" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control as="select" name="type" onChange={handleChange}>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="motorcycle">Motorcycle</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}
            {(routeType === 'create' || routeType === 'update') && modalType === 'inventory' && (
              <>
                <Form.Group controlId="formType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control as="select" name="type" onChange={handleChange}>
                    <option value="engine">Engine</option>
                    <option value="tire">Tire</option>
                    <option value="brake">Brake</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formBrand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control type="text" name="brand" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formQuantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number" name="quantity" onChange={handleChange} />
                </Form.Group>
              </>
            )}
            {(routeType === 'create' || routeType === 'update') && modalType === 'maintenance' && (
              <>
                <Form.Group controlId="formVehicleId">
                  <Form.Label>Vehicle ID</Form.Label>
                  <Form.Control type="text" name="vehicleId" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formServiceDate">
                  <Form.Label>Service Date</Form.Label>
                  <Form.Control type="date" name="serviceDate" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formCost">
                  <Form.Label>Cost</Form.Label>
                  <Form.Control type="number" name="cost" onChange={handleChange} />
                </Form.Group>
              </>
            )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Row>
        {responseData.map((data, index) => (
          <Col md={4} key={index}>
            <Card className="mb-4">
              <Card.Body>
                {Object.entries(data).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Directory;



// inventory route issue 
