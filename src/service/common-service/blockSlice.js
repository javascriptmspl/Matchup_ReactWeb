import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../base';

export const blockUser = createAsyncThunk(
  'block/blockUser',

  async (targetUserId, { rejectWithValue }) => {


    try {
        
      const raw = localStorage.getItem('userData');
      const parsed = raw ? JSON.parse(raw) : null;
      const blocker = parsed?.data?._id;


      if (!blocker || !targetUserId) {
        return rejectWithValue('Missing blocker or blocked user id');
      }

      const payload = { blocker, blocked: targetUserId };
      
      const response = await axios.post(`${BASE_URL}/block-user/create`, payload);
     
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const unblockUser = createAsyncThunk(
  'block/unblockUser',
  async (blockedUserId, { rejectWithValue }) => {
    try {
      const raw = localStorage.getItem('userData');
      const parsed = raw ? JSON.parse(raw) : null;
      const blocker = parsed?.data?._id;

      if (!blocker || !blockedUserId) {
        return rejectWithValue('Missing blocker or blocked user id');
      }

      const payload = { blocker, blocked: blockedUserId };
    
      
      const response = await axios.post(`${BASE_URL}/block-user/unblock`, payload);
      return { ...response.data, unblockedUserId: blockedUserId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const getBlockedUsers = createAsyncThunk(
  'block/getBlockedUsers',
    async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/block-user/blocked-users/${userId}`);
    
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Check if current user is blocked by another user
export const checkIfBlockedBy = createAsyncThunk(
  'block/checkIfBlockedBy',
  async ({ currentUserId, targetUserId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/block-user/check-blocked`, {
        params: {
          blocker: targetUserId,
          blocked: currentUserId
        }
      });
     
      return {
        targetUserId,
        isBlocked: response.data?.isBlocked || false
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const blockSlice = createSlice({
  name: 'block',
  initialState: {
    blockedUsers: [],
    blockedByUsers: {},  

    loading: false,
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedUsers.push(action.payload);
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBlockedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlockedUsers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        
        state.blockedUsers =
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload?.users) && payload.users) ||
          (Array.isArray(payload?.blockedUsers) && payload.blockedUsers) ||
          (Array.isArray(payload?.data?.blockedUsers) && payload.data.blockedUsers) ||
          (Array.isArray(payload?.results) && payload.results) ||
          (Array.isArray(payload?.items) && payload.items) ||
          [];
      })
      .addCase(getBlockedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(unblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false;
        const unblockedUserId = action.payload.unblockedUserId || action.payload.userId || action.payload._id || action.payload.data?.userId;
        state.blockedUsers = state.blockedUsers.filter(user => {
          const userId = user?.blocked?._id || user?._id || user?.id;
          return userId !== unblockedUserId;
        });
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(checkIfBlockedBy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIfBlockedBy.fulfilled, (state, action) => {
        state.loading = false;
        const { targetUserId, isBlocked } = action.payload;
        state.blockedByUsers[targetUserId] = isBlocked;
      })
      .addCase(checkIfBlockedBy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blockSlice.reducer;
