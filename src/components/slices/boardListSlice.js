import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const boardListSlice = createSlice({
  name: 'boardList',
  initialState,
  reducers: {
    populate: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { populate } = boardListSlice.actions

export default boardListSlice.reducer