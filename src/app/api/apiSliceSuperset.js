// // this is my apiSliceSuperset.js

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setCredentials, logOut } from "../../features/auth/authSlice";
// import { localStorageService } from "../../services/localStorge.service";

// const baseQuery = fetchBaseQuery({
// baseUrl: configuration.SUPERSET_BASE_URL,

//   mode: "cors",

//   prepareHeaders: (headers, { getState }) => {
//     // const token = localStorageService.get("GG_ADMIN_SUPERSET")?.access;

//     // if (token) {
//     //   headers.set("authorization", `Bearer ${token}`);
//     // }
//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   console.log("api error ---> ", result);

//   if (result?.error?.status === 403) {
//     // api.dispatch(logOut());
//   }

//   return result;
// };

// export const apiSliceSuperset = createApi({
//   baseQuery: baseQueryWithReauth,
//   endpoints: (builder) => ({}),
// });

import axios from "axios";
import { localStorageService } from "../../services/localStorge.service";
import configuration from "../../config/configuration";

const Axios = axios.create({
  baseURL: configuration.SUPERSET_BASE_URL,
});

if (localStorageService.get("Tokens")?.access_token) {
  var { access_token } = localStorageService.get("Tokens");
  console.log("token===========>", access_token);
}

if (access_token) {
  console.log("index alerte in intersepter");

  Axios.interceptors.request.use((value) => {
    value.headers = {
      Authorization: `Bearer ${access_token}`,
    };
    return value;
  });
}

export default Axios;
