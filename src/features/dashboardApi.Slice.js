import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";
// credentials

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverAllPerformances: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.OVERALL_PERFORMANCE,
        method: "GET",
      }),
    }),
    getPackagePerformances: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.PACKAGE_PERFORMANCE,
        method: "GET",
        params: { ...params },
      }),
    }),

    getHotelPerformances: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.HOTEL_PERFORMANCE,
        method: "GET",
        params: { ...params },
      }),
    }),
    getSightseeingPerformances: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SIGHTSEEING_PERFORMANCE,
        method: "GET",
        params: { ...params },
      }),
    }),
  }),
});

export const {
  useGetOverAllPerformancesMutation,
  useGetPackagePerformancesMutation,
  useGetHotelPerformancesMutation,
  useGetSightseeingPerformancesMutation,
} = dashboardApiSlice;
