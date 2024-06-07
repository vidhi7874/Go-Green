import { apiSlice } from "../../app/api/apiSlice";
import { API } from "../../constants/api.constants";

export const warehouseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSecurity: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_MASTER_SECURITY,
        method: "GET",
        params: params,
      }),
    }),
    getSupervisor: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_MASTER_SUPERVISOR,
        method: "GET",
        params: params,
      }),
    }),
  }),
});

export const { useGetSecurityMutation, useGetSupervisorMutation } =
  warehouseApiSlice;
