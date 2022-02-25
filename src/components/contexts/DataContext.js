import React, { useContext } from 'react';
import { doc, collection, onSnapshot, addDoc, where, query, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import { populate as popCurrentBoard } from '../slices/currentBoardSlice';
import { populate as popBoardList } from '../slices/boardListSlice';


const DataContext = React.createContext();

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({children}) {

    const authContext = useAuth();
    const { uid } = authContext.currentUser;
    const navigate = useNavigate();

    const currentBoard = useSelector((state) => state.currentBoard.value);
    const dispatch = useDispatch();

    const value = {
        populateBoardList,
        populateCurrentBoard,
        updateObjective,
        moveObjective
    }

    function populateBoardList() {

        const colRef = collection(db, 'boards');
        const userData = query(colRef, where('user', '==', uid));
          
          const unsubscribe = onSnapshot(userData,
            (snapshot) => {
            const data = snapshot.docs.map((doc) => {
              return {id: doc.id, ...doc.data()}
            })
            dispatch(popBoardList(data))
          })
      
          return unsubscribe;
    }

    function populateCurrentBoard(dataId, name, boardId) {

        const unsubscribe = onSnapshot(doc(db, "boardData", dataId), (doc) => {
          dispatch(popCurrentBoard({name: name, dataId: doc.id, boardId: boardId, ...doc.data()}))
      }, () => {
        navigate("/");
      });
      
        return unsubscribe; 
    }

    function updateObjective(catId, data, newCatId) {

      const categories = [...currentBoard.categories]
      const currentCat = categories.findIndex((cat) => cat.id === catId);

      const objectives = categories[currentCat].objectives;
      const objectiveItem = objectives.findIndex((obj) => obj.id === data.id);

      objectives[objectiveItem] = data;

      function move() {
        const newCat = categories.findIndex((cat) => cat.id === newCatId);
        categories[currentCat].objectives = categories[currentCat].objectives.filter((obj) => obj.id !== data.id);
    
        categories[newCat].objectives.push(data);
      }

      if (catId !== newCatId) {
        move();
      }
      
      updateDoc(doc(db, 'boardData', currentBoard.dataId), { categories });
    }

    function moveObjective(catId, data, newCatId) {

      const categories = [...currentBoard.categories]
      const currentCat = categories.findIndex((cat) => cat.id === catId);

      const newCat = categories.findIndex((cat) => cat.id === newCatId);
      categories[currentCat].objectives = categories[currentCat].objectives.filter((obj) => obj.id !== data.id);
  
      categories[newCat].objectives.push(data);
      
      updateDoc(doc(db, 'boardData', currentBoard.dataId), { categories });
    }
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}