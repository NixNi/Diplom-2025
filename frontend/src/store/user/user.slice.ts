import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import user, { serverUserResponse } from "../types/user";
import Cookies from "universal-cookie";


interface UserState extends user {}
const cookies = new Cookies();

export const updateUserAsync = createAsyncThunk(
  "user/updateUserAsync",
  async (_, ThunkApi) => {

    const response = await fetch("/api/user/auth", {
      mode: "cors",
      credentials: "include",
      headers: {
        authorization: `Bearer ${cookies.get("token")}`,
      },
      signal: ThunkApi.signal
    });

    const updatedUserData: serverUserResponse = await response.json();

    return updatedUserData.user;
  }
);

const initialState: UserState = {
        id: 0,
        login: "",
        info: "",
        role: "UN",
        created_at: String(new Date()),
        updated_at: String(new Date()),
      };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<user>) {
      state.id = action.payload.id || state.id || 0;
      state.login = action.payload.login || state.login || "";
      state.info = action.payload.info || state.info || "";
      state.role = action.payload.role || state.role || "UN";
      state.created_at =
        action.payload.created_at || state.created_at || String(new Date());
      state.updated_at =
        action.payload.updated_at || state.updated_at || String(new Date());
    },
    logout(state) {
      state.id = 0;
      state.login = "";
      state.role = "";
      state.info = "";
      state.created_at = "";
      state.updated_at = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserAsync.fulfilled, (state, action) => {
      userSlice.caseReducers.setUser(state, {
        type: 'user/setUser',
        payload: action.payload,
      });
    });
  },
});

export const userActions = {...userSlice.actions, updateUserAsync} ;
export const userReducer = userSlice.reducer;
