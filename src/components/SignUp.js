import React, { useContext, useState } from "react";
import { useAuth } from './contexts/AuthContext';

export function SignUp(props) {

    const authContext = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    function signUp(e) {
        e.preventDefault();
    }

    function handleChange(e) {
        switch (e.target.name) {
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'repeatPassword':
                setRepeatPassword(e.target.value);
        }
    }

    return(
        <div className="flex row w-100 credentials-form">
            <form onSubmit={signUp} className="flex col gap-10" action="">
                <label className="sign-label" htmlFor="email"> Email </label>
                <input value={email} onChange={handleChange} className="sign-input" required type="email" name="email"></input>
                <label className="sign-label" htmlFor="password"> Password </label>
                <input value={password} onChange={handleChange} className="sign-input" required type="password" name="password"></input>
                <label className="sign-label" htmlFor="repeatPassword"> Repeat Password </label>
                <input value={repeatPassword} onChange={handleChange} className="sign-input" required type="password" name="repeatPassword"></input>
                <input className="sign-button pointer" type="submit" value="Sign Up"/>
            </form>
        </div>
    )
}