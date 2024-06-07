export const getUserDetailsService = {
  getUserDetails: () => {
    const obj = JSON.parse(localStorage.getItem("elecGo"));

    if (obj) {
      const { user, user_email, user_id, user_name, user_phone, user_role } =
        obj;
      return { user, user_email, user_id, user_name, user_phone, user_role };
    }
    return {};
  },
};
