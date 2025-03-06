import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/roomSlice";
import authReducer from "../features/authSlice";

const store = configureStore({
  reducer: {
    room: roomReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
