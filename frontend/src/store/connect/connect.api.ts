import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerResponse } from "../types/server";
import { Connection } from "../../types/connection";

export const connectApi = createApi({
  reducerPath: "connect/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/connect",
  }),
  tagTypes: ["Connections"],
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    addConnect: build.mutation<
      ServerResponse,
      { name: string; ip: string; port: string }
    >({
      query: (connect) => ({
        url: "/",
        method: "POST",
        body: connect,
      }),
      invalidatesTags: ["Connections"],
    }),
    ping: build.mutation<ServerResponse, { ip: string; port: string }>({
      query: (connect) => ({
        url: "/ping",
        method: "POST",
        body: connect,
      }),
      invalidatesTags: ["Connections"],
    }),
    getConnectionsPaginated: build.query<
      ServerResponse & { data: Connection[] },
      { page: number; perPage: number }
    >({
      query: ({ page, perPage }) => ({
        url: `/?page=${page}&perPage=${perPage}`,
        method: "GET",
      }),
      providesTags: ["Connections"],
    }),
    updateConnectionById: build.mutation<
      ServerResponse,
      { id: number; name: string; ip: string; port: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Connections"],
    }),
    deleteConnectionById: build.mutation<ServerResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections"],
    }),
  }),
});

export const {
  useAddConnectMutation,
  usePingMutation,
  useGetConnectionsPaginatedQuery,
  useUpdateConnectionByIdMutation,
  useDeleteConnectionByIdMutation,
} = connectApi;
