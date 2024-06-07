import { apiSlice } from "../../app/api/apiSlice";
import { API } from "../../constants/api.constants";

export const signupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: API.SIGNUP,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useSignupMutation } = signupApiSlice;
