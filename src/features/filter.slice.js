import { createSlice } from "@reduxjs/toolkit";

const dataTableFiltersSlice = createSlice({
  name: "dataTableFilters",
  initialState: {
    filtersFields: {
      isShow: false,
    },
    filterQuery: "",
    sidebarVisibility: true,
    disabledFutureDates: "",
  },
  reducers: {
    setUpFilterFields: (state, action) => {
      state.filtersFields = { ...state.filtersFields, ...action.payload };
    },
    setUpFilterQuery: (state, action) => {
      state.filterQuery = action.payload;
    },
    setSidebarVisibility: (state, action) => {
      state.sidebarVisibility = action.payload;
    },
  },
});

export const {
  setUpFilterFields,
  setUpFilterQuery,
  setSidebarVisibility,
  setDisabledFutureDates,
} = dataTableFiltersSlice.actions;
export default dataTableFiltersSlice.reducer;
