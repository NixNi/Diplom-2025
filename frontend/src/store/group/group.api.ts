import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerResponse } from "../types/server";
import group, { groupService } from "../types/group";

export const groupApi = createApi({
  reducerPath: "group/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/group",
  }),
  endpoints: (build) => ({
    GetGroupById: build.query<group, number>({
      query: (id) => ({
        url: `id/${id}`,
      }),
    }),
    GetGroupByName: build.query<group, string>({
      query: (name) => ({
        url: `name/${name}`,
      }),
    }),
    AddGroup: build.mutation<ServerResponse, groupService>({
      query: (group) => ({
        url: `add`,
        method: "POST",
        credentials: "include",
        body: group,
      }),
    }),
    RemoveGroup: build.mutation<ServerResponse, groupService>({
      query: (group) => ({
        url: `remove`,
        method: "POST",
        credentials: "include",
        body: group,
      }),
    }),
    UpdateGroup: build.mutation<ServerResponse, groupService>({
      query: (group) => ({
        url: `edit/${group.id}`,
        method: "POST",
        credentials: "include",
        body: group,
      }),
    }),
  }),
});

export const {
  useGetGroupByNameQuery,
  useLazyGetGroupByNameQuery,
  useAddGroupMutation,
  useRemoveGroupMutation,
  useGetGroupByIdQuery,
  useUpdateGroupMutation,
} = groupApi;
