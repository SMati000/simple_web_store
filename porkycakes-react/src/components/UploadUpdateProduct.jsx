import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';

import { useSelector } from "react-redux";

import HasAccess from "./HasAccess";

const getProduct = async (productId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`);

    if (!response.ok) {
        throw new Error('Ha ocurrido un error');
    }

    return response.json();
};

const postPatchProduct = async (token, product, productId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products${productId ? `/${productId}` : ''}`, 
        {
            method: productId ? "PATCH" : "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productId ? product : [product])
        }
    );
    
    if (response.status < 200 || response.status >= 300) {
        throw new Error('Ha ocurrido un error');
    }

    return response.json();
}

const UploadUpdateProduct = () => {
    const [productId, setProductId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        stock: '',
        price: 0,
        rating: '',
        image: null,
        description: '',
        minPrevReqDays: '',
    });
  
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.user.accessToken);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const handleUpdate = async (e) => {
            if(productId) {
                try {
                    setFormData(await getProduct(productId));
                } catch (err) {
                    console.log(err.message);
                    setError('Lo sentimos, ha ocurrido un error.');
                    setTimeout(() => setError(''), 3000);
                    return;
                }
            }
        };

        const uri = window.location.search;
        const params = new URLSearchParams(uri);
        const id = params.get('product_id');
        setProductId(id);
        console.log(productId);

        handleUpdate();
    }, [productId]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === 'image' ? `/productos/${e.target.files[0].name}` : value,
      }));
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.name || !formData.price || formData.price === 0) {
            setError('Por favor, establezca un nombre y un precio.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            await postPatchProduct(accessToken, formData, productId);
        } catch (err) {
            console.log(err.message);
            setError('Lo sentimos, ha ocurrido un error.');
            setTimeout(() => setError(''), 3000);
            return;
        }
    
        setError('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        console.log('Form submitted:', formData);

        setFormData({
            name: '',
            category: '',
            stock: '',
            price: 0,
            rating: '',
            image: null,
            description: '',
            minPrevReqDays: '',
        });

        navigate('/');
    };
  
    return (
        <HasAccess allowedRoles={['pc_admin']} visible={true}>
            <Container>
            <br/>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Form submitted successfully!</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Torta con Almendras"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>
                <br/>

                <Form.Group controlId="formDescription">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                    as="textarea"
                    placeholder='Deliciosa torta de Almendras para 4 personas'
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    />
                </Form.Group>
                <br/>
        
                <Row>
                    <Col>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                            as="select"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            >
                            <option value="">Categoría</option>
                            <option value="TORTAS">Tortas</option>
                            <option value="POSTRES">Postres</option>
                            <option value="DULCES">Dulces</option>
                            <option value="SALADOS">Salados</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formImage">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                            />
                            {formData.image && <p>Selected Image: {formData.image.replace("/productos", "")}</p>}
                        </Form.Group>
                    </Col>
                </Row>
                <br/>
        
                <Row>
                    <Col>
                    <Form.Group controlId="formStock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Ingrese su stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        />
                    </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="Ingrese el Precio"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formMinPrevReqDays">
                            <Form.Label>Demora promedio de preparación</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                max={50}
                                placeholder="Cuantos días demora normalmente?"
                                name="minPrevReqDays"
                                value={formData.minPrevReqDays}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formRating">
                            <Form.Label>Valoración</Form.Label>
                            <Form.Control
                                type="number"
                                disabled={true}
                                min={0}
                                max={5}
                                placeholder="Ingrese su valoración"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <br/>
        
                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
        </Container>
      </HasAccess>
    );
}

export default UploadUpdateProduct;
