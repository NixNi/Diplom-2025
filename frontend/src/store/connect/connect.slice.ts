import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ConnectState {
  ip: string | null;
  port: number | null;
  user: string | null;
  password: string | null;
}


const initialState: ConnectState = {
  ip: null,
  port: null,
  user: null,
  password: null
};


export const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    setConnect: (state, action: PayloadAction<ConnectState>) => {
      state = action.payload;
    },
    resetConnectState: (state) => {
      state.ip = null;
      state.password = null;
      state.user = null;
      state.port = null;
    },
   
  },
  extraReducers: (builder) => {
    builder
  },
});

export const modelActions = {
  ...connectSlice.actions,
 
};
export const connectReducer = connectSlice.reducer;
