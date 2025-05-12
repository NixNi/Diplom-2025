import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerDataResponse, ServerResponse } from "../types/server";

export const modelApi = createApi({
  reducerPath: "model/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/models",
  }),
  tagTypes: ["Models"],
  endpoints: (build) => ({
    getAllModelNames: build.query<
      ServerDataResponse<{ id: number; name: string }[]>,
      void
    >({
      query: () => ({
        url: "/",
      }),
      providesTags: ["Models"],
    }),

    addModel: build.mutation<
      ServerResponse,
      { name: string; data: ArrayBuffer; settings: string }
    >({
      query: (model) => {
        const formData = new FormData();
        formData.append("name", model.name);
        formData.append("settings", model.settings);
        formData.append(
          "data",
          new Blob([model.data], { type: "application/octet-stream" })
        );

        return {
          url: "/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Models"],
    }),

    updateModelByName: build.mutation<
      ServerResponse,
      { name: string; data?: ArrayBuffer | null; settings?: string | null }
    >({
      query: ({ name, data, settings }) => {
        const formData = new FormData();
        formData.append("name", name);
        if (settings) formData.append("settings", settings);
        if (data)
          formData.append(
            "data",
            new Blob([data], { type: "application/octet-stream" })
          );
        return {
          url: `/${name}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Models"],
    }),

    deleteModelByName: build.mutation<ServerResponse, string>({
      query: (modelName) => ({
        url: `/${modelName}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Models"],
    }),
  }),
});

export const {
  useGetAllModelNamesQuery,
  useAddModelMutation,
  useUpdateModelByNameMutation,
  useDeleteModelByNameMutation,
} = modelApi;
