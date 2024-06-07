import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";
import { localStorageService } from "../../services/localStorge.service";
import configuration from "../../config/configuration";
import { toasterAlert } from "../../services/common.service";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://192.168.0.124:8000/",
  // baseUrl: process.env.REACT_APP_API_BASE_URL_LOCAL,
  // baseUrl: process.env.REACT_APP_API_BASE_URL_LOCAL,
  baseUrl: configuration.BASE_URL,
  // baseUrl: "http://192.168.0.186:8003/",

  // credentials: "include",
  mode: "cors",

  prepareHeaders: (headers, { getState }) => {
    const token =
      localStorageService.get("GG_ADMIN")?.userDetails?.token?.access;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  console.log("api error ---> ", result?.error);

  if (result?.error?.status === 400) {
    toasterAlert(result?.error);
    // api.dispatch(logOut());
  }

  if (result?.error?.status === 403) {
    // api.dispatch(logOut());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
