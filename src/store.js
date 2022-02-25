import { configureStore } from "@reduxjs/toolkit";
import boardListSlice from "./components/slices/boardListSlice";
import currentBoardSlice from "./components/slices/currentBoardSlice";

export const store = configureStore({
    reducer: {
        currentBoard: currentBoardSlice,
        boardList: boardListSlice,
    }
});