import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const GatePassApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGatePass: builder.mutation({
      query: (params) => ({
        url: API.GET_PASS.GET_PASS,
        method: "GET",
        params: params,
      }),
    }),

    getGatePassOutward: builder.mutation({
      query: (params) => ({
        url: API.GET_PASS.GET_PASS_OUT_WARD,
        method: "GET",
        params: params,
      }),
    }),

    getGatePassById: builder.mutation({
      query: (id) => ({
        url: `${API.GET_PASS.GET_PASS}${id}`,
        method: "GET",
      }),
    }),
    getGatePassOutwardById: builder.mutation({
      query: (id) => ({
        url: `${API.GET_PASS.GET_PASS_OUT_WARD}${id}`,
        method: "GET",
      }),
    }),
    postGatePass: builder.mutation({
      query: (data) => ({
        url: API.GET_PASS.GET_PASS,
        method: "POST",
        body: data,
      }),
    }),
    postGatePassOutward: builder.mutation({
      query: (data) => ({
        url: API.GET_PASS.GET_PASS_OUT_WARD,
        method: "POST",
        body: data,
      }),
    }),

    putGatePass: builder.mutation({
      query: (data) => ({
        url: `${API.GET_PASS.GET_PASS}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    putGatePassOutWard: builder.mutation({
      query: (data) => ({
        url: `${API.GET_PASS.GET_PASS_OUT_WARD}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getAllDO: builder.mutation({
      query: (params) => ({
        url: `${API.GET_PASS.DO_NO}`,
        method: "GET",
        params: params,
      }),
    }),
    getOutwardGatepassDo: builder.mutation({
      query: (params) => ({
        url: `${API.GET_PASS.OUTWARD_GATEPASS}`,
        method: "GET",
        params: params,
      }),
    }),
    getQualityParameter: builder.mutation({
      query: (id) => ({
        url: `${API.DASHBOARD.COMMODITY_MASTER_FREE}${id}`,
        method: "GET",
      }),
    }),
  }),
});
// outward_gatepass_do_status

export const {
  // These is my gate pass cofiguration mutation start
  useGetGatePassMutation,
  useGetGatePassByIdMutation,
  useGetGatePassOutwardByIdMutation,
  usePostGatePassMutation,
  usePutGatePassMutation,
  usePutGatePassOutWardMutation,
  useGetAllDOMutation,
  useGetOutwardGatepassDoMutation,
  useGetQualityParameterMutation,
  usePostGatePassOutwardMutation,
  useGetGatePassOutwardMutation,
  //These is my gate pass configuration mutation end
} = GatePassApiSlice;
