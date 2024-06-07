import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const ServiceContractApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServiceContractById: builder.mutation({
      query: (id) => ({
        url: `${API.SERVICE_CONTRACT.SERVICE_CONTRACT}${id}`,
        method: "GET",
      }),
    }),
    getServiceContract: builder.mutation({
      query: (params) => ({
        url: API.SERVICE_CONTRACT.SERVICE_CONTRACT,
        method: "GET",
        params: params,
      }),
    }),
    getServiceContractFree: builder.mutation({
      query: (params) => ({
        url: API.SERVICE_CONTRACT.SERVICE_CONTRACT_FREE,
        method: "GET",
        params: params,
      }),
    }),
    getAllClients: builder.mutation({
      query: (params) => ({
        url: API.SERVICE_CONTRACT.FETCH_ALL_CLIENT,
        method: "GET",
      }),
    }),
    postServiceContract: builder.mutation({
      query: (data) => ({
        url: API.SERVICE_CONTRACT.SERVICE_CONTRACT,
        method: "POST",
        body: data,
      }),
    }),

    postMultipleAssignServiceContract: builder.mutation({
      query: (data) => ({
        url: API.SERVICE_CONTRACT.SERVICE_CONTRACT_MULTIPLE_ASSIGN,
        method: "POST",
        body: data,
      }),
    }),

    updateServiceContract: builder.mutation({
      query: (data) => ({
        url: `${API.SERVICE_CONTRACT.SERVICE_CONTRACT}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getServiceContractById: builder.mutation({
      query: (id) => ({
        url: `${API.SERVICE_CONTRACT.SERVICE_CONTRACT}${id}/`,
        method: "GET",
      }),
    }),

    assignServiceContract: builder.mutation({
      query: (data) => ({
        url: `${API.SERVICE_CONTRACT.SERVICE_CONTRACT_ASSIGN}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    assignWarehouseContarct: builder.mutation({
      query: (data) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.WAREHOUSE_CLIENT_ASSIGN}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    fetchBagWiseDetails: builder.mutation({
      query: (data) => {
        console.log(data);
        return {
          url: `${API.SERVICE_CONTRACT.FETCH_BAG_WISE_RATES}${data?.id}/pbpm_list_from_warehouse/`,
          method: "GET",
          params: data?.bag_size ? { bag_size: data?.bag_size } : "",
        };
      },
    }),
  }),
});

export const {
  // Api mutaton for the Servicecontarct WMS And PWh Listing Start
  useGetServiceContractByIdMutation,
  useGetServiceContractMutation,
  useGetServiceContractFreeMutation,
  useGetAllClientsMutation,
  usePostServiceContractMutation,
  usePostMultipleAssignServiceContractMutation,
  useUpdateServiceContractMutation,
  useAssignServiceContractMutation,
  useAssignWarehouseContarctMutation,
  useFetchBagWiseDetailsMutation,
  // Api mutation for the Servicecontract WMS And PWh Listing End
} = ServiceContractApiSlice;
