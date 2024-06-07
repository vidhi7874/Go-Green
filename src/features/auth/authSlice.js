import { createSlice } from "@reduxjs/toolkit";
import { localStorageService } from "../../services/localStorge.service";

const authSlice = createSlice({
  name: "auth",
  initialState: { userDetails: {}, token: null, refreshToken: null },
  reducers: {
    setCredentials: (state, action) => {
      console.log("-->", action.payload);
      //  const { access, refresh } = action?.payload?.token;
      const userDetails_obj = {
        user: action.payload.user,
        user_email: action.payload.user_email,
        user_id: action.payload.user_id,
        user_name: action.payload.user_name,
        user_phone: action.payload.user_phone,
        user_role: action.payload.user_role,
        fcm_token: action.payload.fcm_token,
      };
      state.userDetails = { ...userDetails_obj };
      state.token = action?.payload?.token?.access;
      state.refreshToken = action?.payload?.token?.refresh;
      // localStorage.setItem("userDetails", { ...userDetails, access, refresh });
      // localStorageService.set("elecGo", {
      //   ...state.userDetails,
      //   access,
      //   refresh,
      // });
    },
    isAuthorized: () => {
      const userDetails = localStorageService.get("GG_ADMIN");
      const isAuth = JSON.stringify(userDetails) === "{}" ? false : true;
      return isAuth;
    },
    logOut: () => {
      localStorageService.remove("GG_ADMIN");
      window.location.href = "/login";
    },
  },
});

export const { setCredentials, logOut, isAuthorized } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
