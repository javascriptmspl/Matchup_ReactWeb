import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../base";

// 🔹 Fetch users by gender
export const fetchUsersByGender = createAsyncThunk(
  "dating/fetchUsersByGender",
  async ({ gender, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/User/getByGender/${gender}/${userId}`
      );
      if (response.data && response.data.data) {
        return response.data;
        
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Create activity
export const createActivity = createAsyncThunk(
  "dating/createActivity",
  async (
    {
      senderUserId,
      receiverUserId,
      action_logs,
      description,
      note,
      mode,
      activityType,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/activitys/createActivity`,
        {
          senderUserId,
          receiverUserId,
          action_logs,
          description,
          note,
          mode,
          activityType,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Get activities by senderUserId
export const getActivitiesBySenderUserId = createAsyncThunk(
  "dating/getActivitiesBySenderUserId",
  async (
    { senderUserId, modeId, page_number, page_size },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/activitys/getBySenderUserId/${senderUserId}?modeId=${modeId}&page_number=${page_number}&page_size=${page_size}`
      );
      // console.log("1111111111111111111",response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// New thunk for Interests

export const fetchInterests = createAsyncThunk(
  "dating/fetchInterests",
  async ({ token, page_no = 1, page_size = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/interest/getall/${token}?page_no=${page_no}&page_size=${page_size}`
      );

      if (response.data && response.data.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Get filtered users

export const getFilteredUsers = createAsyncThunk(
  "dating/getFilteredUsers",
  async (
    { userId, gender, address, minAge, maxAge, modeId, name },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/User/filter`, 
        {
          params: {
            userId,
            gender,
            address,
            minAge,
            maxAge,
            modeId,
            name,
          
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ---------------------
// Slice
// ---------------------
const datingApiSlice = createSlice({
  name: "datingApi",
  initialState: {
    users: [],
    interests: [],
    loading: false,
    error: null,
    activity: null,
    activities: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchUsersByGender.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByGender.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersByGender.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createActivity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activity = action.payload;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getActivitiesBySenderUserId
      .addCase(getActivitiesBySenderUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivitiesBySenderUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(getActivitiesBySenderUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getFilteredUsers
      .addCase(getFilteredUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilteredUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.data || [];
      })
      .addCase(getFilteredUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Interests
      .addCase(fetchInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.interests = action.payload;
      })
      .addCase(fetchInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default datingApiSlice.reducer;
