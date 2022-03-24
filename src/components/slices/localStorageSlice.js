import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState,
  reducers: {
    populate: (state, action) => {

        const data = JSON.parse(action.payload);

        if (data) {
            state.value = data;
        } 
      
    },
    addItem: (state, action) => {

        const { boardId, data } = action.payload;

        const existingBoard = state.value.find((board) => board.boardId === boardId);

        if (existingBoard !== undefined) {
            if (Array.isArray(data)) {
                existingBoard.items.push(...data);
            } else {
                existingBoard.items.push(data);
            }
        } else {
            if (Array.isArray(data)) {
                state.value.push({boardId: boardId, items: [...data]});
            } else {
                state.value.push({boardId: boardId, items: [data]});
            }
        }

        localStorage.setItem('deleted-items', JSON.stringify(state.value));
    },
    removeItem: (state, action) => {
        const { boardId, objId } = action.payload;

        const boardIndex = state.value.findIndex((board) => board.boardId === boardId);

        if (state.value[boardIndex].items.length === 1) {

            state.value.splice(boardIndex, 1);

        } else {
            state.value[boardIndex].items = state.value[boardIndex].items.filter((item) => item.id !== objId);
        }
        
        localStorage.setItem('deleted-items', JSON.stringify(state.value));
    },
    removeBoard: (state, action) => {
        const { boardId } = action.payload;
    
        state.value = state.value.filter((board) => board.boardId !== boardId);
    
        localStorage.setItem('deleted-items', JSON.stringify(state.value));
      },
  }
})

// Action creators are generated for each case reducer function
export const { populate, addItem, removeItem, removeBoard } = localStorageSlice.actions

export default localStorageSlice.reducer