import { createSlice } from "@reduxjs/toolkit";

const manageBreadcrumbSlice = createSlice({
  name: "manageBreadcrumb",
  initialState: {
    breadCrumbList: [],
  },
  reducers: {
    setBreadCrumb: (state, action) => {
      state.breadCrumbList = action.payload;
    },
  },
});

export const { setBreadCrumb } = manageBreadcrumbSlice.actions;
export default manageBreadcrumbSlice.reducer;
