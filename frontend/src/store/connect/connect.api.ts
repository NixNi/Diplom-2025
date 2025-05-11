import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerResponse } from "../types/server"; // Предположим, что у вас есть тип ServerResponse

export const connectApi = createApi({
  reducerPath: "connect/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/connect", // Базовый URL для всех запросов
  }),
  endpoints: (build) => ({
    addConnect: build.mutation<
      ServerResponse,
      { ip: string; port: number; user?: string; password?: string }
    >({
      query: (connect) => {
        return {
          url: "/",
          method: "POST",
          body: connect,
        };
      },
    }),
    ping: build.mutation<
      ServerResponse,
      { ip: string; port: number; user?: string; password?: string }
    >({
      query: (connect) => {
        return {
          url: "/ping",
          method: "POST",
          body: connect,
        };
      },
    }),
  }),
});

export const { useAddConnectMutation, usePingMutation } = connectApi;
