import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

/**
 * React Router Route Wrapper which is only accesible by authenticated users.
 *
 * @param {children} children The children that will be rendered when accessing the route.
 */
export function AuthRoute({children}) {

    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/login"/>
}

/**
 * React Router Route Wrapper which is inaccesible by authenticated users.
 * Authenticated users will be re-directed.
 *
 * @param {children} children The children that will be rendered when accessing the route.
 */
export function InaccessibleWhenAuthedRoute({children}) {

    const { currentUser } = useAuth();

    return !currentUser ? children : <Navigate to="/"/>

}