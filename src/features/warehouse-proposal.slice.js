import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const warehouseProposalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveAsDraft: builder.mutation({
      query: (data) => ({
        url: API.WAREHOUSE_PROPOSAL.SAVE_AS_DRAFT,
        method: "POST",
        body: data,
      }),
    }),
    fetchLocationDrillDown: builder.mutation({
      query: (query) => ({
        url: API.COMMON_API_END_POINTS.LOCATION_DRILL_DOWN,
        method: "GET",
        params: query,
      }),
    }),

    fetchLocationDrillDownFree: builder.mutation({
      query: (query) => ({
        url: API.COMMON_API_END_POINTS.LOCATION_DRILL_DOWN_FREE,
        method: "GET",
        params: query,
      }),
    }),
    getSupervisorDayShift: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SUPERVISOR_DAY}/${id}`,
        method: "GET",
      }),
    }),
    getSupervisorNightShift: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SUPERVISOR_NIGHT}/${id}`,
        method: "GET",
      }),
    }),

    getSecurityGuardDayShift: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SECURITY_DAY}/${id}`,
        method: "GET",
      }),
    }),
    getSecurityGuardNightShift: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SECURITY_NIGHT}/${id}`,
        method: "GET",
      }),
    }),
    getSupervisorDayShiftFree: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SUPERVISOR_DAY_FREE}/${id}`,
        method: "GET",
      }),
    }),
    getSupervisorNightShiftFree: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SUPERVISOR_NIGHT_FREE}/${id}`,
        method: "GET",
      }),
    }),

    getSecurityGuardDayShiftFree: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SECURITY_DAY_FREE}/${id}`,
        method: "GET",
      }),
    }),
    getSecurityGuardNightShiftFree: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.SECURITY_NIGHT_FREE}/${id}`,
        method: "GET",
      }),
    }),
    calculatePBPM: builder.mutation({
      query: (data) => ({
        url: API.WAREHOUSE_PROPOSAL.PBPM,
        method: "POST",
        body: data,
      }),
    }),
    minMaxAvg: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.MIN_MAX_AVG}${id}/min_max_average_rent/`,
        method: "GET",
      }),
    }),

    getWarehouseType: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.GET_WAREHOUSE_TYPE}`,
        method: "GET",
      }),
    }),
    getWarehouseSubType: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.GET_WAREHOUSE_SUB_TYPE}`,
        method: "GET",
      }),
    }),
    getWarehouseFreeType: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.GET_WAREHOUSE_TYPE_FREE}`,
        method: "GET",
      }),
    }),
    getWarehouseSubFreeType: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.GET_WAREHOUSE_SUB_TYPE_FREE}`,
        method: "GET",
      }),
    }),
    getWarehouseUnitType: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.GET_WAREHOUSE_UNIT_TYPE}`,
        method: "GET",
      }),
    }),
    getDocumentStatus: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.DOCUMENT_STATUS_TRACKER}`,
        method: "GET",
      }),
    }),
    postAssignToMe: builder.mutation({
      query: (data) => ({
        url: `${API.WAREHOUSE_PROPOSAL.ASSIGN_TO_ME}`,
        method: "POST",
        body: data,
      }),
    }),
    putApproveReject: builder.mutation({
      query: (data) => ({
        url: `${API.WAREHOUSE_PROPOSAL.ASSIGN_TO_ME}${data.id}/`,
        method: "PUT",
        body: data,
      }),
    }),

    getWarehouseProposalDetails: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_PROPOSAL.WAREHOUSE_PROPOSAL_DETAILS}${id}`,
        method: "GET",
      }),
    }),

    // warehouse/warehousehiring_proposal/420
  }),
});

export const {
  useSaveAsDraftMutation,
  useFetchLocationDrillDownMutation,
  useFetchLocationDrillDownFreeMutation,
  useGetSupervisorDayShiftMutation,
  useGetSecurityGuardDayShiftFreeMutation,
  useGetSecurityGuardNightShiftFreeMutation,
  useGetSupervisorDayShiftFreeMutation,
  useGetSupervisorNightShiftFreeMutation,
  useGetSupervisorNightShiftMutation,

  useGetSecurityGuardDayShiftMutation,
  useGetSecurityGuardNightShiftMutation,

  useCalculatePBPMMutation,
  useMinMaxAvgMutation,

  useGetWarehouseTypeMutation,
  useGetWarehouseSubTypeMutation,

  useGetWarehouseFreeTypeMutation,
  useGetWarehouseSubFreeTypeMutation,

  useGetWarehouseUnitTypeMutation,
  useGetDocumentStatusMutation,
  useGetWarehouseProposalDetailsMutation,
  usePostAssignToMeMutation,
  usePutApproveRejectMutation,
} = warehouseProposalApiSlice;
