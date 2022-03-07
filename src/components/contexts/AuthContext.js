import React, { useState, useEffect, useContext } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase.js';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const value = {
        currentUser,
        signUp,
        login,
        logOut
    }

    useEffect(() => {
    
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            if (user) {
                setDoc(doc(db, "users", user.uid), {
                    email: user.email
                  });
            }

            setLoading(false);
        })

        return unsubscribe;

    }, [])
    
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logOut() {
        return signOut(auth);
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}