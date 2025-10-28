// findpartner-slice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { filterPartnerByAge, filterPartnerByGender } from "../api/find-partner-API";

export const filterPartnerByAgeAsync = createAsyncThunk(
  'findUser/filterPartnerByAgeAsync',
  async (data) => { 
    const { modeId, minAge, maxAge } = data
    try {
      const response = await filterPartnerByAge(modeId, minAge, maxAge);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const filterPartnerByGenderAsync = createAsyncThunk(
  'findUser/filterPartnerByGenderAsync',
  async (data) => {
const { modeId, gender } = data;
try {
  const response = await filterPartnerByGender(modeId, gender);
  return response;
} catch (error) {
  throw error
}
  }
)

const findPartnerSlice = createSlice({
  name: 'findUser',
  initialState: {
    item: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(filterPartnerByAgeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterPartnerByAgeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(filterPartnerByAgeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(filterPartnerByGenderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterPartnerByGenderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(filterPartnerByGenderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
  },
});

export default findPartnerSlice.reducer;
