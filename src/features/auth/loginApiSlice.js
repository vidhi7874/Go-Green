import { apiSlice } from "../../app/api/apiSlice";
import { API } from "../../constants/api.constants";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: API.FORGOT_PWD,
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: API.CHANGE_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    changeCurrentPassword: builder.mutation({
      query: (data) => ({
        url: API.CHANGE_CURRENT_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useChangeCurrentPasswordMutation,
} = authApiSlice;
