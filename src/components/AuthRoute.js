import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export function AuthRoute({children}) {

    const { currentUser } = useAuth();

    return currentUser ? children : <Navigate to="/login"/>
}

export function InaccessibleWhenAuthedRoute({children}) {

    const { currentUser } = useAuth();

    return !currentUser ? children : <Navigate to="/"/>

}