import { Link } from "react-router-dom";
import styled from "styled-components";

export const decodeToken = (token) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
};

// Styled Component for active nav-link
export const NavLink = styled(Link)`
  &.active {
    border-bottom: 2px solid rgb(240, 248, 255);
  }
`;

export const generateNonce = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 16; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

export const handleKeycloakLogout = (idToken) => {
  const keycloakLogoutUrl = `${process.env.REACT_APP_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`;
  
  try {
    fetch(`${keycloakLogoutUrl}`, 
      {
          method: "POST",
          mode: 'no-cors',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `client_id=${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}&id_token_hint=${idToken}`
      }
    );
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

export const validToken = (token) => {
  const expectedIssuer = process.env.REACT_APP_KEYCLOAK_ISSUER;
  return token?.iss === expectedIssuer && Date.now() <= token?.exp * 1000;
};
