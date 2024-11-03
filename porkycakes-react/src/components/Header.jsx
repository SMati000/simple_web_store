import { Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import logo from "../assets/logo-no-background.png";
import Login from "./Login";
import Logout from "./Logout";
import { NavLink } from '../utils';
import HasAccess from "./HasAccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHomeAlt, faCartShopping, faUpload } from '@fortawesome/free-solid-svg-icons';

// Styled component for logo
const Logo = styled.img`
  width: 100px;
`;

// Styled Component for Nav items
const NavItem = styled.li`
  margin-left: 15px;
`;

function Header() {
  const location = useLocation();

  const pcRoles = useSelector((state) => state.user.pcRoles);

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
                <Login/>
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
                  <FontAwesomeIcon icon={faHomeAlt} size="lg" title='Home' />
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
                    <FontAwesomeIcon icon={faCartShopping} size="lg" title='Carrito' />
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
                    <FontAwesomeIcon icon={faUpload} size="lg" title='Cargar' />
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
