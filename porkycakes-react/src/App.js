import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { setUser } from './redux/userSlice';

import { Spinner } from "react-bootstrap";

import Header from "./components/Header";
import Login from "./components/Login";
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import UploadUpdateProduct from './components/UploadUpdateProduct';

import { decodeToken } from './utils';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const idToken = localStorage.getItem('id_token');

    if (accessToken) {
      const decoded = decodeToken(accessToken);
      const name = decoded.name;
      const email = decoded.email;
      const pcRoles = decoded.pc_roles;

      dispatch(setUser({ name, email, pcRoles, accessToken, idToken }));
    }

    setLoading(false);
  }, [dispatch]);
  
  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Router>
      <Header />
      <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/upload" element={<UploadUpdateProduct />} />
      </Routes>
  </Router>
  );
}

export default App;
