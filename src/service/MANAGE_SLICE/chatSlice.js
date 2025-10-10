import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createChatRoom, getChatRooms } from "../MANAGE_API/chat-API";

// Async thunk for creating/getting a chat room
export const fetchChatRoomsAsync = createAsyncThunk(
  "chat/fetchRooms",
  async ({ userId, toUserId }, { rejectWithValue }) => {
    try {
      const response = await createChatRoom(userId, toUserId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to create chat room");
    }
  }
);

// Async thunk for getting all chat rooms
export const getAllChatRoomsAsync = createAsyncThunk(
  "chat/getAllRooms",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getChatRooms(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to get chat rooms");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    allRooms: [],
    status: "idle", // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRooms: (state) => {
      state.rooms = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create/get chat room
      .addCase(fetchChatRoomsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchChatRoomsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchChatRoomsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.rooms = [];
      })
      // Get all rooms
      .addCase(getAllChatRoomsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllChatRoomsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allRooms = action.payload.data || [];
        state.error = null;
      })
      .addCase(getAllChatRoomsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.allRooms = [];
      });
  },
});

// Export the actions and reducer
export const { clearError, clearRooms } = chatSlice.actions;
export default chatSlice.reducer;
