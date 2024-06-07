import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const commodityPricePullingMasterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommodityPriceById: builder.mutation({
      query: (id) => ({
        url: `${API.COMMODITY_PRICE_PULLING.GET_BY_ID}/${id}`,
        method: "GET",
      }),
    }),
    updateCommodityPricePulling: builder.mutation({
      query: (data) => ({
        url: `${API.COMMODITY_PRICE_PULLING.UPDATE_PRICE_PULLING}${data?.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCommodityPriceByIdMutation,
  useUpdateCommodityPricePullingMutation,
} = commodityPricePullingMasterApiSlice;
