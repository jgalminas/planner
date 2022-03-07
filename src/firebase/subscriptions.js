import { doc, collection, onSnapshot, where, query} from 'firebase/firestore';
import { db } from './firebase';

import { populate as popCurrentBoard } from '../components/slices/currentBoardSlice';
import { populate as popBoardList } from '../components/slices/boardListSlice';

export function subscribeToBoardList(uid, dispatch) {

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

export function subscribeToCurrentBoard(name, dataId, boardId, navigate, dispatch) {

    const unsubscribe = onSnapshot(doc(db, "boardData", dataId), (doc) => {
        dispatch(popCurrentBoard({name: name, dataId: doc.id, boardId: boardId, ...doc.data()}))
    }, () => {
      navigate("/");
    });
    
      return unsubscribe; 

}