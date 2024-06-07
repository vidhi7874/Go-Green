import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";
// credentials

export const warehouseReinspectionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // to fetch the bank details ...
    getAllBankListData: builder.mutation({
      query: () => ({
        url: API.DASHBOARD.BANK_MASTER_FREE,
        method: "GET",
      }),
    }),
    // to fetch the branch based on the bank name ...
    getBankBranchData: builder.mutation({
      query: (query) => ({
        url: `${API.DASHBOARD.BANK_BRANCH_MASTER_FREE}?filter=bank__bank_name&bank__bank_name=${query}`,
        method: "GET",
      }),
    }),
    // to fetch the chamber name based on the warehouse_id ...
    getChamberName: builder.mutation({
      query: (warehouse_id) => ({
        url: `${API.DASHBOARD.CHAMBER_FREE}?filter=warehouse__id&warehouse__id=${warehouse_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllBankListDataMutation,
  useGetBankBranchDataMutation,
  useGetChamberNameMutation,
} = warehouseReinspectionSlice;
