import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { EmployeeProps } from "../data/data";

// State ban đầu
type EmployeeState = {
  employees: EmployeeProps[];
  loading: boolean;
  error: string | null;
};

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

// Thunk để gọi API và lấy dữ liệu nhân viên
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async () => {
    const response = await axios.get<EmployeeProps[]>(
      "http://localhost:8080/api/v1/employee/getAllEmployee"
    );
    return response.data;
  }
);

// Thunk để thêm nhân viên
export const addEmployee = createAsyncThunk(
  "employee/addEmployee",
  async (newEmployee: EmployeeProps, { dispatch }) => {
    const response = await axios.post(
      "http://localhost:8080/api/v1/employee/addEmployee",
      newEmployee
    );

    dispatch(fetchEmployees());
    return response.data;
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        if (
          JSON.stringify(state.employees) !== JSON.stringify(action.payload)
        ) {
          state.employees = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.loading = false;
        state.error = "Lỗi khi tải danh sách nhân viên";
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
      });
  },
});

export default employeeSlice.reducer;
