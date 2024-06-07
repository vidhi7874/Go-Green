import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const DOApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDO: builder.mutation({
      query: (params) => ({
        url: API.DO.GET,
        method: "GET",
        params: params,
      }),
    }),
    assignToMe: builder.mutation({
      query: (data) => ({
        url: API.DO.ASSIGN_TO_ME,
        method: "POST",
        body: data,
      }),
    }),
    // getStackDetails: builder.mutation({
    //   query: (params) => ({
    //     url: API.DO.STACK_GET,
    //     method: "GET",
    //     params: params,
    //   }),
    // }),
    getMTBagDetails: builder.mutation({
      query: (params) => ({
        url: API.DO.MT_BAG_GET,
        method: "GET",
        params: params,
      }),
    }),
    // query: (id) => ({
    //   url: `${API.DASHBOARD.WAREHOUSE_OWNER_MASTER}${id}/`,
    //   method: "GET",
    // }),

    postDOSubmit: builder.mutation({
      query: (data) => ({
        url: API.DO.POST,
        method: "POST",
        body: data,
      }),
    }),
    fetchDOById: builder.mutation({
      query: (data) => ({
        url: `${API.DO.GET}${data?.id}`,
        method: "GET",
      }),
    }),

    // api for the stack details ....
    fetchStackNumber: builder.mutation({
      query: (cir_no) => ({
        url: `${API.DO.STACK_NUMBER_FOR_LOT}?cir=${cir_no}`,
        method: "GET",
      }),
    }),

    // rtk hook for the assign to me do section (L1..)...
    assignDo: builder.mutation({
      query: (data) => ({
        url: `${API.DO.ASSIGN_TO_ME_DO__SECTION}/${data?.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    //edit the do
    updateDo: builder.mutation({
      query: (data) => ({
        url: `${API.DO.PATCH}/${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // api for the lot details based on the stack number ...
    fetchLotsDataBasedOnStack: builder.mutation({
      query: (data) => ({
        url: `${API.DO.GET_ALL_LOTS_ON_STACK}?cir=${data.cir_id}&stack_number=${data.stack_number}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  // These is my gate pass cofiguration mutation start
  useGetDOMutation,
  useGetMTBagDetailsMutation,
  useFetchDOByIdMutation,
  useAssignToMeMutation,
  useUpdateDoMutation,
  useAssignDoMutation, // to assign api
  useFetchStackNumberMutation, // get the stack data based on the cir number .
  useFetchLotsDataBasedOnStackMutation, // for the lots details based on the stack number ..
  usePostDOSubmitMutation, // for the submit btn api call in the DO..
  //These is my gate pass configuration mutation end
} = DOApiSlice;
