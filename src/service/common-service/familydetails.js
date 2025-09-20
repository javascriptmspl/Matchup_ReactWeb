import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateFamilyAPI } from "../../dating/store/api/Activities";

export const metriUpdateFamilyAsync = createAsyncThunk(
  "family/updateFamily",
  async ({ userId, values }, { rejectWithValue }) => {
    try {
      const response = await updateFamilyAPI(userId, values);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const familySlice = createSlice({
  name: "family",
  initialState: {
    family: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(metriUpdateFamilyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(metriUpdateFamilyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.family = action.payload;
      })
      .addCase(metriUpdateFamilyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default familySlice.reducer;
