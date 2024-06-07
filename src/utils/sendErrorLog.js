import axios from "axios";
import configuration from "../config/configuration";
import { localStorageService } from "../services/localStorge.service";

export async function sendErrorLog({ error, errorInfo }) {
  // fetch the user , current time and bind the error to the backend..
  const currentTimestamp = Date.now();
  const EmpData = localStorageService.get("GG_ADMIN")?.userDetails || null;
  const empname = EmpData?.employee_name;
  const emp_id = EmpData?.employee_id;
  const empemail = EmpData?.email;

  // call an api here
  //   const response = await axios.post(configuration.BASE_URL , "", {});
  //   console.log('response: of the api >>>', response);

  console.log(
    "Error Boundary fn call >>>",
    currentTimestamp,
    EmpData,
    empname,
    emp_id,
    empemail,
    error,
    errorInfo
  );
}
