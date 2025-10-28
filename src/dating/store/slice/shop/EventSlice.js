// EventSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Async thunk for adding items to the Event
export const addToEventAsync = createAsyncThunk(
  'Event/addToEventAsync',
  async (data) => {
    // Access the current state to get existing Event items
    
   const dataa={
    name:'abcd'
   }
   
    return dataa;
  }
);

 

const EventSlice = createSlice({
  name: 'Event',
  initialState: {
    items: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add other Event-related reducers as needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToEventAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToEventAsync.fulfilled, (state, action) => {
       
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToEventAsync.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.error.message;
      })
       
  },
});

export default  EventSlice;
