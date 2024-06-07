import { apiSliceSuperset } from "../app/api/apiSliceSuperset";
import { API } from "../constants/api.constants";

export const supersetApiSlice = apiSliceSuperset.injectEndpoints({
  endpoints: (builder) => ({
    postSuperset: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.SUPERSET_DASHBOARD,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostSupersetMutation } = supersetApiSlice;
