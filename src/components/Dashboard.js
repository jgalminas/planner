import { Sidebar } from './Sidebar';
import { Board } from './Board';

import { Route, Routes, useLocation} from 'react-router';

import React, { useState, useEffect, useRef } from 'react';

import { collection, onSnapshot, addDoc, where, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './contexts/AuthContext';

export function Dashboard() {

    const { state } = useLocation();
    const [data, setData] = useState([]);
    const authContext = useAuth();
    const { uid } = authContext.currentUser; 
  
    console.log(uid);

    useEffect(() => {
      populateData();
    }, [])
  
    function populateData() {

    const colRef = collection(db, 'boards');
    const userData = query(colRef, where('user', '==', uid));
      
      onSnapshot(userData, (col) => {
        const boards = col.docs.map((doc) => {
          return {id: doc.id, ...doc.data()}
        })
        setData([...boards]);
      });
  
    }
    
    function createBoard(name) {
        addDoc(collection(db, 'boardData'), {categories: []}).then((doc) => {
        addDoc(collection(db, 'boards'), {name: name, data: doc.id})
    })
  }

    return(
        <>
        <Sidebar data={data} createBoard={createBoard}/>
        {(state !== null) ? <Board board={state}/> : null}
        </>
    )
}