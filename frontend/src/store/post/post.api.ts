import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerResponse } from "../types/server";
import post, { postService } from "../types/post";


export const postApi = createApi({
  reducerPath: "post/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/post",
  }),
  endpoints: (build) => ({
    GetPostById: build.query<post, number>({
      query: (id) => ({
        url: `id/${id}`,
      }),
    }),
    GetPostsByUser: build.query<post[], number>({
      query: (id) => ({
        url: `user/${id}`,
      }),
    }),
    GetPostsByGroup: build.query<post[], number>({
      query: (id) => ({
        url: `group/${id}`,
      }),
    }),
    GetPostsSBD: build.query<post[], void>({
      query: () => ({
        url: `sorted-by-date`,
      }),
    }),
    AddPost: build.mutation<ServerResponse, postService>({
      query: (post) => ({
        url: `create`,
        method: "POST",
        credentials: "include",
        body: post,
      }),
    }),
    UpdatePost: build.mutation<ServerResponse, postService>({
      query: (post) => ({
        url: `update`,
        method: "POST",
        credentials: "include",
        body: post,
      }),
    }),
    DeletePost: build.mutation<ServerResponse, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAddPostMutation,
  useGetPostsByGroupQuery,
  useGetPostsByUserQuery,
  useGetPostsSBDQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation
} = postApi;
