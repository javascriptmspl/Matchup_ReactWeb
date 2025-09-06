import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { allActivities, allUserActivities,createActivity, deleteActivityApi, getBySenderUserId, searchActivity, sortActivity, updateActivity,getActivitysByUserId } from "../api/Activities";

export const createActivities = createAsyncThunk(
'Activity/createActivity', 
async (Data) => {
  try {
    const response = await createActivity(Data);
    return response;
  } catch (error) {
    throw error;
  }
}

)

export const getAllActivies = createAsyncThunk(
  'Activies/getAllActivies',
  async () => {

    try {
      const response = await allActivities();
      console.log(response,"=====activiy");
      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const getBySenderUserIds = createAsyncThunk(
  'Activity/getBySenderUserIds',
  async(Data)=>{
    try {
      const response  = await getBySenderUserId(Data );
      return response.data
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

)

export const getActivitysByUsersId = createAsyncThunk(
  'Activity/getActivitysByUsersId',
  async(Data)=>{
    try {
      const response  = await getActivitysByUserId(Data );
      return response.data
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

)

export const deleteActivitySlice = createAsyncThunk(
  'Activity/deleteActivitySlice',
  async (data) => {
    try {
      const response  = await deleteActivityApi(data);
      return response.data.data
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

export const updateActivitySlice = createAsyncThunk(
  'Activity/updateActivitySlice',
  async (data) => {
    try {
      const response= await updateActivity(data);
      console.log(response)
      return response ;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);





 // search 
 export const fetchsearchActivity = createAsyncThunk(  'Activity/fetchsearchActivity',
  async (data) => {
    try {
      const response= await searchActivity(data);
      console.log(response.data);
      return response ;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
 )

 // sortUser
 export const fetchsortActivity = createAsyncThunk(
  'Activity/fetchsortActivity',
  async (sort) => {
    try {
      const response= await sortActivity(sort);
      console.log(response.data);
      return response ;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
);

export const getAllUserActivies = createAsyncThunk(
  'Activies/getAllUserActivies',
  async () => {
    try {
      const response = await allUserActivities();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const activiesSlice = createSlice({
  name: 'activies',
  initialState: {
    activies: [],
    Activity:[],
    allActivity:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // create activity slices --------------------------------
    .addCase( createActivities.pending, (state) => {state.loading=true })
    .addCase(createActivities.fulfilled, (state, action) => {
      state.loading = false;
      state.activies = [action.payload].concat(state.activies);
    })
    .addCase(createActivities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
// -----------get all activities ------------------------------
      .addCase(getAllActivies.pending, (state) => {
        state.loading =true
      })
      .addCase(getAllActivies.fulfilled, (state,action) => {
        state.activies = action.payload
        state.loading =false
      })
      .addCase(getAllActivies.rejected, (state, action) => {
      state.loading = true
      })
 // ---------get AllUser Activies -------------------------------- 
      .addCase(getAllUserActivies.pending, (state) => {
        state.loading =true
      })
      .addCase(getAllUserActivies.fulfilled, (state,action) => {
        state.activies = action.payload
        state.loading =false
      })
      .addCase(getAllUserActivies.rejected, (state, action) => {
      state.loading = true
      })
      .addCase(getBySenderUserIds.fulfilled, (state, action) => {
        state.Activity= action.payload
        state.loading = false
      })
    .addCase(getBySenderUserIds.pending, (state, action) => {
  
          state.loading = true
     })
    .addCase(getBySenderUserIds.rejected, (state, action) => {
        state.loading = false
    })
    // .addCase(deleteActivitySlice.fulfilled, (state, action) => {
       
    //     // const alldata= state.Activity.filter((items)=>items._id!==action.payload._id)
    //     // state.users.push(...action.payload);
    //     // state.Activity = alldata
    //     state.loading = false;
    //   })

// get Activity by users Id---------------------
.addCase(getActivitysByUsersId.fulfilled, (state, action) => {
  state.allActivity= action.payload
  state.loading = false
})
.addCase(getActivitysByUsersId.pending, (state, action) => {

    state.loading = true
})
.addCase(getActivitysByUsersId.rejected, (state, action) => {
  state.loading = false
})



// delete the activity----------
.addCase(deleteActivitySlice.fulfilled, (state, action) => {
 
  // const alldata= state.Activity.filter((items)=>items._id!==action.payload._id)
  // state.users.push(...action.payload);
  // state.Activity = alldata
  state.loading = false;
})

       // search
       .addCase(fetchsearchActivity.fulfilled,(state,action)=>{
        console.log(action.payload)
        state.Activity = action.payload;
        state.loading = false;
      })

      // fetchsortUser
      .addCase(fetchsortActivity.fulfilled,(state,action)=>{
        console.log(action.payload)
        state.Activity = action.payload;
        state.loading = false;
      })

  },
});

export default activiesSlice.reducer;
