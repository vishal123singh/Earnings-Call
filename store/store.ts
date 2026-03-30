import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
