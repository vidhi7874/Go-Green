import { showToastByStatusCode } from "./showToastByStatusCode";

const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;

  if (status === 400) {
    const errorData = obj?.data || obj?.data?.data || [];
    console.log(errorData);
    let errorMessage = "";
    if (errorData.length) {
      Object.keys(errorData)?.forEach((key) => {
        const messages = errorData[key];
        if (typeof messages === "object") {
          messages &&
            messages?.forEach((message) => {
              errorMessage += `${key} : ${message} \n`;
            });
        } else {
          showToastByStatusCode(status, msg);
        }
      });
    } else {
      showToastByStatusCode(status, errorMessage || msg);
    }

    return false;
  }
  showToastByStatusCode(status, msg);
};
export default toasterAlert;
