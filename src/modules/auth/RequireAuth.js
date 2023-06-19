import { useLocation, Navigate, Outlet } from "react-router-dom";
import {useSelector} from "react-redux";

const RequireAuth = ({ allowedRoles }) => {
    const isLogged = useSelector((state) => state.auth.isLogged);
    const userRoles = useSelector((state) => state.auth.roles);
    const location = useLocation();

    return (
        userRoles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : isLogged
                ? <Navigate to="error/401" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
