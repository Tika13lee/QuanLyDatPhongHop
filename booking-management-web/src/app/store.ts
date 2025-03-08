import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/roomSlice";
import authReducer from "../features/authSlice";
import locationReducer from "../features/locationSlice";
import deviceReducer from "../features/deviceSlice";

const store = configureStore({
  reducer: {
    room: roomReducer,
    auth: authReducer,
    location: locationReducer,
    device: deviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
