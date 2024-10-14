import React, { useEffect, useState, useCallback } from 'react';

import { Button, Card, Container, Row, Col, Spinner, Form, Dropdown, Badge } from "react-bootstrap";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';

import UpdateDeleteButtons from "./UpdateDeleteButtons";
import HasAccess from "./HasAccess";

// Styled component for product image
const ProductImg = styled(Card.Img)`
  width: 100%;
  height: 200px;
  object-fit: contain;
  display: block;
`;

// Styled component for product card
const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .card-text {
    height: 110px;
  }
`;

const getProducts = async (searchTerm, dropdownValue) => {
  const params = new URLSearchParams();
  if (searchTerm) params.append('name', searchTerm);
  if (dropdownValue) params.append('category', dropdownValue);

  const response = await fetch(`${process.env.REACT_APP_API_URL}/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Ha ocurrido un error');
  }
  return response.json();
};

const addToCart = async (token, email, productId) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${email}?relative=true`, 
      {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify([{'productId': productId, 'amount': 1}])
      }
  );
  
  if (response.status < 200 || response.status >= 300) {
      throw new Error('Ha ocurrido un error');
  }
}

const renderStars = (rating) => {
  const filledStars = Array.from({ length: rating }, (_, i) => (
    <span key={i} className="text-warning">&#9733;</span> // Filled star
  ));
  const emptyStars = Array.from({ length: 5 - rating }, (_, i) => (
    <span key={i + rating} className="text-muted">&#9734;</span> // Empty star
  ));
  return [...filledStars, ...emptyStars];
};

const ProductPage = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const email = useSelector((state) => state.user.email);
  const username = useSelector((state) => state.user.username);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownValue, setDropdownValue] = useState('');
  const dispatch = useDispatch();

  const fetchProducts = useCallback(async () => {
    try {
      const fetchedProducts = await getProducts(searchTerm, dropdownValue);
      setProducts(fetchedProducts);
      dispatch({ type: 'SET_PRODUCTS', payload: fetchedProducts });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, dropdownValue, dispatch]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
      return <Spinner animation="border" />;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  return (
    <Container
      className="d-flex flex-column justify-content-end mx-auto p-4 my-4"
      fluid
    >
      <Row className="p-2">
        <Col md={9} className="mt-4 mb-0">
          <h1>
          {username ? (
            `Bienvenido, ${username}!`
          ) : (
            "Bienvenido a Porky Cakes!"
          )}
          </h1>
        </Col>
        <Col md={2}>
          <Form.Group controlId="product-search">
            <Form.Label>Buscar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Brownie"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
          </Form.Group>
        </Col>
        <Col md={1}>
          <Form.Group controlId="product-category">
            <Form.Label>Categoría</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                Categoría
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setDropdownValue('')}>---</Dropdown.Item>
                <Dropdown.Item onClick={() => setDropdownValue('Tortas')}>Tortas</Dropdown.Item>
                <Dropdown.Item onClick={() => setDropdownValue('Postres')}>Postres</Dropdown.Item>
                <Dropdown.Item onClick={() => setDropdownValue('Dulces')}>Dulces</Dropdown.Item>
                <Dropdown.Item onClick={() => setDropdownValue('Salados')}>Salados</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {products.map((product) => (
          <Col
            key={product.id}
            id={product.id}
            xs={12}
            sm={12}
            md={6}
            lg={4}
            xxl={3}
            className="pb-4"
          >
            <StyledCard className="card shadow-md p-2 p-md-4 m-2">
              <div className="d-flex mb-2">
                <Badge pill bg="secondary" title="Stock">
                  Stock: {product.stock}
                </Badge>
              </div>
              <ProductImg variant="top" src={`/assets/${product.image}`}
                title="Ilustración del Producto" alt={product.description}/>
              <Card.Body className="d-flex flex-column pb-0">
                <Card.Title>{product.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted fw-bold">
                  Precio: ${product.price}
                </Card.Subtitle>
                <div>
                  Descripción: {product.description}
                </div>
                <div>
                  <i>Demora promedio de preparación: {product.minPrevReqDays} días <FontAwesomeIcon icon={faCircleInfo} title="Aplica cuando no hay stock"/></i>
                </div>
              </Card.Body>
              <HasAccess allowedRoles={['pc_customer']} visible={false}>
                <Card.Footer className="text-center mb-1">
                  <Button
                    variant="primary"
                    className="px-5"
                    onClick={() => addToCart(accessToken, email, product.id)}
                  >
                    Agregar al Carrito
                  </Button>
                </Card.Footer>
              </HasAccess>
              <div className="d-flex justify-content-end">
                {renderStars(product.rating)}
              </div>
              <div className="d-flex justify-content-end mt-2">
                <UpdateDeleteButtons productId={product.id} />
              </div>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductPage;
