
import { configureStore } from "@reduxjs/toolkit";
// import { userApi } from "./user/user.api";
// import { userReducer } from "./user/user.slice";
import { modelApi } from "./model/model.api";


export const store = configureStore({
  reducer: {
    [modelApi.reducerPath]: modelApi.reducer
    // [userApi.reducerPath]: userApi.reducer,
    // user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(modelApi.middleware)
      // .concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
