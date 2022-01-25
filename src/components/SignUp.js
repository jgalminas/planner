import React, { useContext } from "react";
import { useAuth } from './contexts/AuthContext';

export function SignUp(props) {

    const authContext = useAuth();

    function signUp(e) {
        e.preventDefault();


    }

    return(
        <div className="flex row w-100 credentials-form">
            <form className="flex col" action="">
                <label htmlFor="email"> Email </label>
                <input type="email" name="email"></input>
                <label htmlFor="password"> Password </label>
                <input type="password" name="password"></input>
                <label htmlFor="repeatPassword"> Repeat Password </label>
                <input type="password" name="repeatPassword"></input>
                <input className="button" type="submit" value="Sign Up"/>
            </form>
        </div>
    )
}