import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const CIRApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCIR: builder.mutation({
      query: (params) => ({
        url: API.CIR.CIR,
        method: "GET",
        params: params,
      }),
    }),
    getCIRFree: builder.mutation({
      query: (params) => ({
        url: API.CIR.CIR_FREE,
        method: "GET",
        params: params,
      }),
    }),
    getWHRFree: builder.mutation({
      query: (params) => ({
        url: API.CIR.WHR_FREE,
        method: "GET",
        params: params,
      }),
    }),
    createCIR: builder.mutation({
      query: (data) => ({
        url: API.CIR.CIR_CREATE,
        method: "POST",
        body: data,
      }),
    }),
    updateCIR: builder.mutation({
      query: (data) => ({
        url: `${API.CIR.CIR_CREATE}${data?.id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    fetchCIR: builder.mutation({
      query: (params) => ({
        url: `${API.CIR.CIR_CREATE}${params?.id}`,
        method: "GET",
        // params: params,
      }),
    }),
    postCIR: builder.mutation({
      query: (data) => ({
        url: API.CIR.CIR,
        method: "POST",
        body: data,
      }),
    }),
    postMultipleToMe: builder.mutation({
      query: (data) => ({
        url: `${API.CIR.ASSIGN_TO_ME}`,
        method: "POST",
        body: data,
      }),
    }),
    putCIR: builder.mutation({
      query: (data) => ({
        url: `${API.CIR.CIR}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    getInsurancePolicyNumber: builder.mutation({
      query: (params) => ({
        url: `${API.CIR.POLICY_NO}`,
        method: "GET",
        params: params,
      }),
    }),
    getMarketRate: builder.mutation({
      query: (params) => ({
        url: `${API.CIR.GET_MARKET_VALUE}`,
        method: "GET",
        params: params,
      }),
    }),
    cirAssignApproveReject: builder.mutation({
      query: (data) => ({
        url: `${API.CIR.CIR_ASSIGN}${data?.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  // These is my gate pass cofiguration mutation start
  useGetCIRMutation,
  useGetCIRFreeMutation,
  useGetWHRFreeMutation,
  useCreateCIRMutation,
  useUpdateCIRMutation,
  usePostCIRMutation,
  usePutCIRMutation,
  usePostMultipleToMeMutation,
  useGetInsurancePolicyNumberMutation,
  useFetchCIRMutation,
  useGetMarketRateMutation,
  useCirAssignApproveRejectMutation,
} = CIRApiSlice;
