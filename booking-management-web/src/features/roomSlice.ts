import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomProps, rooms } from "../data/data";

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
    setSelectedRoom: (state, action: PayloadAction<number>) => {
      state.selectedRoom = rooms.find((room) => room.id === action.payload) || null;
    },
  },
});

// Export actions
export const { setSelectedRoom } = roomSlice.actions;

// Export reducer
export default roomSlice.reducer;
