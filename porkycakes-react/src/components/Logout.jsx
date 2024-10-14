import React from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { NavLink } from '../utils';

const Logout = () => {
    const keycloakLogoutUrl = `${process.env.REACT_APP_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?client_id=${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}&post_logout_redirect_uri=${process.env.REACT_APP_KEYCLOAK_LOGOUT_REDIRECT_URL}`;

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    };

    return <NavLink className="nav-link" to={keycloakLogoutUrl} onClick={handleLogout}>
        Logout
    </NavLink>
}

export default Logout;
