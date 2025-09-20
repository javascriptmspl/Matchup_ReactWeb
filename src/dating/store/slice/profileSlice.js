import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  updateUserInterests,
  updateUserProfile,
  uploadMultiPicture,
  uploadProfilePicture,
} from "../api/profile";
import { getbyiduser } from "../api/AuthAPI";

export const uploadProfilePictureAsync = createAsyncThunk(
  "user/uploadProfilePicture",
  async ({ imageData, userId }, thunkAPI) => {
    console.log("userId slice dp", userId);
    try {
      const response = await uploadProfilePicture(imageData, userId);
      try {
        await thunkAPI.dispatch(getUserProfileAsync(userId));
      } catch (_) {}
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const uploadMultiPictureAsync = createAsyncThunk(
  "user/uploadMultiPicture",
  async ({ imageData, userId }, thunkAPI) => {
    try {
      const response = await uploadMultiPicture(imageData, userId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateInterestsAsync = createAsyncThunk(
  "profile/updateInterests",
  async ({ userId, interests }) => {
    try {
      const response = await updateUserInterests(userId, interests);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getUserProfileAsync = createAsyncThunk(
  "Users_User/getById",
  async (userId) => {
    try {
      const response = await getbyiduser(userId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateUserProfileAsync = createAsyncThunk(
  "Users_User/update",
  async (Data) => {
    const { updatedUserData, userId } = Data;
    try {
      const response = await updateUserProfile(updatedUserData, userId);
      console.log("ressmmm", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    interests: [],
    userData: [],
    uploading: false,
    uploadError: null,
    loading: false,
    error: null,
    avatarVersion: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProfilePictureAsync.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadProfilePictureAsync.fulfilled, (state) => {
        state.uploading = false;
        state.avatarVersion = Date.now();
      })
      .addCase(uploadProfilePictureAsync.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.error.message;
      })
      .addCase(uploadMultiPictureAsync.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
      })
      .addCase(uploadMultiPictureAsync.fulfilled, (state) => {
        state.uploading = false;
      })
      .addCase(uploadMultiPictureAsync.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.error.message;
      })
      .addCase(updateInterestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterestsAsync.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateInterestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.data;
      })
      .addCase(getUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.data;
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default profileSlice.reducer;
