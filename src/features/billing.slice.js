import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const BillingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerBilling: builder.mutation({
      query: (params) => ({
        url: API.BILLING.OWNER_BILLING,
        method: "GET",
        params: params,
      }),
    }),
    getClientBilling: builder.mutation({
      query: (params) => ({
        url: API.BILLING.CLIENT_BILLING,
        method: "GET",
        params: params,
      }),
    }),
    getOtherBilling: builder.mutation({
      query: (params) => ({
        url: API.BILLING.OTHER_BILLING,
        method: "GET",
        params: params,
      }),
    }), getOtherBillingById: builder.mutation({
      query: (id) => ({
        url: `${API.BILLING.OTHER_BILLING}${id}/`,
        method: "GET",
      }),
    }),
    postOtherBilling: builder.mutation({
      query: (data) => ({
        url: API.BILLING.OTHER_BILLING,
        method: "POST",
        body: data,
      }),
    }),


    postOtherReGenrateBilling: builder.mutation({
      query: (data) => ({
        url: API.BILLING.REGENERATE_BILLING,
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  // These is my gate pass cofiguration mutation start
  useGetOwnerBillingMutation,
  useGetClientBillingMutation,
  useGetOtherBillingMutation,
  usePostOtherBillingMutation,
  useGetOtherBillingByIdMutation,
  usePostOtherReGenrateBillingMutation,
  //These is my gate pass configuration mutation end
} = BillingApiSlice;
