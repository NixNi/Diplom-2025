import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConnectState {
  ip: string | null;
  port: number | null;
  // user: string | null;
  // password: string | null;
}

const initialState: ConnectState = {
  ip: null,
  port: null,
  // user: null,
  // password: null,
};

// const initialState: ConnectState = {
//   ip: "localhost",
//   port: 12537,
//   user: "user",
//   password: "123456",
// };

export const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    setConnect: (state, action: PayloadAction<ConnectState>) => {
      state.ip = action.payload.ip;
      state.port = action.payload.port;
      // state.user = action.payload.user;
      // state.password = action.payload.password;
    },
    resetConnectState: (state) => {
      state.ip = null;
      state.port = null;
      // state.password = null;
      // state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const connectActions = {
  ...connectSlice.actions,
};
export const connectReducer = connectSlice.reducer;
