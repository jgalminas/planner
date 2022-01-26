import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';

export function Login(props) {

    const authContext = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    function login(e) {
        
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
        }
    }

    function validateEmail() {
        // to do
    }
    
    return(
        <div className="flex col w-100 credentials-form">
            <form onSubmit={login} className="flex col gap-10 w-250" action="">
                <label className="sign-label" htmlFor="email"> Email </label>
                <input value={email} onChange={handleChange} className="sign-input" required type="email" name="email"></input>
                <label className="sign-label" htmlFor="password"> Password </label>
                <input value={password} onChange={handleChange} className="sign-input" required type="password" name="password"></input>
                <input className="sign-button pointer" type="submit" value="Log In"/>
                <p> Haven't got an account? <a className="a-blue" href="/signup"> Sign up! </a> </p>
            </form>
        </div>
    )
}