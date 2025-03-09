import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import user, { serverUserResponse, userService } from '../types/user';
import { ServerResponse } from '../types/server';

export const userApi = createApi({
  reducerPath: "user/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/user",
  }),
  endpoints: (build) => ({
    searchByLogin: build.query<user, string>({
      query: (login: string) => ({
        url: `login/${login}`,
      }),
    }),
    searchById: build.query<user, number>({
      query: (id: number) => ({
        url: `id/${id}`,
      }),
    }),
    reAuthentificate: build.query<serverUserResponse, void>({
      query: () => ({
        url: `/auth`,
        credentials: "include",
      }),
    }),
    Authentificate: build.mutation<serverUserResponse, userService>({
      query: (user) => ({
        url: `/auth`,
        method: "POST",
        body: user,
        credentials: "include",
      }),
    }),
    Update: build.mutation<ServerResponse, userService>({
      query: (user) => ({
        url: `/update`,
        method: "POST",
        body: user,
        credentials: "include",
      }),
    }),
    BanUser: build.mutation<ServerResponse, userService>({
      query: (user) => ({
        url: `/update`,
        method: "POST",
        body: { ...user, role: "BANNED" },
        credentials: "include",
      }),
    }),
    UnBanUser: build.mutation<ServerResponse, userService>({
      query: (user) => ({
        url: `/update`,
        method: "POST",
        body: { ...user, role: "USER" },
        credentials: "include",
      }),
    }),
    Register: build.mutation<ServerResponse, userService>({
      query: (user) => ({
        url: `/register`,
        method: "POST",
        body: user,
        credentials: "include",
      }),
    }),
  }),
});

export const { useSearchByLoginQuery, useSearchByIdQuery, useRegisterMutation, useAuthentificateMutation, useReAuthentificateQuery, useUpdateMutation, useBanUserMutation, useUnBanUserMutation } = userApi;