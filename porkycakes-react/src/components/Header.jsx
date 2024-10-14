import { Button, Container, Badge } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import logo from "../assets/logo-no-background.png";
import Logout from "./Logout";
import { NavLink } from '../utils';
import HasAccess from "./HasAccess";

// Styled component for logo
const Logo = styled.img`
  width: 100px;
`;

// Styled Component for Nav items
const NavItem = styled.li`
  margin-left: 15px;
`;

function generateNonce(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

function Header() {
  // Get current loaction to determine active nav link
  const location = useLocation();

  // Retrieve cart items from Redux store and calculcate item count
  const cartItems = useSelector((state) => state.cart.items); // Get cart items from Redux store
  const itemCount = cartItems.length; // Calculate the number of items in the cart
  const pcRoles = useSelector((state) => state.user.pcRoles);

  const keycloakLoginUrl = `${process.env.REACT_APP_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?client_id=${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}&response_type=id_token%20token&redirect_uri=${process.env.REACT_APP_KEYCLOAK_LOGIN_REDIRECT_URL}&nonce=${generateNonce()}`;

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark navbar-bg py-3">
        <Container fluid>
          <Button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </Button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="d-flex">
              {pcRoles.length > 0 ? (
                <div className="d-flex">
                  <Logout />
                </div>
              ) : (
                <div className="d-flex">
                  <NavLink className="nav-link" to={keycloakLoginUrl}>
                    Login
                  </NavLink>
                </div>
              )}
            </div>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <NavItem className="nav-item">
                <NavLink
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </NavLink>
              </NavItem>
              <HasAccess allowedRoles={['pc_customer']} visible={false}>
                <NavItem className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      location.pathname === "/cart" ? "active" : ""
                    }`}
                    to="/cart"
                  >
                    Carrito{" "}
                    {itemCount > 0 && (
                      <Badge pill bg="danger">
                        {itemCount}
                      </Badge>
                    )}
                  </NavLink>
                </NavItem>
              </HasAccess>
              <HasAccess allowedRoles={['pc_admin']} visible={false}>
                <NavItem className="nav-item">
                  <NavLink
                    className={`nav-link ${
                      location.pathname === "/upload" ? "active" : ""
                    }`}
                    to="/upload"
                  >
                    Cargar
                  </NavLink>
                </NavItem>
              </HasAccess>
            </ul>
          </div>
          <NavLink className="navbar-brand" to="/" style={{ margin: '0', padding: '0' }}>
            <Logo src={logo} alt="Logo" />
          </NavLink>
        </Container>
      </nav>
    </header>
  );
}

export default Header;
