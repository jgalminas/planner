import React, { useContext } from "react";
import { useAuth } from './contexts/AuthContext';

export function SignUp(props) {

    const authContext = useAuth();

    function signUp(e) {
        e.preventDefault();


    }

    return(
        <div className="flex row w-100 credentials-form">
            <form className="flex col gap-10" action="">
                <label className="sign-label" htmlFor="email"> Email </label>
                <input className="sign-input" type="email" name="email"></input>
                <label className="sign-label" htmlFor="password"> Password </label>
                <input className="sign-input" type="password" name="password"></input>
                <label className="sign-label" htmlFor="repeatPassword"> Repeat Password </label>
                <input className="sign-input" type="password" name="repeatPassword"></input>
                <input className="sign-button pointer" type="submit" value="Sign Up"/>
            </form>
        </div>
    )
}