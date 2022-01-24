import React, { useContext } from "react";
import { useAuth } from './contexts/AuthContext';

export function SignUp(props) {

    const context = useAuth();
    console.log(context);

    return(
        "this is the sign up component"
    )
}