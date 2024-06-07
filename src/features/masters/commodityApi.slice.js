import { apiSlice } from "../../app/api/apiSlice";
import { API } from "../../constants/api.constants";
// credentials

export const commodityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // start district-master get add update mutation
    getAllQuality: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY.GET_ALL_QUALITY,
        method: "GET",
        params: params,
      }),
    }),

    addAllQuality: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.COMMODITY.GET_ALL_QUALITY,
        method: "POST",
        body: data,
      }),
    }),
    updateAllQuality: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY.GET_ALL_QUALITY}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  // Api mutation for district master starts
  useGetAllQualityMutation,
  useAddAllQualityMutation,
  useUpdateAllQualityMutation,
} = commodityApiSlice;
