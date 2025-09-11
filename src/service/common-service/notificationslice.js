import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserNotificationsAPI } from "../MANAGE_API/Notification-API";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async ({ userId, page = 1, limit = 11 }, { rejectWithValue }) => {
    try {       
      return await getUserNotificationsAPI(userId, page, limit);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
  ? action.payload
  : action.payload?.data || [];
 
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
