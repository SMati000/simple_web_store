import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { NavLink, handleKeycloakLogout } from '../utils';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const idToken = useSelector((state) => state.user.idToken);

    const handleLogout = () => {
        handleKeycloakLogout(idToken);
        sessionStorage.removeItem('nonce');

        dispatch(clearUser());
        navigate('/');
    };

    return (
        <NavLink className="nav-link" onClick={handleLogout}>
            Logout
        </NavLink>
    );
}

export default Logout;
