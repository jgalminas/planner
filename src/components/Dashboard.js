import { Sidebar } from './Sidebar';
import { Board } from './Board';

import { useLocation} from 'react-router';

import React, { useState, useEffect } from 'react';

import { collection, onSnapshot, addDoc, where, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './contexts/AuthContext';

export function Dashboard() {

    const { state } = useLocation();
    const [data, setData] = useState([]);
    const authContext = useAuth();
    const { uid } = authContext.currentUser; 

    useEffect(() => {
      populateData();
    }, [])
  
    function populateData() {

    const colRef = collection(db, 'boards');
    const userData = query(colRef, where('user', '==', uid));
      
      const unsubscribe = onSnapshot(userData,
        (snapshot) => {
        const boards = snapshot.docs.map((doc) => {
          return {id: doc.id, ...doc.data()}
        })
        setData([...boards]);
      })
  
      return unsubscribe;
    }
    
    function createBoard(name) {
        addDoc(collection(db, 'boardData'), {categories: [], user: uid}).then((doc) => {
          addDoc(collection(db, 'boards'), {name: name, user: uid, data: doc.id})
      })
    }

    return(
        <>
        <Sidebar data={data} createBoard={createBoard}/>
        {(state !== null) ? <Board board={state}/> : null}
        </>
    )
}