import { toast } from "react-toastify";
import { localStorageService } from "./localStorge.service";
// const defaultErrMsg = "Something went wrong !";

const HandleError = (obj, code) => {
  console.log("handleError logs ---> ", obj, code);
  switch (code) {
    case 200:
      Ok(obj, code);
      break;
    case 201:
      Ok(obj, code);
      break;
    case 400:
      BadRequest(obj, code);
      break;
    case 403:
      unauthorized(obj, code);
      break;

    case 401:
      unauthorized(obj, code);
      break;

    case 423:
      unauthenticated(obj, code);
      break;

    default:
      break;
  }
};
const Ok = (obj) => {
  // console.log("okay test --> ", obj);
  // toast.success(obj?.msg || obj);
};

const BadRequest = (obj) => {
  //toast.error(obj?.msg || obj);
};

const unauthorized = () => {
  redirectToLogin();
};
const unauthenticated = (obj) => {
  toast.error(obj?.msg || obj);
};
const redirectToLogin = () => {
  localStorageService.remove("GG_ADMIN");
  window.location.href = "/login";
};

export default HandleError;
