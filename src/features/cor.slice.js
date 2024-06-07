import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const CORApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCOR: builder.mutation({
      query: (params) => ({
        url: API.COR.COR,
        method: "GET",
        params: params,
      }),
    }),
    getCORFree: builder.mutation({
      query: (params) => ({
        url: API.COR.COR_FREE,
        method: "GET",
        params: params,
      }),
    }),
    getCORGatepass: builder.mutation({
      query: (params) => ({
        url: API.COR.GATE_PASS_COR,
        method: "GET",
        params: params,
      }),
    }),
    createCOR: builder.mutation({
      query: (data) => ({
        url: API.COR.COR_CREATE,
        method: "POST",
        body: data,
      }),
    }),
    fetchCOR: builder.mutation({
      query: (data) => ({
        url: `${API.COR.COR}/${data?.cor_id}`,
        method: "GET",
      }),
    }),
    updateCOR: builder.mutation({
      query: (data) => ({
        url: `${API.COR.COR_CREATE}${data?.id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    postMultipleCORToMe: builder.mutation({
      query: (data) => ({
        url: `${API.COR.ASSIGN_TO_ME}`,
        method: "POST",
        body: data,
      }),
    }),
    corAssignApproveReject: builder.mutation({
      query: (data) => ({
        url: `${API.COR.COR_ASSIGN}${data?.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  // These is my gate pass cofiguration mutation start
  useGetCORMutation,
  useGetCORFreeMutation,
  useGetCORGatepassMutation,
  useCreateCORMutation,
  useFetchCORMutation,
  useUpdateCORMutation,
  usePostMultipleCORToMeMutation,
  useCorAssignApproveRejectMutation,
} = CORApiSlice;
