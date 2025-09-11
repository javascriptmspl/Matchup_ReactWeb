import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadMediaAPI } from "../MANAGE_API/interest-API";

export const uploadMediaAsync = createAsyncThunk(
  "media/uploadMedia",
  async ({ userId, files, type }, { rejectWithValue }) => {
    try {
      const res = await uploadMediaAPI(userId, files);

      const mediaWithType = res.map((item) => ({
        ...item,
        type: type || "all", 
      }));

      return mediaWithType;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const mediaSlice = createSlice({
  name: "media",
  initialState: {
    mediaList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadMediaAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadMediaAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaList.push(...action.payload); // spread array
      })
      .addCase(uploadMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mediaSlice.reducer;
