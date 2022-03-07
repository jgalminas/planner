import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { arrayMove } from '@dnd-kit/sortable'
import { v4 as uuid } from 'uuid';

import { doc, collection, onSnapshot, addDoc, where, query, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const initialState = {
  value: {},
}

export const createBoard = createAsyncThunk(
  'board/createBoard',
  async(args) => {
    const { name, uid } = args;
    try {

      addDoc(collection(db, 'boardData'), {categories: [], user: uid}).then((doc) => {
        addDoc(collection(db, 'boards'), {name: name, user: uid, data: doc.id})
    })

    } catch(err) {
      console.log(err);
    }
  }
)

export const deleteBoard = createAsyncThunk(
  'board/deleteBoard',
  async(args, { getState }) => {

    const state = getState().currentBoard.value;

    try {
      deleteDoc(doc(db, 'boardData', state.dataId)).then(() => {
        deleteDoc(doc(db, 'boards', state.boardId));
      });
    } catch (e) {
      console.log(e);
    }

  }
)

export const renameBoard = createAsyncThunk(
  'board/renameBoard',
  async(args, { getState }) => {

    const state = getState().currentBoard.value;
    const { name } = args;

    try {
      
      updateDoc(doc(db, 'boardData', state.dataId), { name: name });
      updateDoc(doc(db, 'boards', state.boardId), { name: name });

    } catch (e) {
      console.log(e);
    }

  }
)

export const createCategory = createAsyncThunk(
  'board/createCategory',
  async(args, { getState }) => {
    const state = getState().currentBoard.value
    const { name } = args;
    try {
      
      const category = {
        id: uuid(),
        name: name,
        objectives: [],
      };

      updateDoc(doc(db, 'boardData', state.dataId), { categories: arrayUnion(category) });

    } catch (e) {
      console.log(e);
    }

  }
)

export const updateCategories = createAsyncThunk(
  'board/updateCategories',
  async(args, { getState }) => {
    const state = getState().currentBoard.value

    try {
      
      updateDoc(doc(db, 'boardData', state.dataId), { categories: state.categories });

    } catch (e) {
      console.log(e);
    }

  }
)

export const deleteCategory = createAsyncThunk(
  'board/deleteCategory',
  async(args, { getState }) => {
    const state = getState().currentBoard.value
    const { catId } = args;
    try {
      const category = state.categories.find((cat) => cat.id === catId);
      updateDoc(doc(db, 'boardData', state.dataId), { categories: arrayRemove(category) });
    } catch (e) {
      console.log(e);
    }

  }
)

export const createObjective = createAsyncThunk(
  'board/createObjective',
  async(args, { getState }) => {
    const { catId, name } = args;
    const state = getState().currentBoard.value

    try {

      const objective = {
        id: uuid(),
        name: name,
        priority: "Medium",
        progress: "Not Started",
        notes: "",
        startingDate: { date: "", time: "" },
        dueDate: { date: "", time: "" }
      }
      
      const catIndex = state.categories.findIndex((cat) => cat.id === catId);

      const categories = [...state.categories.slice(0, catIndex),
        {...state.categories[catIndex], objectives: [...state.categories[catIndex].objectives, objective]},
      ...state.categories.slice(catIndex + 1, state.categories.length)
      ]

      updateDoc(doc(db, 'boardData', state.dataId), { categories });

    } catch (e) {
      console.log(e);
    }

  }
)

export const updateObjective = createAsyncThunk(
  'board/updateObjective',
  async(args, { getState }) => {
    const { catId, objective } = args;
    const state = getState().currentBoard.value

    try {
      
      const catIndex = state.categories.findIndex((cat) => cat.id === catId);
      const objIndex = state.categories[catIndex].objectives.findIndex((obj) => obj.id === objective.id)

      const categories = [...state.categories.slice(0, catIndex),
        {...state.categories[catIndex], 
          objectives: [...state.categories[catIndex].objectives.slice(0, objIndex),
          {...objective},
          ...state.categories[catIndex].objectives.slice(objIndex + 1, state.categories[catIndex].objectives.length)]},
      ...state.categories.slice(catIndex + 1, state.categories.length)
      ]

      updateDoc(doc(db, 'boardData', state.dataId), { categories });

    } catch (e) {
      console.log(e);
    }

  }
)

export const deleteObjective = createAsyncThunk(
  'board/deleteObjective',
  async(args, { getState }) => {
    const { objId, catId } = args;
    const state = getState().currentBoard.value

    try {
      
      const catIndex = state.categories.findIndex((cat) => cat.id === catId);

      const categories = [...state.categories.slice(0, catIndex),
        {...state.categories[catIndex], objectives: state.categories[catIndex].objectives.filter((obj) => obj.id !== objId)},
      ...state.categories.slice(catIndex + 1, state.categories.length)
      ]

      updateDoc(doc(db, 'boardData', state.dataId), { categories });

    } catch (e) {
      console.log(e);
    }

  }
)

export const currentBoardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    populate: (state, action) => {
      state.value = action.payload
    },
    moveCategory: (state, action) => {
      const { active, over } = action.payload;
      state.value.categories = arrayMove(state.value.categories, active, over);
    },
    moveObjective: (state, action) => {
      const { active, over, newIndex, activeObj } = action.payload;
      const prev = state.value.categories;

     prev[over].objectives = [...prev[over].objectives.slice(0, newIndex),
           prev[active].objectives.find((obj) => obj.id === activeObj),
        ...prev[over].objectives.slice(newIndex, prev[over].objectives.length)]
     prev[active].objectives = [...prev[active].objectives.filter((item) => item.id !== activeObj)];

    },
    reorderObjective: (state, action) => {
      const { active, activeIndex, overIndex } = action.payload;

      state.value.categories[active].objectives = arrayMove(state.value.categories[active].objectives, activeIndex, overIndex)

    }
  }
})

// Action creators are generated for each case reducer function
export const { populate, moveCategory, moveObjective, reorderObjective } = currentBoardSlice.actions

export default currentBoardSlice.reducer 