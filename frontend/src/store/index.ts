import { Action, ThunkDispatch, configureStore } from "@reduxjs/toolkit";
// import { userApi } from "./user/user.api";
// import { userReducer } from "./user/user.slice";
import { modelApi } from "./model/model.api";
import { modelReducer } from "./model/model.slice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    [modelApi.reducerPath]: modelApi.reducer,
    model: modelReducer,
    // [userApi.reducerPath]: userApi.reducer,
    // user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["model/updateModelDataAsync/fulfilled"],
      },
    }).concat(modelApi.middleware),
  // .concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>();
