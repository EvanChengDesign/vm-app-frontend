import React, { useState } from 'react';
import { Button, Modal, Form, DropdownButton, Dropdown, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
const token = localStorage.getItem('jwtToken');

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const AuthToken = 'Basic ' + token;

const Directory = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [routeType, setRouteType] = useState('create'); // default route type
  const [responseData, setResponseData] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = `${VITE_SERVER_URL}/api/v2/${modalType}`;
    if (routeType === 'getOne' || routeType === 'update' || routeType === 'delete') {
      url += `/${formData.id}`;
    }

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
          console.log(url);
          console.log(formData)
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
          response = await axios.delete(url, {}, {
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
    <div>
      <Button variant="primary" onClick={() => handleShowModal('vehicles')}>Vehicles</Button>
      <Button variant="primary" onClick={() => handleShowModal('inventory')}>Inventory</Button>
      <Button variant="primary" onClick={() => handleShowModal('maintenance')}>Maintenance</Button>

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
                    <option value="sedan">sedan</option>
                    <option value="truck">truck</option>
                    <option value="van">van</option>
                    <option value="minivan">minivan</option>
                    <option value="hybrid">hybrid</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}
            {(routeType === 'create' || routeType === 'update') && modalType === 'inventory' && (
              <>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formCost">
                  <Form.Label>Cost</Form.Label>
                  <Form.Control type="number" name="cost" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control as="select" name="type" onChange={handleChange}>
                    <option value="engine">Engine</option>
                    <option value="suspension">Suspension</option>
                    <option value="transmission">Transmission</option>
                    <option value="exterior">Exterior</option>
                    <option value="interior">Interior</option>
                    <option value="wheels/tires/brakes">Wheels/Tires/Brakes</option>
                    <option value="fluids/filters">Fluids/Filters</option>
                    <option value="exhaust">Exhaust</option>
                    <option value="electronics">Electronics</option>
                  </Form.Control>
                </Form.Group>
              </>
            )}
            {(routeType === 'create' || routeType === 'update') && modalType === 'maintenance' && (
              <>
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control type="text" name="type" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" name="description" onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="formMechanicID">
                  <Form.Label>Mechanic ID</Form.Label>
                  <Form.Control type="number" name="mechanicID" onChange={handleChange} />
                </Form.Group>
              </>
            )}
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {responseData.length > 0 && (
        <Row xs={1} md={2} className="g-4 mt-3">
          {responseData.map((item, index) => (
            <Col key={index}>
              <Card>
                <Card.Body>
                  <Card.Title>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} ID: {item.id}</Card.Title>
                  {Object.entries(item).map(([key, value]) => (
                    <Card.Text key={key}>
                      <strong>{key}:</strong> {value}
                    </Card.Text>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Directory;
