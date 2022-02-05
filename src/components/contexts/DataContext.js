import React, { useContext } from 'react';
import { store, useGlobalState } from 'state-pool';
import { doc, collection, onSnapshot, addDoc, where, query, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';

//global states which components subscribe to
store.setState("boardList", []);
store.setState("currentBoard", {});


const DataContext = React.createContext();

export function useData() {
    return useContext(DataContext);
}


export function DataProvider({children}) {

    const authContext = useAuth();
    const { uid } = authContext.currentUser;
    const navigate = useNavigate();

    const [boardList, setBoardList] = useGlobalState("boardList");
    const [currentBoard, setCurrentBoard] = useGlobalState("currentBoard");

    const value = {
        populateBoardList,
        populateCurrentBoard,
        createBoard,
        deleteBoard,
        createCategory,
        deleteCategory,
        createObjective,
        deleteObjective,
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
            setBoardList(data);
          })
      
          return unsubscribe;
    }

    function populateCurrentBoard(dataId, name, boardId) {

        const unsubscribe = onSnapshot(doc(db, "boardData", dataId), (doc) => {
          setCurrentBoard({name: name, dataId: doc.id, boardId: boardId, ...doc.data()});
      }, () => {
        navigate("/");
      });
      
        return unsubscribe; 
    }

    function createBoard(name) {
        addDoc(collection(db, 'boardData'), {categories: [], user: uid}).then((doc) => {
          addDoc(collection(db, 'boards'), {name: name, user: uid, data: doc.id})
      })
    }

    function deleteBoard() {
      deleteDoc(doc(db, 'boardData', currentBoard.dataId)).then(() => {
        deleteDoc(doc(db, 'boards', currentBoard.boardId));
      });
    }

    function createCategory(name) {

      const category = {
        id: uuid(),
        name: name,
        objectives: [],
      };

      updateDoc(doc(db, 'boardData', currentBoard.dataId), { categories: arrayUnion(category) });
    }

    function deleteCategory(catId) {

      const category = currentBoard.categories.find((cat) => cat.id === catId);
      updateDoc(doc(db, 'boardData', currentBoard.dataId), { categories: arrayRemove(category) });

    }

    function createObjective(catId, name) {

      const categories = [...currentBoard.categories];
      const category = currentBoard.categories.find((cat) => cat.id === catId);

      const objective = {
        id: uuid(),
        name: name,
        priority: "Medium",
        progress: "Not Started",
        notes: ""
      }

      category.objectives.push(objective);

      updateDoc(doc(db, 'boardData', currentBoard.dataId), { categories });
    }

    function deleteObjective(objId, catId) {
      const categories = [...currentBoard.categories];
      const category = categories.find((cat) => cat.id === catId);

      category.objectives = category.objectives.filter((obj) => obj.id !== objId);

      updateDoc(doc(db, 'boardData', currentBoard.dataId), { categories });
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