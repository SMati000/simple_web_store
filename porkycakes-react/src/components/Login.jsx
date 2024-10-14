import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, clearUser } from '../redux/userSlice';
import { decodeToken } from '../utils';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');

    if (accessToken) {
      const decoded = decodeToken(accessToken);
      
      // Basic validations on the JWT
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        alert('Token has expired');
        dispatch(clearUser());
        navigate('/');
        return;
      }

      const expectedIssuer = process.env.REACT_APP_KEYCLOAK_ISSUER;
      if (decoded.iss !== expectedIssuer) {
        alert('Invalid token issuer');
        dispatch(clearUser());
        navigate('/');
        return;
      }

      const name = decoded.name;
      const email = decoded.email;
      const pcRoles = decoded.pc_roles;

      dispatch(setUser({ name, email, pcRoles, accessToken, idToken }));

      navigate('/');
    }
  }, [dispatch, navigate]);

  return <div>Loading...</div>; // Show a loading state while processing
};

export default Login;
