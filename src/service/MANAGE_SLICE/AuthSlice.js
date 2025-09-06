import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUser,
  sentOtpApi,
  userLogin,
  verifyOTPApi,
} from "../api/AuthAPI";
import { updateUserByIdMetri } from "../MANAGE_API/AuthAPI";

export const updateUserById = createAsyncThunk(
  "user/updateById",
  async ({ userId, updatedUserData }, { rejectWithValue }) => {
    try {
      const response = await updateUserByIdMetri(userId, updatedUserData);
      console.log("responseeeeeee", response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    // Other synchronous actions can be added here
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const {
  /* Any synchronous actions you may add */
} = userSlice.actions;
export default userSlice.reducer;
