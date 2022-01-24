import React, { useContext } from "react";
import { useAuth } from './contexts/AuthContext';

export function SignUp(props) {

    const authContext = useAuth();

    function signUp(e) {
        e.preventDefault();


    }

    return(
        <div>
            <form action="">
                <label htmlFor="email"> Email </label>
                <input type="email" name="email"></input>
                <label htmlFor="password"> Password </label>
                <input type="password" name="password"></input>
                <label htmlFor="repeatPassword"> Repeat Password </label>
                <input type="password" name="repeatPassword"></input>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}