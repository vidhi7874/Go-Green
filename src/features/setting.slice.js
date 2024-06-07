import { apiSlice } from "../app/api/apiSlice";
import { API } from "../constants/api.constants";

export const settingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Start the PBPM configuration setting
    getPbpmConfiguration: builder.mutation({
      query: (params) => ({
        url: API.SETTING.PBPM_CONFIGURATION,
        method: "GET",
        params: params,
      }),
    }),
    addPbpmConfiguration: builder.mutation({
      query: (data) => ({
        url: API.SETTING.PBPM_CONFIGURATION,
        method: "POST",
        body: data,
      }),
    }),
    updatePbpmConfiguration: builder.mutation({
      query: (data) => ({
        url: `${API.SETTING.PBPM_CONFIGURATION}${data.id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    //   End the PBPM configuration setting
  }),
});

export const {
  // These is my PBPM cofiguration mutation start
  useGetPbpmConfigurationMutation,
  useAddPbpmConfigurationMutation,
  useUpdatePbpmConfigurationMutation,
  //These is my PBPM configuration mutation end
} = settingApiSlice;
