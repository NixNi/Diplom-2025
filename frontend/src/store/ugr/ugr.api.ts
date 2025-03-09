import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ugr from "../types/ugr";
import { ServerResponse } from "../types/server";

export const ugrApi = createApi({
  reducerPath: "ugr/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/ugr",
  }),
  endpoints: (build) => ({
    GroupsByUser: build.query<ugr[], number>({
      query: (id: number) => ({
        url: `user/${id}`,
      }),
    }),
    AddGroupUser: build.mutation<ServerResponse, number>({
      query: (group: number) => ({
        url: `add/${group}`,
        credentials: "include",
        method: "GET",
      }),
    }),
    RemoveGroupUser: build.mutation<ServerResponse, number>({
      query: (group: number) => ({
        url: `remove/${group}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGroupsByUserQuery, useRemoveGroupUserMutation, useAddGroupUserMutation
} = ugrApi;
