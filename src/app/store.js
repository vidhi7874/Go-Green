import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
// import { apiSliceSuperset } from "./api/apiSliceSuperset";
//import { boltApiSlice } from "./api/boltApiSlice";
import authReducer from "../features/auth/authSlice";
import dataTableFiltersSlice from "../features/filter.slice";
import manageBreadcrumbSlice from "../features/manage-breadcrumb.slice";

export const store = configureStore({
  reducer: {
    // [apiSliceSuperset.reducerPath]: apiSliceSuperset.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    //   [boltApiSlice.reducerPath]: boltApiSlice.reducer,
    auth: authReducer,
    dataTableFiltersReducer: dataTableFiltersSlice,
    manageBreadcrumbReducer: manageBreadcrumbSlice,
  },
  middleware: (getDefaultMiddleware) => {
    const midd = getDefaultMiddleware().concat(apiSlice?.middleware);
    // getDefaultMiddleware().concat(apiSlice1.middleware, apiSlice2.middleware),
    // console.log("middleware form store.js -->", midd);
    return midd;
  },
  devTools: true,
  // devTools: process.env.NODE_ENV !== "production",
});
