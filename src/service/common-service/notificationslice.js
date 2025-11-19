import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserNotificationsAPI, markNotificationsAsRead, markAllNotificationsAsRead } from "../MANAGE_API/Notification-API";

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

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationIds, { rejectWithValue }) => {
    try {
      await markNotificationsAsRead(notificationIds);
      return notificationIds;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (userId, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsRead(userId);
      return userId;
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
      })
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // Update the status of marked notifications to 'READ'
        state.list = state.list.map(notification => 
          action.payload.includes(notification._id) 
            ? { ...notification, status: 'READ' }
            : notification
        );
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        // Mark all notifications as read
        state.list = state.list.map(notification => ({
          ...notification,
          status: 'READ'
        }));
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
