import { connectReducer } from "./connect/connect.slice";
import { Action, ThunkDispatch, configureStore } from "@reduxjs/toolkit";
import { modelApi } from "./model/model.api";
import { modelReducer } from "./model/model.slice";
import { useDispatch } from "react-redux";
import { connectApi } from "./connect/connect.api";

export const store = configureStore({
  reducer: {
    [modelApi.reducerPath]: modelApi.reducer,
    model: modelReducer,
    [connectApi.reducerPath]: connectApi.reducer,
    connect: connectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["model/updateModelDataAsync/fulfilled"],
      },
    })
      .concat(modelApi.middleware)
      .concat(connectApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>();
