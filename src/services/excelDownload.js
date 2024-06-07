import axios from "axios";
import { localStorageService } from "./localStorge.service";
import { API } from "../constants/api.constants";
import configuration from "../config/configuration";
import { showToastByStatusCode } from "./showToastByStatusCode";
import { CommonToasterAlert } from "./common.service";

export const downloadExcelFile = (data, filename) => {
  console.log("data ====> ", data);
  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute(
    "type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const download_test_old = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const a = document.createElement("a");
  a.href = url;
  a.download = "downloaded_excel_file.xlsx";
  // a.download = "downloaded_excel_file.xls";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const download_test = (blob, fileName) => {
  // Convert the binary data to a Uint8Array
  const binaryData = new Uint8Array(blob);

  // Check for the Excel file signature
  const isExcelFile = binaryData[0] === 0x50 && binaryData[1] === 0x4b; // PK

  if (!isExcelFile) {
    console.error("Not a valid Excel file");
    return;
  }

  // Assuming the first sheet is the one you want to work with
  const sheetDataOffset = 512; // This is just an example offset, actual offset may vary
  const sheetData = binaryData.slice(sheetDataOffset);

  // Extract text content (example: assuming the content is in UTF-8)
  const textDecoder = new TextDecoder("utf-8");
  const sheetText = textDecoder.decode(sheetData);

  // Do something with the extracted text
  console.log(sheetText);

  // Rest of your existing code
  const url = window.URL.createObjectURL(new Blob([blob]));
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "downloaded_excel_file.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadexcel = async (id, fileName) => {
  try {
    const token =
      localStorageService.get("GG_ADMIN")?.userDetails?.token?.access;
    console.log(
      localStorageService.get("GG_ADMIN")?.userDetails?.token?.access
    );
    const headers = {
      "Content-Type": "blob",
      authorization: `Bearer ${token}`,
    };
    const config = {
      method: "GET",
      url: configuration.BASE_URL + API.DASHBOARD.COMMODITY_PRICE_PULLING + id,
      responseType: "arraybuffer",
      headers,
    };
    const response = await axios(config);

    downloadExcelFile(response?.data, fileName);
  } catch (error) {
    console.log(error);
  }
};

export const uploadExcel = async (file) => {
  try {
    // const token =
    //   localStorageService.get("GG_ADMIN")?.userDetails?.token?.access;
    // const formData = new FormData();
    // formData.append("excel_file", file);

    // const headers = {
    //   // "Content-Type": "multipart/form-data",
    //   authorization: `Bearer ${token}`,
    // };

    // const config = {
    //   method: "POST",
    //   url: configuration.BASE_URL + API.DASHBOARD.COMMODITY_EXCEL_UPLOAD,
    //   data: formData,
    //   headers,
    // };

    // const response = await axios(config);
    // console.log(response);
    // downloadExcel_File(response?.data, "updatedCommodityPricePulling");

    // // Handle the response as needed
    // showToastByStatusCode(200, "File Upload Successful");

    const token =
      localStorageService.get("GG_ADMIN")?.userDetails?.token?.access;

    const formData = new FormData();
    formData.append("excel_file", file);
    const headers = {
      // "Content-Type": "blob",
      // "Content-Type": "application/ms-excel",

      // "Content-Type": "multipart/form-data",
      // responseType: "arraybuffer",
      authorization: `Bearer ${token}`,
    };

    const config = {
      method: "POST", // Change method to POST
      url: configuration.BASE_URL + API.DASHBOARD.COMMODITY_EXCEL_UPLOAD,
      data: formData,
      headers,
    };
    const response = await axios(config);
    console.log(response);

    csvFileDownload(response?.data, "updated_commodity_price_pulling");

    // return response;
    // console.log(response.data);
  } catch (error) {
    CommonToasterAlert(error?.response);
  }
};

export const csvFileDownload = (data, fileName) => {
  try {
    const blob = new Blob([data], {
      type: "application/vnd.ms-excel",
    });

    // Create a download link
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName || ""}.csv`; // Set the desired CSV file name

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger a click event to simulate the download
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading CSV file:", error);
  }
};

// // Assuming you have a file input element with id="fileInput"
// document.getElementById("fileInput").addEventListener("change", handleFile);

// function handleFile(event) {
//   const file = event.target.files[0];
//   uploadExcel(file);
// }
