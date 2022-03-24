import { configureStore } from "@reduxjs/toolkit";
import boardListSlice from "./components/slices/boardListSlice";
import currentBoardSlice from "./components/slices/currentBoardSlice";
import localStorageSlice from "./components/slices/localStorageSlice";

export const store = configureStore({
    reducer: {
        currentBoard: currentBoardSlice,
        boardList: boardListSlice,
        local: localStorageSlice
    }
});