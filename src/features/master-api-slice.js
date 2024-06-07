import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";
// credentials

export const masterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // start district-master get add update mutation
    getDistrictMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.DISTRICT_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getDistrictFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.DISTRICT_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),
    addDistrictMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.DISTRICT_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateDistrictMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.DISTRICT_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // end district-master get add update mutation

    getPrimaryCommodityType: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.PRIMARY_COMMODITY_TYPE,
        method: "GET",
        params: params,
      }),
    }),

    // start state-master get add update mutation
    getStateMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.STATE_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getStateByIdMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.STATE_MASTER}${data.id}`,
        method: "GET",
      }),
    }),
    getStateFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.STATE_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),
    addStateMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.STATE_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateStateMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.STATE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // end state-master get add update mutation

    // start Zone-Master get add update mutation methods
    getZoneMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SUBSTATE_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getZoneByIdMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.SUBSTATE_MASTER}${data.id}`,
        method: "GET",
      }),
    }),
    getZoneFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SUBSTATE_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),
    addZoneMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.SUBSTATE_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateZoneMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.SUBSTATE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // start Zone-Master get add update mutation methods
    getBankMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.BANK_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getBankMasterFree: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.BANK_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),
    getBankMasterDetailsById: builder.mutation({
      query: (id) => ({
        url: `${API.DASHBOARD.BANK_MASTER}${id}`,
        method: "GET",
      }),
    }),

    addBankMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.BANK_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateBankMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.BANK_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getBankMasterSector: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.BANK_MASTER_SECTOR,
        method: "GET",
        params: params,
      }),
    }),
    getBankBranchMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.BANK_BRANCH_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getBankBranchMasterFree: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.BANK_BRANCH_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),

    // start earthquack-master get add update mutation methods
    addBankBranchMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.BANK_BRANCH_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateBankBranchMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.BANK_BRANCH_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    getEarthQuakeZoneTypeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.EARTHQUAKE_ZONE_TYPE_MASTER,
        method: "GET",
        params: params,
      }),
    }),

    getEarthQuakeZoneFreeTypeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.EARTHQUAKE_ZONE_TYPE_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),
    addEarthQuakeZoneTypeMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.EARTHQUAKE_ZONE_TYPE_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateEarthQuakeZoneTypeMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.EARTHQUAKE_ZONE_TYPE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // start client-master get add update mutation methods
    getClientMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.CLIENT_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    addClientMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.CLIENT_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateClientMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.CLIENT_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // start client-gst-master get add update mutation methods

    getClientGstMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.CLIENT_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    addClientGstMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.CLIENT_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateGstClientMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.CLIENT_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    //start Insurance-Master get add update mutation methods
    getInsuranceCompanyMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.INSURANCE_COMPANY_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    addInsuranceCompanyMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.INSURANCE_COMPANY_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateInsuranceCompanyMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.INSURANCE_COMPANY_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // Insurance POlicy MAster Add edit Update Start
    getInsurancePolicyMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.INSURANCE_POLICY_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    addInsurancePolicyMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.INSURANCE_POLICY_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateInsurancePolicyMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.INSURANCE_POLICY_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // Insurance Policy Master Add Edit update Master End
    getRegionFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.REGION_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),
    getRegionMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.REGION_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getRegionByIdMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.REGION_MASTER}${data.id}`,
        method: "GET",
      }),
    }),
    updateRegionMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.REGION_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    addRegionMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.REGION_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    getAreaMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.AREA_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getAreaFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.AREA_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),
    updateAreaMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.AREA_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    addAreaMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.AREA_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    // commodity type master add edit update start
    getCommodityFreeTypeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_TYPE_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),

    getCommodityTypeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_TYPE_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    updateCommodityTypeMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY_TYPE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    addCommodityTypeMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.COMMODITY_TYPE_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    //commodity type master add update edit end

    //commodity grade master add edit update start
    getCommodityGrade: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_GRADE,
        method: "GET",
        params: params,
      }),
    }),
    updateCommodityGrade: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY_GRADE}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    addCommodityGrade: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.COMMODITY_GRADE,
        method: "POST",
        body: data,
      }),
    }),
    // start Commodity-Master get add update mutation methods

    getStackFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.STACK_FREE,
        method: "GET",
        params: params,
      }),
    }),

    getCommodityFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_MASTER_FREE,
        method: "GET",
        params: params,
      }),
    }),

    getCommodityVarityFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_VARITY_FREE,
        method: "GET",
        params: params,
      }),
    }),

    getCommodityMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getCommodityIDMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY_MASTER}${data.id}/`,
        method: "GET",
      }),
    }),
    addCommodityMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY_MASTER}`,
        method: "POST",
        body: data,
      }),
    }),
    updateCommodityMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // end Commodity-Master add update mutation methods

    // start Commodity price pulling Master get add update mutation methods
    getCommodityPricePulling: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_PRICE_PULLING,
        method: "GET",
        params: params,
      }),
    }),

    pricePullingpostFileUpload: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.COMMODITY_EXCEL_UPLOAD,
        method: "POST",
        body: data,
      }),
      // onError: (error) => {
      //   console.log("API Error:", error);
      //   // Dispatch actions, show notification, etc.
      // },
    }),

    // end Commodity price pulling Master add update mutation methods

    //start page master get add update mutation methods
    getPageMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.PAGE_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getPageFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.PAGE_FREE_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addPageMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.PAGE_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updatePageMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.PAGE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // end page master get add update mutation method
    // Start Role master get add mutation method
    getRoleMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.ROLE_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getRoleFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.ROLE_MASTER_FREE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getRoleIdMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.ROLE_MASTER}${data.id}/`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addRoleMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.ROLE_MASTER}`,
        method: "POST",
        body: data,
      }),
    }),
    updateRoleMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.ROLE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // End  Role Master Update Add get Mutation
    getRolePageAssignmentMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.ROLE_PAGE_ASSIGNMENT_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getDesignationMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.DESIGNATION_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getDesignationFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.DESIGNATION_MASTER_FREE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getUserMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.USER_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getUserFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.USER_MASTER_FREE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getWarehouseUserTransferMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_USER_TRANSFER_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    addWarehouseUserTransferMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.WAREHOUSE_USER_TRANSFER_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    addUserMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.USER_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateUserMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.USER_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    getEmployeeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.EMPLOYEE_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    addEmployeeMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.EMPLOYEE_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateEmployeeMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.EMPLOYEE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getDepartmentMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.DEPARTMENT_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    addDepartmentMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.DEPARTMENT_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateDepartmentMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.DEPARTMENT_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getHiringProposalMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.HIRING_PROPOSAL_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    addHiringProposalMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.HIRING_PROPOSAL_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateHiringProposalMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.HIRING_PROPOSAL_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getInspectionMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.INSPECTION_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getInspectionDetailMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.INSPECTION_MASTER}${data}/`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addInspectionMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.INSPECTION_MASTER,
        method: "POST",
        body: data,
      }),
    }),

    multipleAssignInspectionMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.INSPECTION_MULTIPLE_ASSIGN_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateInspectionMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.INSPECTION_ASSIGN_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getCommodityVariety: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_VARIETY,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    updateCommodityVariety: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY_VARIETY}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addCommodityVariety: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.COMMODITY_VARIETY,
        method: "POST",
        body: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    //start Quality-parameter get add update mutation methods
    getQualityParameterMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.QUALITY_PARAMETER_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    addQualityParameterMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.QUALITY_PARAMETER_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateQualityParameterMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.QUALITY_PARAMETER_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // End Quality-parameter get add update mutation methods

    //warehouse sub type get add update mutation start
    getWareHouseSubType: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_SUB_TYPE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addWareHouseSubType: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.WAREHOUSE_SUB_TYPE,
        method: "POST",
        body: data,
      }),
    }),
    updateWareHouseSubType: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.WAREHOUSE_SUB_TYPE}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    //warehouse sub type get add update mutation end

    //warehouse master get mutation start

    getWareHouse: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getWareHouseFree: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_MASTER_FREE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getWareHouseOwnerFree: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_OWNER_MASTER_FREE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getChamberFree: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.CHAMBER_FREE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getWareHouseById: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.WAREHOUSE_MASTER}${data.id}/`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    updateWareHouseAgreementRenewalById: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.WAREHOUSE_AGREEMENT_RENEWAL}${data.id}/`,
        method: "PATCH",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    //warehouse master get mutation end

    getWareOwnerDocType: builder.mutation({
      query: (params) => ({
        url: `${API.DASHBOARD.WAREHOUSE_OWNER_DOCUMENT_TYPE}`,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getOwnerType: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_OWNER_TYPE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    //warehouse owner type get add update mutation start
    getWareHouseOwnerType: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_OWNER_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getWareHouseOwnerTypeById: builder.mutation({
      query: (id) => ({
        url: `${API.DASHBOARD.WAREHOUSE_OWNER_MASTER}${id}/`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addWareHouseOwnerType: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.WAREHOUSE_OWNER_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateWareHouseOwnerType: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.WAREHOUSE_OWNER_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    //warehouse owner type get add update mutation end

    // WareHouseClientMaster get add update mutation start
    getWareHouseClient: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_CLIENT_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    fetchWareHouseClientById: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.POST}${id}`,
        method: "GET",
      }),
    }),

    addWareHouseClient: builder.mutation({
      query: (data) => ({
        url: API.WAREHOUSE_CLIENT_MASTER.POST,
        method: "POST",
        body: data,
      }),
    }),

    allMultipleAssignmentWareHouseClient: builder.mutation({
      query: (data) => ({
        url: API.WAREHOUSE_CLIENT_MASTER.WAREHOUSE_CLIENT_MULTIPLE_ASSIGN,
        method: "POST",
        body: data,
      }),
    }),

    updateWareHouseClient: builder.mutation({
      query: (data) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.PATCH}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // WarehouseClientMaster get add update mutation end
    // start security agency get add update mutation methods
    getSecurityAgencyMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SECURITY_AGENCY_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addSecurityAgencyMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.SECURITY_AGENCY_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateSecurityAgencyMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.SECURITY_AGENCY_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    getSecurityAgencyMasterFreeApi: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SECURITY_AGENCY_MASTER_FREE,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    // start security guard get add update mutation methods
    getSecurityGuardMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SECURITY_GUARD_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getSecurityGuardByIdMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.SECURITY_GUARD_MASTER}${data.id}`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    getSecurityGuardTypeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SECURITY_GUARD_TYPE_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addSecurityGuardMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.SECURITY_GUARD_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateSecurityGuardMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.SECURITY_GUARD_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // Security Guard Transfer
    getSecurityGuardTransfer: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.SECURITY_GUARD_TRANSFER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    // Warehouse type master update add patch start
    getWarehouseTypeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_TYPE_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addWarehouseTypeMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.WAREHOUSE_TYPE_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateWarehouseTypeMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.WAREHOUSE_TYPE_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    // warehouse type master update add patch end
    // Bank Cm Location Add Update add Start
    getBankCMLocationMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.BANK_CM_LOCATION_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getBankCMLocationMasterId: builder.mutation({
      query: (id) => ({
        url: `${API.DASHBOARD.BANK_CM_LOCATION_MASTER}${id}/`,
        method: "GET",
      }),
    }),
    addBankCMLocationMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.BANK_CM_LOCATION_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateBankCMLocationMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.BANK_CM_LOCATION_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // Bank Cm Location Add Update Edit End

    //  Commodity bag master add edit update starts
    getCommodityBagFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_BAG_FREE_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getCommodityBagMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.COMMODITY_BAG_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    addCommodityBagMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.COMMODITY_BAG_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateCommodityBagMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.COMMODITY_BAG_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    //Commodity bag master add edit update end
    getHsnFreeMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.HSN_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getHsnMaster: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.HSN_MASTER,
        method: "GET",
        params: params,
      }),
    }),
    getHsnDetailMaster: builder.mutation({
      query: (id) => ({
        url: `${API.DASHBOARD.HSN_MASTER}${id}`,
        method: "GET",
      }),
    }),
    addHsnMaster: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.HSN_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateHsnMaster: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.HSN_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    activeDeActive: builder.mutation({
      query: (data) => ({
        url: data.endPoint,
        method: "POST",
        body: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    //Download Excel File API
    getDownLoadExcel: builder.mutation({
      query: (params) => ({
        url: `${API.DASHBOARD.EXCEL_DOWNLOAD_MASTER}?`,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    //Download Excel File API
    postFileUpload: builder.mutation({
      query: (data) => ({
        url: `${API.COMMON_API_END_POINTS.FILE_UPLOAD}`,
        method: "POST",
        body: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getSecurityGuardTransferList: builder.mutation({
      query: (id) => ({
        url: `${API.ALL_SECURITY_GUARD_MASTER.GET_WAREHOUSE_LIST}${id}/`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getSecurityGuardTransferListParam: builder.mutation({
      query: (data) => ({
        url: `${API.ALL_SECURITY_GUARD_MASTER.GET_WAREHOUSE_LIST}?security_agency=${data.id}`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getSecurityGuardTransferListParamFree: builder.mutation({
      query: (data) => ({
        url: `${API.ALL_SECURITY_GUARD_MASTER.GET_WAREHOUSE_FREE_LIST}?area=${data.id}`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    getSecurityGuardTransferHistoryFree: builder.mutation({
      query: (data) => ({
        url: `${API.ALL_SECURITY_GUARD_MASTER.GET_GUARD_TRANSFER_LIST}?from_security_guard=${data.id}&to_security_guard=${data.id}`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    // Qualitycontrolreport get add update mutation start
    getQualityControlReport: builder.mutation({
      query: (params) => ({
        url: API.DASHBOARD.WAREHOUSE_CLIENT_MASTER,
        method: "GET",
        params: params,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    addQualityControlReport: builder.mutation({
      query: (data) => ({
        url: API.DASHBOARD.WAREHOUSE_CLIENT_MASTER,
        method: "POST",
        body: data,
      }),
    }),
    updateQualityControlReport: builder.mutation({
      query: (data) => ({
        url: `${API.DASHBOARD.WAREHOUSE_CLIENT_MASTER}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    // qualitycontrolreport get add update mutation end
    transferSecurityGuardList: builder.mutation({
      query: (data) => ({
        url: `${API.ALL_SECURITY_GUARD_MASTER.GET_GUARD_TRANSFER}`,
        method: "GET",
        params: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    transferSecurityGuard: builder.mutation({
      query: (data) => ({
        url: `${API.ALL_SECURITY_GUARD_MASTER.GET_GUARD_TRANSFER}`,
        method: "POST",
        body: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),
    // Warehouse Agreement Details api mutation start
    fetchWarehouseAgreementDetailsById: builder.mutation({
      query: (id) => ({
        url: `${API.WAREHOUSE_AGREEMENT_DETAILS.FETCH_WAREHOUSE_AGREEMENT_DETAILS}${id}`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    updateAgreementDetailsById: builder.mutation({
      query: (data) => ({
        url: `${API.WAREHOUSE_AGREEMENT_DETAILS.FETCH_WAREHOUSE_AGREEMENT_DETAILS}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
        // Dispatch actions, show notification, etc.
      },
    }),

    // warehouse client master api mutation start

    getConstitutionClient: builder.mutation({
      query: () => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.GET_CONSTITUTION_CLIENT}`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    getClientMasterDocType: builder.mutation({
      query: (queryParams) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.GET_DOC_TYPE}`,
        method: "GET",
        params: queryParams,
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    getClientMasterFreeType: builder.mutation({
      query: (queryParams) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.GET_CLIENT_FREE}`,
        method: "GET",
        params: queryParams,
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    // warehouse client master office address api mutation start
    getState: builder.mutation({
      query: (queryParams) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.GET_ALL_STATE}`,
        method: "GET",
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    submitClientMaster: builder.mutation({
      query: (data) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.POST}`,
        method: "GET",
        body: data,
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    warehouseOwnerMasterCheckPanNumber: builder.mutation({
      query: (query) => ({
        url: `${API.WAREHOUSE_OWNER_MASTER.CHECK_PAN_NUMBER}`,
        method: "GET",
        params: query,
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    warehouseOwnerClientMasterCheckPanNumber: builder.mutation({
      query: (query) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.CHECK_PAN_NUMBER}`,
        method: "GET",
        params: query,
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    getAgreementStartDate: builder.mutation({
      query: (query) => ({
        url: `${API.WAREHOUSE_CLIENT_MASTER.GET_AGREEMENT_START_DATE}`,
        method: "GET",
        params: query,
      }),
      onError: (error) => {
        console.log("API Error:", error);
      },
    }),

    // warehouse client master office address api mutation start

    // warehouse client master api mutation end

    // Warehouse Agreement Details api mutation end

    //from security Agency in Security guard Tranfer API
  }),
});

export const {
  // Api mutation for district master starts
  useGetDistrictMasterMutation,
  useGetDistrictFreeMasterMutation,
  useAddDistrictMasterMutation,
  useUpdateDistrictMasterMutation,
  useGetAgreementStartDateMutation,
  // Api mutation for district master ends

  useWarehouseOwnerClientMasterCheckPanNumberMutation,

  useWarehouseOwnerMasterCheckPanNumberMutation,
  useGetPrimaryCommodityTypeMutation,
  //Api mutation for state master starts
  useGetStateMasterMutation,
  useGetStateByIdMasterMutation,
  useGetStateFreeMasterMutation,
  useAddStateMasterMutation,
  useUpdateStateMasterMutation,
  //Api mutation for state master ends

  useGetZoneMasterMutation,
  useGetZoneByIdMasterMutation,
  useGetZoneFreeMasterMutation,
  useAddZoneMasterMutation,
  useUpdateZoneMasterMutation,

  // Api mutation for area master starts
  useGetAreaMasterMutation,
  useGetAreaFreeMasterMutation,
  useUpdateAreaMasterMutation,
  useAddAreaMasterMutation,
  // Api mutation for area master ends

  // Api mutation for the warehouseclient master starts
  useGetWareHouseClientMutation,
  useAddWareHouseClientMutation,
  useAllMultipleAssignmentWareHouseClientMutation,
  useUpdateWareHouseClientMutation,

  // Api mutation for the warehouseclient master ends

  // Api mutation for warehouse owner master starts
  useGetOwnerTypeMutation,
  useGetWareOwnerDocTypeMutation,
  useGetWareHouseOwnerTypeMutation,
  useGetWareHouseOwnerTypeByIdMutation,
  useUpdateWareHouseOwnerTypeMutation,
  useAddWareHouseOwnerTypeMutation,
  // Api mutation for warehouse owner master ends
  useGetClientMasterMutation,
  useGetClientMasterFreeTypeMutation,
  useAddClientMasterMutation,
  useUpdateClientMasterMutation,
  useGetClientGstMasterMutation,
  useAddClientGstMasterMutation,
  useUpdateClientGstMasterMutation,
  useGetBankMasterMutation,
  useGetBankMasterFreeMutation,
  useAddBankMasterMutation,
  useUpdateBankMasterMutation,
  useGetBankMasterSectorMutation,
  useGetBankBranchMasterMutation,
  useGetBankBranchMasterFreeMutation,
  useAddBankBranchMasterMutation,
  useUpdateBankBranchMasterMutation,
  // Api mutation for commodity type starts
  useGetCommodityFreeTypeMasterMutation,
  useGetCommodityTypeMasterMutation,
  useUpdateCommodityTypeMasterMutation,
  useAddCommodityTypeMasterMutation,
  // Api mutation for commodity type ends

  // Api mutation for commodity grade starts
  useGetCommodityGradeMutation,
  useUpdateCommodityGradeMutation,
  useAddCommodityGradeMutation,
  useGetCommodityPricePullingMutation,
  usePricePullingpostFileUploadMutation,
  // Api mutation for commodity grade ends

  // Api mutation for page master starts
  useGetPageMasterMutation,
  useGetPageFreeMasterMutation,
  useAddPageMasterMutation,
  useUpdatePageMasterMutation,
  // Api mutation for page master ends
  // Api mutation for Role master start
  useGetRoleMasterMutation,
  useGetRoleFreeMasterMutation,
  useGetRoleIdMasterMutation,
  useAddRoleMasterMutation,
  useUpdateRoleMasterMutation,
  // Api mutation for role master ends
  useGetRolePageAssignmentMasterMutation,
  useGetUserMasterMutation,
  useGetUserFreeMasterMutation,
  useGetDesignationMasterMutation,
  useGetDesignationFreeMasterMutation,
  useGetWarehouseUserTransferMasterMutation,
  useAddWarehouseUserTransferMasterMutation,
  useAddUserMasterMutation,
  useUpdateUserMasterMutation,
  // Api mutation for commodity variety starts
  useGetCommodityVarietyMutation,
  useUpdateCommodityVarietyMutation,
  useAddCommodityVarietyMutation,
  // Api mutation for commodity variety ends

  // Api mutation for warehouse sub type start
  useGetWareHouseSubTypeMutation,
  useAddWareHouseSubTypeMutation,
  useUpdateWareHouseSubTypeMutation,
  useGetWareHouseMutation,
  useGetWareHouseFreeMutation,
  useGetWareHouseOwnerFreeMutation,
  useGetChamberFreeMutation,
  useGetWareHouseByIdMutation,
  useUpdateWareHouseAgreementRenewalByIdMutation,
  // api mutation for warehouse sub type end

  //Api mutation for warehouse type start
  useGetWarehouseTypeMasterMutation,
  useUpdateWarehouseTypeMasterMutation,
  useAddWarehouseTypeMasterMutation,

  useFetchWareHouseClientByIdMutation,
  //Api mutation for warehouse type end

  // Api mutation for security agency starts
  useGetSecurityAgencyMasterMutation,
  useAddSecurityAgencyMasterMutation,
  useUpdateSecurityAgencyMasterMutation,
  useGetSecurityAgencyMasterFreeApiMutation,
  // Api mutation for security agency end

  // Api mutation for security Guard starts
  useGetSecurityGuardMasterMutation,
  useGetSecurityGuardByIdMasterMutation,
  useGetSecurityGuardTypeMasterMutation,
  useAddSecurityGuardMasterMutation,
  useUpdateSecurityGuardMasterMutation,
  useGetSecurityGuardTransferMutation,

  // Api mutation for security Guard end

  // Api mutation for earthquack zone type start
  useGetEarthQuakeZoneTypeMasterMutation,
  useGetEarthQuakeZoneFreeTypeMasterMutation,
  useAddEarthQuakeZoneTypeMasterMutation,
  useUpdateEarthQuakeZoneTypeMasterMutation,
  // Api mutation for earthquack zone type end

  //Api mutation for Insurance variety starts
  useGetInsuranceCompanyMasterMutation,
  useUpdateInsuranceCompanyMasterMutation,
  useAddInsuranceCompanyMasterMutation,
  // Api mutation for Insurance variety ends

  //Api mutation for Insurance Policy Mutation Start
  useGetInsurancePolicyMasterMutation,
  useAddInsurancePolicyMasterMutation,
  useUpdateInsurancePolicyMasterMutation,

  // Api mutation for Insurance Policy Mutation End
  //Apis mutation for region master starts
  useGetRegionMasterMutation,
  useGetRegionByIdMasterMutation,
  useGetRegionFreeMasterMutation,
  useAddRegionMasterMutation,
  useUpdateRegionMasterMutation,
  //Api mutation for region master ends

  // Api mutation for quality parameter starts
  useGetQualityParameterMasterMutation,
  useAddQualityParameterMasterMutation,
  useUpdateQualityParameterMasterMutation,
  // Api mutation for quality parameter ends

  useActiveDeActiveMutation,
  useGetCommodityFreeMasterMutation,
  useGetStackFreeMasterMutation,
  useGetCommodityVarityFreeMasterMutation,
  useGetCommodityMasterMutation,
  useGetCommodityIDMasterMutation,
  useAddCommodityMasterMutation,
  useUpdateCommodityMasterMutation,
  // Api Mutation For Bank Cm Location Start
  useGetBankCMLocationMasterMutation,
  useAddBankCMLocationMasterMutation,
  useUpdateBankCMLocationMasterMutation,
  useGetBankCMLocationMasterIdMutation,
  // Api Mutation For Bank Cm Location End
  useGetEmployeeMasterMutation,
  useAddEmployeeMasterMutation,
  useUpdateEmployeeMasterMutation,
  useGetDepartmentMasterMutation,
  useAddDepartmentMasterMutation,
  useUpdateDepartmentMasterMutation,
  useGetHiringProposalMasterMutation,
  useAddHiringProposalMasterMutation,
  useUpdateHiringProposalMasterMutation,

  // inspection master mutation start
  useGetInspectionMasterMutation,
  useGetInspectionDetailMasterMutation,
  useAddInspectionMasterMutation,
  useMultipleAssignInspectionMasterMutation,
  useUpdateInspectionMasterMutation,
  // inspection master mutation end

  //Commodity bag master mutation start
  useGetCommodityBagFreeMasterMutation,
  useGetCommodityBagMasterMutation,
  useAddCommodityBagMasterMutation,
  useUpdateCommodityBagMasterMutation,
  // Commodity bag master mutation end

  // QualityControlReport Mutation Start
  useGetQualityControlReportMutation,
  useAddQualityControlReportMutation,
  useUpdateQualityControlReportMutation,
  // QualityControlReport Mutation End

  useGetHsnFreeMasterMutation,
  useGetHsnMasterMutation,
  useGetHsnDetailMasterMutation,
  useAddHsnMasterMutation,
  useUpdateHsnMasterMutation,
  useGetDownLoadExcelMutation,
  // Api upload file Api
  usePostFileUploadMutation,
  useGetBankMasterDetailsByIdMutation,

  useGetSecurityGuardTransferListMutation,
  useGetSecurityGuardTransferListParamMutation,
  useGetSecurityGuardTransferListParamFreeMutation,
  useGetSecurityGuardTransferHistoryFreeMutation,

  useTransferSecurityGuardMutation,
  useTransferSecurityGuardListMutation,

  // warehouse agreement details mutation
  useUpdateAgreementDetailsByIdMutation,
  useFetchWarehouseAgreementDetailsByIdMutation,
  useGetClientMasterDocTypeMutation,
  useGetConstitutionClientMutation,
  useGetStateMutation,
  useSubmitClientMasterMutation,
} = masterApiSlice;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const api = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
//   endpoints: (builder) => ({
//     getCommodityMaster: builder.query({
//       query: (params) => ({
//         url: API.DASHBOARD.COMMODITY_MASTER,
//         method: 'GET',
//         params: params,
//       }),
//       onError: (error, { dispatch }) => {
//         if (error.status === 401) {
//           // Unauthorized error handling logic
//           // For example, redirect to login page or show an error message
//         }
//       },
//     }),
//   }),
// });

// export const { useGetCommodityMasterQuery } = api;
