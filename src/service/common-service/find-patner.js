import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../base";

export const fetchPotentialUsers = createAsyncThunk(
  "users/fetchPotentialUsers",
  async ({ userId, modeId }) => {
    const response = await fetch(
      `${BASE_URL}/User/getAllPartnersUsers?modeId=${modeId}&userId=${userId}`
    );
    const data = await response.json();
    return data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPotentialUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPotentialUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPotentialUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
