import React, { useState } from "react";
import { useAuth } from './contexts/AuthContext';
import { ErrorMessage } from './ErrorMessage';

export function SignUp() {

    const authContext = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState([]);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    function signUp(e) {
        e.preventDefault();

        if (validateInputs() === true) {
            setLoading(true);
            authContext.signUp(email, password)
            .then(({user}) => {
                authContext.saveUserData(user.uid, user.email, name);
            })
            .catch((err) => {
                setLoading(false);
                if (err.message.match("email-already-in-use")) {
                    setError(["Email already in use."])
                }
                else {
                    setError(["Could not sign up. Please try again.."])
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
            case 'name':
                setName(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'repeatPassword':
                setRepeatPassword(e.target.value);
                break;
            default:
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
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (password.search(/[a-z]/i) < 0) {
            errors.push("Your password must contain at least one letter.");
        }
        if (password.search(/[0-9]/) < 0) {
            errors.push("Your password must contain at least one digit.");
        }
        if (password !== repeatPassword) {
            errors.push("Passwords do not match.");
        }

        if (errors.length > 0) {
            setError([...errors]);
            return false;
        } else {
            return true;
        }
    }

    return(
<div className="sign-page">


    <video className='sign-page__video' autoPlay loop muted>
        <source src='/videos/video_2.webm' type='video/webm'/>
    </video>

    <form onSubmit={signUp} className='sign-page__form'>
        <ErrorMessage errors={error}/>
        <label className="sign-label" htmlFor="email"> Email </label>
        <input value={email} onChange={handleChange} className="sign-input" required type="text" name="email"></input>

        <label className="sign-label" htmlFor="name"> Full Name </label>
        <input value={name} onChange={handleChange} className="sign-input" required type="text" name="name"></input>

        <label className="sign-label" htmlFor="password"> Password </label>
        <input value={password} onChange={handleChange} className="sign-input" required type="password" name="password"></input>

        <label className="sign-label" htmlFor="repeatPassword"> Repeat Password </label>
        <input value={repeatPassword} onChange={handleChange} className="sign-input" required type="password" name="repeatPassword"></input>

        <input className="sign-button pointer" disabled={loading} type="submit" value="Sign Up"/>
        <p> Already have an account? <a href="/login"> Log In! </a> </p>
    </form> 
</div>


    )
}


