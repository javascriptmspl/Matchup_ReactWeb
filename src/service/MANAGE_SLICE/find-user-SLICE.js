import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  SearchFindPartnerAPI,
  getFindPartnerAPI,
} from "../MANAGE_API/find-user-API";

export const metriGetAllUsersAsync = createAsyncThunk(
  "allUsers/getAllUsers",
  async () => {
    try {
      const response = await getFindPartnerAPI();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const metriSearchAllUsersAsync = createAsyncThunk(
  "allUsers/searchAllUsers",
  async (query) => {
    try {
      const response = await SearchFindPartnerAPI(query);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const loadCachedUsers = () => {
  try {
    const raw = localStorage.getItem("metrimonialUsers");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
};

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: {
    users: loadCachedUsers(),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(metriGetAllUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(metriGetAllUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        try {
          localStorage.setItem(
            "metrimonialUsers",
            JSON.stringify(state.users || [])
          );
        } catch (_) {}
      })
      .addCase(metriGetAllUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(metriSearchAllUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error state when starting the request
      })
      .addCase(metriSearchAllUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        try {
          localStorage.setItem(
            "metrimonialUsers",
            JSON.stringify(state.users || []) 
          );
        } catch (_) {}
      })
      .addCase(metriSearchAllUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default allUsersSlice.reducer;
