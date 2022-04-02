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

        // Retrieving locally stored board data based on the currently open boardId;
        const existingBoard = state.value.find((board) => board.boardId === boardId);
                                                                                    
        if (existingBoard !== undefined) {          // If the data exists                                             
            if (Array.isArray(data)) {              // and given data is an array
                existingBoard.items.push(...data);  // spread and push the data into the state.
            } else {
                existingBoard.items.push(data);     // Else if data is an object simply push it to the state array.
            }
        } else {
            if (Array.isArray(data)) {                                      // If the local data doesn't exist
                state.value.push({boardId: boardId, items: [...data]});     // and given data is an array, spread and push to the state.
            } else {
                state.value.push({boardId: boardId, items: [data]});        // Else push a single item.
            }
        }

        localStorage.setItem('deleted-items', JSON.stringify(state.value));
    },
    removeItem: (state, action) => {
        const { boardId, objId } = action.payload;

        const boardIndex = state.value.findIndex((board) => board.boardId === boardId);

        // When removing item from local storage, if the the item is the last one, remove the whole board object.
        if (state.value[boardIndex].items.length === 1) {   

            state.value.splice(boardIndex, 1);

        } else {
            // else just remove the single item.
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