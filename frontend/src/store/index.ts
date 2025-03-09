import { answerApi } from './answer/answer.api';
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./user/user.api";
import { userReducer } from "./user/user.slice";
import { ugrApi } from "./ugr/ugr.api";
import { groupApi } from "./group/group.api";
import { postApi } from "./post/post.api";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [ugrApi.reducerPath]: ugrApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [answerApi.reducerPath]: answerApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(ugrApi.middleware)
      .concat(groupApi.middleware)
      .concat(postApi.middleware)
      .concat(answerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
