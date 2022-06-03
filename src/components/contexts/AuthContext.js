import React, { useState, useEffect, useContext } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
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
        logOut,
        saveUserData
    }

    useEffect(() => {
    
        const unsubscribe = onAuthStateChanged(auth, (user) => {

            if (user) {

                let userData;

                const userRef = doc(db, "users", user.uid);
                getDoc(userRef).then((snap) => {
                    userData = snap.data();
                }).then(() => {
                    setCurrentUser({uid: user.uid, ...userData});
                    setLoading(false);
                })

            } else {
                setCurrentUser(user)
                setLoading(false);
            }

        })

        return unsubscribe;

    }, [])
    
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function saveUserData(uid, email, name) {
        setDoc(doc(db, "users", uid), {
            email: email,
            name: name
            })
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