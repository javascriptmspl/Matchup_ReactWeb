import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createIntersetApi,
  deleteInterestApi,
  getAllInterestApi,
  searchInterest,
  sortInterest,
  updateInterest,
} from "../MANAGE_API/interest-API";

// interface  {
//   interset[]; // Replace 'any' with the actual type of your interset items
//   loading;
//   error;
// }

const initialState = {
  interset: [],
  loading: false,
  error: null,
};

export const createInterset = createAsyncThunk(
  "interset/createInterset",
  async (data) => {
    try {
      const response = await createIntersetApi(data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

export const getAllInterest = createAsyncThunk(
  "interest/getAllInterest",
  async (modeid) => {
    try {
      const response = await getAllInterestApi(modeid);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);
export const deleteInterestSlice = createAsyncThunk(
  "interest/deleteInterestSlice",
  async (id) => {
    try {
      const response = await deleteInterestApi(id);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

export const updateInterestSlice = createAsyncThunk(
  "interest/updateInterestSlice",
  async (data) => {
    try {
      const response = await updateInterest(data);
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

// search
export const fetchsearchInterest = createAsyncThunk(
  "interest/fetchsearchInterest",
  async (data) => {
    try {
      const response = await searchInterest(data);
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
);

// sortUser
export const fetchsortInterest = createAsyncThunk(
  "interest/fetchsortInterest",
  async (sort) => {
    try {
      const response = await sortInterest(sort);
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
);
const intersetSlice = createSlice({
  name: "intersetSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInterset.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createInterset.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createInterset.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getAllInterest.fulfilled, (state, action) => {
        state.interset = action.payload.data; // Store the array directly
        state.loading = false;
      })
      .addCase(getAllInterest.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllInterest.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteInterestSlice.fulfilled, (state, action) => {
        // const alldata= state.interset.filter((items )=>items._id!==action.payload._id)
        // state.users.push(...action.payload);
        // state.interset = alldata
        state.loading = false;
      })
      // search
      .addCase(fetchsearchInterest.fulfilled, (state, action) => {
        state.interset = action.payload;
        state.loading = false;
      })

      // fetchsortUser
      .addCase(fetchsortInterest.fulfilled, (state, action) => {
        state.interset = action.payload;
        state.loading = false;
      });
  },
});
export default intersetSlice.reducer;
