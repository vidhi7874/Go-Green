import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const DashboardKpiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWareHouseCount: builder.mutation({
      query: (params) => ({
        url: API.COUNT.WAREHOUSE,
        method: "GET",
        params: params,
      }),
    }),
    getInsuranceCount: builder.mutation({
      query: (params) => ({
        url: API.COUNT.INSURANCE,
        method: "GET",
        params: params,
      }),
    }),
    getActiveSecurityCount: builder.mutation({
      query: (params) => ({
        url: API.COUNT.ACTIVE_SECURITY,
        method: "GET",
        params: params,
      }),
    }),
    getCommodityHighestRateCount: builder.mutation({
      query: (params) => ({
        url: API.COUNT.COMMODITY_WITH_HIGHEST,
        method: "GET",
        params: params,
      }),
    }),
    getTotalClientCount: builder.mutation({
      query: (params) => ({
        url: API.COUNT.TOTAL_CLIENT,
        method: "GET",
        params: params,
      }),
    }),
    getOwnerMothBillingCount: builder.mutation({
      query: (params) => ({
        url: API.COUNT.OWNER_BILLING,
        method: "GET",
        params: params,
      }),
    }),
    getClientMothBillingCount: builder.mutation({
      query: (params) => ({
        url: API.COUNT.CLIENT_BILLING,
        method: "GET",
        params: params,
      }),
    }),



  }),
});



export const { useGetWareHouseCountMutation, 
  useGetInsuranceCountMutation, 
  useGetActiveSecurityCountMutation,
  useGetCommodityHighestRateCountMutation,
  useGetTotalClientCountMutation,
  useGetOwnerMothBillingCountMutation,
  useGetClientMothBillingCountMutation,
 } = DashboardKpiSlice;