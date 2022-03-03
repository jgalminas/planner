import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import { ErrorMessage } from "./ErrorMessage";

export function Login(props) {

    const authContext = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function login(e) {
        e.preventDefault();

        if (validateInputs() == true) {
            setLoading(true);
            authContext.login(email, password)
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                setLoading(false);
                if (err.message.match("user-not-found")) {
                    setError(["Account doesn't exist."])
                }
                else if (err.message.match("wrong-password")) {
                    setError(["Password incorrect."]);
                }
                else if (err.message.match("too-many-requests")) {
                    setError(["Too many requests.. Try again in a few minutes."])
                }
                else {
                    setError(["Could not log in.. Please try again."])
                }
            }
            )
        }
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

    function validateInputs() {

        const EMAIL_REGEX =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const errors = [];
        setError([]);

        if (!email.match(EMAIL_REGEX)) {
            errors.push("Invalid email.")
        }

        if (errors.length > 0) {
            setError([...errors]);
            return false;
        } else {
            return true;
        }
    }
    
    return(
        <div className="flex col w-100 credentials-form">
            <form onSubmit={login} className="flex col gap-10 w-250" action="">
                <ErrorMessage errors={error}/>
                <label className="sign-label" htmlFor="email"> Email </label>
                <input value={email} onChange={handleChange} className="sign-input" required type="text" name="email"></input>
                <label className="sign-label" htmlFor="password"> Password </label>
                <input value={password} onChange={handleChange} className="sign-input" required type="password" name="password"></input>

                <input className="sign-button pointer" disabled={loading} type="submit" value="Log In"/>
                <p> Haven't got an account? <a href="/signup"> Sign Up! </a> </p>
            </form>
        </div>
    )
}