import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const QCRApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQCR: builder.mutation({
      query: (params) => ({
        url: API.QCR.GET,
        method: "GET",
        params: params,
      }),
    }),
    // query: (id) => ({
    //   url: `${API.DASHBOARD.WAREHOUSE_OWNER_MASTER}${id}/`,
    //   method: "GET",
    // }),
    getQCRById: builder.mutation({
      query: (id) => ({
        url: `${API.QCR.GET}${id}/`,
        method: "GET",
      }),
    }),
    addQCR: builder.mutation({
      query: (data) => ({
        url: `${API.QCR.POST}${data?.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    assignQCR: builder.mutation({
      query: (data) => ({
        url: `${API.QCR.PATCH}${data?.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    postMultipleCirToMe: builder.mutation({
      query: (data) => ({
        url: `${API.QCR.ASSIGN_TO_ME}`,
        method: "POST",
        body: data,
      }),
    }),
    assignWarehouseContarct: builder.mutation({
      query: (data) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.WAREHOUSE_CLIENT_ASSIGN}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  // These is my gate pass cofiguration mutation start
  useGetQCRMutation,
  useGetQCRByIdMutation,
  useAddQCRMutation,
  useAssignQCRMutation,
  usePostMultipleCirToMeMutation,
  //These is my gate pass configuration mutation end
} = QCRApiSlice;
