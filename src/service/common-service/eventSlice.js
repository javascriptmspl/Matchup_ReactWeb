// src/redux/slices/eventSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../base";

// CREATE event thunk
export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/events/createEvent`,
        payload
      );
      toast.success("Schedule date successfully updated");
      return response.data;
    } catch (error) {
      toast.error("Failed to update Contact info");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getEvents = createAsyncThunk(
  "event/getEvents",
  async (userId,{ rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/events/getBySenderUserId/${userId}?modeId=68d103d5aa4b176726e60421&page_number=1&page_size=100`
      );
      
      return response.data.data || [];
    } catch (error) {
      toast.error("Failed to fetch event data");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getEventsM = createAsyncThunk(
  "events/getEventsM",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
         `${BASE_URL}/events/getBySenderUserId/${userId}?modeId=68d103ffaa4b176726e60424&page_number=1&page_size=100`
      );
      return response.data.data || [];
    } catch (error) {
      toast.error("Failed to fetch event data");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/events/deleteEvent/${eventId}`
      );
      toast.success("Event deleted successfully");
      return eventId;
    } catch (error) {
      toast.error("Failed to delete event");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState: {
    loading: false,
    eventData: null,
    eventArray: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.eventData = action.payload;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.eventArray = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.eventArray = state.eventArray.filter(
          (event) => (event.id || event._id) !== action.payload
        );
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
