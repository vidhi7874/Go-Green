const configuration = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "",
  IMAGE_BASE_URL: process.env.REACT_APP_API_BASE_URL_FOR_IMG || "",
  SUPERSET_BASE_URL: process.env.REACT_APP_API_BASE_URL_FOR_SUPERSET || "",
  ENCRYPTION_SECRET_KEY: process.env.REACT_APP_lOCAL_STORAGE_SECRET_KEY || "",
  PUBLIC_URL: "/",
};

export default configuration;
