// import Axios from "../http";
// import { API } from "../constants/api.constants";

import Axios from "../../app/api/apiSliceSuperset";
import { API } from "../../constants/api.constants";

export const mastersSuperSet = {
  getAccessToken: async (data) => {
    try {
      return await Axios.post(API.DASHBOARD.SUPERSET_DASHBOARD, data);
    } catch (error) {
      throw error;
    }
  },

  getEmbeddedDashboardUrl: async (data) => {
    const url = `${API.DASHBOARD.SUPERSET_EMBEDDED_DASHBOARD_URL}${data?.id}/embedded`;
    console.log(url);
    try {
      return await Axios.post(url, data?.data);
    } catch (error) {
      throw error;
    }
  },

  getGuestToken: async (data) => {
    try {
      return await Axios.post(API.DASHBOARD.SUPERSET_GUEST_TOKEN, data);
    } catch (error) {
      throw error;
    }
  },
  getReports: async (data) => {
    try {
      return await Axios.get(API.DASHBOARD.REPORTS, data);
    } catch (error) {
      throw error;
    }
  },
};
