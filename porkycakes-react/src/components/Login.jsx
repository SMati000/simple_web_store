import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, clearUser } from '../redux/userSlice';
import { decodeToken, generateNonce, NavLink, handleKeycloakLogout, validToken } from '../utils';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  var nonce = sessionStorage.getItem('nonce');
  if(nonce == null) {
    nonce = generateNonce();
    sessionStorage.setItem('nonce', nonce);
  }

  const keycloakLoginUrl = `${process.env.REACT_APP_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?client_id=${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}&response_type=id_token%20token&redirect_uri=${process.env.REACT_APP_KEYCLOAK_LOGIN_REDIRECT_URL}&nonce=${nonce}`;

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const recievedNonce = decodeToken(idToken)?.nonce;

    if(recievedNonce !== undefined && sessionStorage.getItem('nonce') !== recievedNonce) {
      alert('Error on login');
      sessionStorage.removeItem('nonce');

      handleKeycloakLogout(idToken);
      dispatch(clearUser());
      navigate('/');

      return;
    }

    if (accessToken) {
      const decoded = decodeToken(accessToken);
      
      if (!validToken(decoded)) {
        handleKeycloakLogout(idToken);
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

  return (
    <div className="d-flex">
      <NavLink className="nav-link" to={keycloakLoginUrl}>
        Login
      </NavLink>
    </div>
  );
};

export default Login;
