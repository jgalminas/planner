import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';

export function Login(props) {

    const authContext = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function login(e) {
        e.preventDefault();

        authContext.login(email, password)
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
        }
    }

    function validateEmail() {
        // to do
    }
    
    return(
        <div className="flex col w-100 credentials-form">
            <form onSubmit={login} className="flex col gap-10 w-250" action="">
                {(error !== '') ? <p className="red"> {error} </p> : null}

                <label className="sign-label" htmlFor="email"> Email </label>
                <input value={email} onChange={handleChange} className="sign-input" required type="text" name="email"></input>
                <label className="sign-label" htmlFor="password"> Password </label>
                <input value={password} onChange={handleChange} className="sign-input" required type="password" name="password"></input>

                <input className="sign-button pointer" disabled={loading} type="submit" value="Log In"/>
                <p> Already have an account? <a className="a-blue" href="/login"> Log In! </a> </p>
            </form>
        </div>
    )
}