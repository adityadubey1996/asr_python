import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";





 

export const authSlice = createSlice({
  name: "user",
  initialState: {
    userData: undefined,
    isLoading: false,
    error: false,
  },
  reducers: {
    userLoginStart: (state, action) => {
      state.isLoading = true;
    },
    userLoginSuccess: (state, action) => {
      console.log('action.payload',action.payload)
      state.isLoading = false;
      state.userData = action.payload?.data;
    },
    userLoginFailure: (state, action) => {
      state.isLoading = false;
      state.error = true;
    },
    userLogout: (state, action) => {  
      state.userData = undefined;
    },
  },
});

export const {
  userLoginFailure,
  userLoginStart,
  userLoginSuccess,
  userLogout,
} = authSlice.actions;



export default  authSlice.reducer;
