import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

export function SignUp() {

    const authContext = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    function signUp(e) {
        e.preventDefault();
        setLoading(true);

        authContext.signUp(email, password)
        .then(() => {
            setLoading(false);
            navigate('/');
        })
        .catch(() => {
            setLoading(false);
            setError("Could not sign up, please try again..")
        }
        )
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

    function validateEmail() {
        // to do
    }

    function validatePassword() {
        // to do
    }

    return(
        <div className="flex col w-100 credentials-form">
            <form onSubmit={signUp} className="flex col gap-10 w-250">

                {(error !== '') ? <p className="red"> {error} </p> : null}

                <label className="sign-label" htmlFor="email"> Email </label>
                <input value={email} onChange={handleChange} className="sign-input" required type="text" name="email"></input>
                <label className="sign-label" htmlFor="password"> Password </label>
                <input value={password} onChange={handleChange} className="sign-input" required type="password" name="password"></input>
                <label className="sign-label" htmlFor="repeatPassword"> Repeat Password </label>
                <input value={repeatPassword} onChange={handleChange} className="sign-input" required type="password" name="repeatPassword"></input>

                <input className="sign-button pointer" disabled={loading} type="submit" value="Sign Up"/>
                <p> Already have an account? <a className="a-blue" href="/login"> Log In! </a> </p>
            </form>
        </div>
    )
}