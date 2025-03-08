import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { DeviceProps } from "../data/data";

// State ban đầu
type DeviceState = {
  devices: DeviceProps[];
  loading: boolean;
  error: string | null;
};

const initialState: DeviceState = {
  devices: [],
  loading: false,
  error: null,
};

// Thunk để gọi API
export const fetchDevices = createAsyncThunk(
  "device/fetchDevices",
  async () => {
    const response = await axios.get<DeviceProps[]>(
      "http://localhost:8080/api/v1/device/getAllDevices"
    );
    return response.data;
  }
);

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        if (
          JSON.stringify(state.devices) !== JSON.stringify(action.payload)
        ) {
          state.devices = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchDevices.rejected, (state) => {
        state.loading = false;
        state.error = "Lỗi khi tải danh sách thiết bị";
      });
  },
});

export default deviceSlice.reducer;
