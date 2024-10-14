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
