import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerResponse } from "../types/server";
import answer, { answerService } from "../types/answer";

export const answerApi = createApi({
  reducerPath: "answer/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/answer",
  }),
  endpoints: (build) => ({
    GetAnswersByPostyId: build.query<answer[], number>({
      query: (id) => ({
        url: `post/${id}`,
      }),
    }),
    GetAnswersByUserId: build.query<answer[], number>({
      query: (id) => ({
        url: `user/${id}`,
      }),
    }),
    AddAnswer: build.mutation<ServerResponse, answerService>({
      query: (answer) => ({
        url: `add`,
        method: "POST",
        credentials: "include",
        body: answer,
      }),
    }),
    EditAnswer: build.mutation<ServerResponse, answerService>({
      query: (answer) => ({
        url: `edit/${answer.id}`,
        method: "POST",
        credentials: "include",
        body: answer,
      }),
    }),
  }),
});

export const {
  useAddAnswerMutation,
  useGetAnswersByPostyIdQuery,
  useEditAnswerMutation,
  useLazyGetAnswersByPostyIdQuery,
  useGetAnswersByUserIdQuery
} = answerApi;
export const {useQuerySubscription: useGetAnswersByPostyIdSubscription} = answerApi.endpoints.GetAnswersByPostyId