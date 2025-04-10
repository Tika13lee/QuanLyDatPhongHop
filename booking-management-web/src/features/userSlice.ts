import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeeProps } from "../data/data";

const savedUser = localStorage.getItem("currentUser");
const initialState: EmployeeProps | null = savedUser
  ? JSON.parse(savedUser)
  : null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<EmployeeProps>) {
      return action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<EmployeeProps>>) {
      if (state) {
        return { ...state, ...action.payload };
      }
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
