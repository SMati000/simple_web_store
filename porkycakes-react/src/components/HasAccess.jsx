import { useSelector } from "react-redux";

const HasAccess = ({allowedRoles, visible, children }) => {
    const pcRoles = useSelector((state) => state.user.pcRoles);

    const hasAccess = pcRoles.some(role => allowedRoles.includes(role));

    if(hasAccess) {
        return children;
    } else {
        if(visible) {
            return <h1>Lo siento, no tiene acceso a esta página.</h1>;
        }

        return null;
    }
}

export default HasAccess;