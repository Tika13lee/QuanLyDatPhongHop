import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LocationProps } from "../data/data";

// State ban đầu
type LocationState = {
  locations: LocationProps[];
  loading: boolean;
  error: string | null;
};

const initialState: LocationState = {
  locations: [],
  loading: false,
  error: null,
};

// Thunk để gọi API
export const fetchLocations = createAsyncThunk(
  "location/fetchLocations",
  async () => {
    const response = await axios.get<LocationProps[]>(
      "http://localhost:8080/api/v1/location/getAllLocation"
    );
    return response.data;
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        if (
          JSON.stringify(state.locations) !== JSON.stringify(action.payload)
        ) {
          state.locations = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchLocations.rejected, (state) => {
        state.loading = false;
        state.error = "Lỗi khi tải danh sách vị trí";
      });
  },
});

export default locationSlice.reducer;
