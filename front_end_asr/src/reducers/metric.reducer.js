import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  {axiosInstance as axios, baseUrl} from 'utils'





 
  export const fetchQuestions = createAsyncThunk(
    "metrics/fetchQuestions",
    async (_, { getState }) => {
      const user = getState().user.user;  // Access the latest user state directly from the store
      const token = user?.data?.access_token;
  
      if (!token) {
        throw new Error("Token not available");
      }
  try{
      const response = await axios.get(`/api//userMetrics`);
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch questions");
      }
      
    }
    catch(e){
      return null;
    }}
  );

export const createMetric = createAsyncThunk(
  "metrics/saveAnswers",
  async ({ answers, title }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/api/userMetrics`, 
        {customSettings :  answers, workflowTitle :title }
      );
      if (response.status == 200) {
        return answers;
      }
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const getUserMetrics = createAsyncThunk(
  "metrics/getMetrics",
  async (_, { getState }) => {
    console.log('getState() from getUserMetrics',getState() )
    const user = getState().user;  // Access the latest user state directly from the store
    const token = user?.userData?.access_token;
    console.log('user', user)

    if (!token) {
      throw new Error("Token not available");
    }
    console.log('inside getUserMetrics')
    try {
    const response = await axios.get(`/api/userMetrics`);
   
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (error) {
      throw new Error("something went wrong", error);
    
    }
  }
);

const metricsSlice = createSlice({
  name: "metrics",
  initialState: {
    questions: [],
    userAnswers: {},
    userMetrics: "",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createMetric.fulfilled, (state, action) => {
        state.userAnswers = action.payload;
      });
      builder
      .addCase(getUserMetrics.fulfilled, (state, action) => {
        state.userMetrics = action.payload;
        state.loading = false;
      })
      .addCase(getUserMetrics.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserMetrics.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
});

export default metricsSlice.reducer;
