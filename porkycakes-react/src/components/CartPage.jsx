import React, { useEffect, useState, useRef } from 'react';

import { Container, Button, Form, Spinner, FormControl, Row, Col } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";

import { useSelector } from "react-redux";

import HasAccess from "./HasAccess";

const getCart = async (email, token) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${email}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if(response.status === 404) {
      return {'user': email, 'productOrders': []};
    }

    throw new Error('Ha ocurrido un error');
  }

  return response.json();
};

const patchCart = async (token, email, orders) => {
  console.log(orders);
  const requestBody = orders.productOrders.map(order => ({
    productId: order.product.id,
    amount: order.amount,
  }));

  if(requestBody.length === 0) {
    return;
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${email}`, 
      {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
      }
  );
  
  if (response.status < 200 || response.status >= 300) {
      throw new Error('Ha ocurrido un error');
  }

  return response.json();
};

const emptyCart = async (token, email) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/${email}`, 
      {
          method: "DELETE",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      }
  );
  
  if (response.status < 200 || response.status >= 300) {
      throw new Error('Ha ocurrido un error');
  }
};

const CartPage = () => {
  const email = useSelector((state) => state.user.email);
  const accessToken = useSelector((state) => state.user.accessToken);

  const [cart, setCart] = useState([]);
  const cartRef = useRef(cart);

  const [loading, setLoading] = useState(true);

  const [shippingMethod, setShippingMethod] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const fetchCart = async () => {
    try {
      const fetchedCart = await getCart(email, accessToken);
      setCart(fetchedCart);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleQuantityChange = (orderId, newQuantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      productOrders: prevCart.productOrders.map((item) => {
        if (item.id === orderId) {
          return { ...item, amount: newQuantity };
        }
        return item;
      }),
    }));
  };

  const handleShippingChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  const handlePlaceOrder = () => {
    if (shippingMethod) {
      emptyCart(accessToken, email);
      setCart({'user': email, 'productOrders': []});
      alert("Order placed successfully!");
    } else {
      alert("Please select a shipping method.");
    }
  };

  const saveCartBeforeLeaving = () => {
    patchCart(accessToken, email, cartRef.current);
  }

  useEffect(() => {
    window.addEventListener('beforeunload', saveCartBeforeLeaving);
    fetchCart();

    return () => {
      saveCartBeforeLeaving();
      window.removeEventListener('beforeunload', saveCartBeforeLeaving);
    };
  }, []);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <HasAccess allowedRoles={['pc_customer']} visible={true}>
      <Container
        className="mt-5 d-flex flex-column align-items-center justify-content-center"
        fluid
      >

        <div className="card p-4">
          <h2 className="mx-auto">Tu Carrito</h2>
          {cart.productOrders.length > 0 ? (
            cart.productOrders.filter(o => o.amount !== 0).map((item) => (
              <Row key={item.id} id={item.id} className="align-items-center mb-3 p-2 border-bottom">
                <Col className="d-flex align-items-center">
                  <img
                    src={`/assets/${item.product.image}`} 
                    alt={item.product.name}
                    className="cart-item-image mx-3"
                    style={{ width: '100px', objectFit: 'cover' }}
                  />
                </Col>

                <Col style={{'minWidth': '200px'}}>
                  <p className="mb-1"><b>{item.product.name}</b></p>
                  <p className="mb-1">Precio: ${item.product.price}</p>
                  <p className="mb-1">Total: ${item.product.price * item.amount}</p>
                </Col>

                <Col className="d-flex align-items-center mx-3">
                  <FormControl
                    type="number"
                    min="1"
                    value={item.amount}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    style={{ width: '60px', textAlign: 'center' }}
                  />
                </Col>
                
                <Col>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleQuantityChange(item.id, 0)}
                >
                  Eliminar
                </button>
                </Col>
              </Row>
            ))
          ) : (
            <p>Tu carrito está vacío.</p>
          )}

          <div className='text-center'>
            <h3 className="text-center mt-4">Total: ${cart.productOrders.reduce((sum, item) => sum + item.product.price*item.amount, 0)}</h3>
            <i>No incluye el envío.</i>
          </div>
        </div>

        <Form.Group className="mt-4 w-50">
          <Form.Label>Seleccione el Método de Envío</Form.Label>
          <Form.Control
            as="select"
            value={shippingMethod}
            onChange={handleShippingChange}
          >
            <option value="">Seleccione...</option>
            <option value="standard">Envío Estándar - $5.000</option>
            <option value="express">Envío Express - $10.000</option>
          </Form.Control>
        </Form.Group>

        <Button
          variant="link"
          className="mt-3 d-flex align-items-center"
          onClick={handleHelpClick}
        >
          <FaQuestionCircle className="me-2" /> ¿Necesita ayuda con el Envío?
        </Button>
        {showHelp && (
          <div className="alert alert-info mt-2 w-50">
            <p>
              <strong>Envío Estándar:</strong> Demora entre 5 y 7 días hábiles
            </p>
            <p>
              <strong>Envío Express:</strong> Demora entre 1 y 2 días hábiles.
            </p>
          </div>
        )}

        <Button
          className="bg-success mt-4"
          onClick={handlePlaceOrder}
          disabled={cart.length === 0}
        >
          Comprar
        </Button>
        <br/>
      </Container>
    </HasAccess>
  );
};

export default CartPage;
