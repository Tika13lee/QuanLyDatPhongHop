import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true");
    },
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem("isLoggedIn");
    },
    checkLoginStatus: (state) => {
      state.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    },
  },
});

export const { login, logout, checkLoginStatus } = authSlice.actions;
export default authSlice.reducer;
