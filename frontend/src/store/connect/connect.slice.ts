import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connect, Connection } from "../../types/connection";

interface ConnectState {
  ip: string | null;
  port: number | string | null;
  connections: Connection[];
}

const initialState: ConnectState = {
  ip: null,
  port: null,
  connections: [],
};

export const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    setConnect: (state, action: PayloadAction<Connect>) => {
      state.ip = action.payload.ip;
      state.port = action.payload.port;
    },
    resetConnectState: (state) => {
      state.ip = null;
      state.port = null;
      state.connections = [];
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
