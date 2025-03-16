import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerDataResponse, ServerResponse } from "../types/server"; // Предположим, что у вас есть тип ServerResponse

export const modelApi = createApi({
  reducerPath: "model/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/models", // Базовый URL для всех запросов
  }),
  endpoints: (build) => ({
    getAllModelNames: build.query<
      ServerDataResponse<{ id: number; name: string }[]>,
      void
    >({
      query: () => ({
        url: "/",
      }),
    }),

    // getModelByName: build.query<ArrayBuffer, string>({
    //   query: (modelName: string) => ({
    //     url: `/${modelName}`,
    //     responseHandler: async (response) => {
    //       const buffer = await response.arrayBuffer();
    //       return buffer;
    //     },
    //   }),
    // }),
    // getModelByName: build.query<ServerResponse, string>({
    //   query: (modelName) => ({
    //     url: `/${modelName}`,
    //   }),
    // }),

    addModel: build.mutation<
      ServerResponse,
      { name: string; data: ArrayBuffer }
    >({
      query: (model) => {
        const formData = new FormData();
        formData.append("name", model.name);
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
    }),

    updateModelByName: build.mutation<
      ServerResponse,
      { modelName: string; data: ArrayBuffer }
    >({
      query: ({ modelName, data }) => ({
        url: `/${modelName}`,
        method: "PUT",
        body: { data },
      }),
    }),

    deleteModelByName: build.mutation<ServerResponse, string>({
      query: (modelName) => ({
        url: `/${modelName}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllModelNamesQuery,
  //   useGetModelByNameQuery,
  useAddModelMutation,
  useUpdateModelByNameMutation,
  useDeleteModelByNameMutation,
} = modelApi;
