import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomProps } from "../data/data";

interface RoomState {
  selectedRoom: RoomProps | null;
}

// Trạng thái ban đầu
const initialState: RoomState = {
  selectedRoom: null,
};

// Tạo Slice
const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setSelectedRoom: (state, action: PayloadAction<RoomProps>) => {
      state.selectedRoom = action.payload;
    },
  },
});

export const { setSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;
