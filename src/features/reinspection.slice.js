import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const ReInspectionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReInspection: builder.mutation({
      query: (params) => ({
        url: API.REINSPECTION_MASTER.CREATE,
        method: "GET",
        params: params,
      }),
    }),
    getReInspectionByID: builder.mutation({
      query: (data) => ({
        url: `${API.REINSPECTION_MASTER.CREATE}${data.id}`,
        method: "GET",
      }),
    }),
    // fetching data for the re inspection on the bases on the warehouse ID...
    getReInspectionAllData: builder.mutation({
      query: (data) => ({
        url: `${API.REINSPECTION_MASTER.RE_INSPECTION_MASTER_FETCH_DATA}${
          data.warehouse
        }?isreinspection=true&bank=${data.bank}&bank_branch=${
          data.branch
        }&chamber=${data.chamber ? data.chamber : null}&is_chamberwise=${
          data.inspectionType === "chamber_wise" ? true : false
        }`,
        method: "GET",
      }),
    }),

    //
    postReInspectionCreate: builder.mutation({
      query: (data) => ({
        url: API.REINSPECTION_MASTER.CREATE,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  // These is my gate pass cofiguration mutation start
  useGetReInspectionMutation,
  useGetReInspectionByIDMutation,
  usePostReInspectionCreateMutation,
  useGetReInspectionAllDataMutation, // mutation to fetch all the re-Inspection data using the warehouse ID..
} = ReInspectionApiSlice;
