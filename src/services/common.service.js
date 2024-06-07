import moment from "moment";
import { localStorageService } from "./localStorge.service";
import { showToastByStatusCode } from "./showToastByStatusCode";
import _ from "lodash";
// import fileType from "file-type";

// ! commented the unused variable filetype ...
const fileTypes = {
  image: [
    { extension: "jpeg", mimeType: "image/jpeg" },
    { extension: "jpg", mimeType: "image/jpeg" },
    { extension: "png", mimeType: "image/png" },
    { extension: "gif", mimeType: "image/gif" },
    { extension: "bmp", mimeType: "image/bmp" },
  ],
  document: [
    { extension: "pdf", mimeType: "application/pdf" },
    { extension: "doc", mimeType: "application/msword" },
    {
      extension: "docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    { extension: "txt", mimeType: "text/plain" },
  ],
  spreadsheet: [
    { extension: "xls", mimeType: "application/vnd.ms-excel" },
    {
      extension: "xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    { extension: "csv", mimeType: "text/csv" },
  ],
  audio: [
    { extension: "mp3", mimeType: "audio/mpeg" },
    { extension: "wav", mimeType: "audio/wav" },
    { extension: "ogg", mimeType: "audio/ogg" },
  ],
  video: [
    { extension: "mp4", mimeType: "video/mp4" },
    { extension: "avi", mimeType: "video/x-msvideo" },
    { extension: "mkv", mimeType: "video/x-matroska" },
  ],
};

export const commonService = {
  calculateDaysAndNights: (startDate, endDate) => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);

      const days = end.diff(start, "days");
      const nights = days - 1;

      return { days, nights };
    }
  },

  calculateEndDate: (startDate, days, nights) => {
    const start = moment(startDate);
    const end = start.clone().add(days, "days").add(nights, "days");

    return end.format("YYYY-MM-DD");
  },

  calculateNightsAndEndDate: (startDate, days) => {
    const start = moment(startDate);
    const end = start.clone().add(days, "days");
    const nights = days - 1;
    const endDate = end.subtract(nights, "days").format("YYYY-MM-DD");

    return { nights, endDate };
  },

  calculateDaysAndEndDate: (startDate, nights) => {
    const start = moment(startDate);
    const end = start.clone().add(nights, "days");
    const days = nights + 1;
    const endDate = end.subtract(1, "days").format("YYYY-MM-DD");

    return { days, endDate };
  },

  validateFile: (value) => {
    // Perform file validation logic
    const file = value[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
      return true; // File is not required, so no validation needed
    }

    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Please upload a JPEG or PNG image.";
    }

    if (file.size > maxFileSize) {
      return "File size exceeds the maximum limit of 5MB.";
    }

    /// return true; // Return true for valid file
  },
  getCurrentTimeFileName: () => {
    var currentDate = new Date();
    var currentTime = currentDate.toISOString().replace(/[-:.T]/g, "");
    var fileName = currentTime + ".txt";
    return fileName;
  },
  userLogout: () => {
    localStorageService.remove("GG_ADMIN");
    window.location.href = "/login";
  },
  userChangePassword: () => {
    // Assuming the user successfully changes their password here
    localStorageService.remove("GG_ADMIN");
    window.location.href = "/change-current-password"; // Redirecting to the login page after password change
  },
};

export const removeLastUpdatedUser = (obj) => {
  if (_.isArray(obj)) {
    // If it's an array, iterate over each element
    _.forEach(obj, (value) => {
      removeLastUpdatedUser(value);
    });
  } else if (_.isObject(obj)) {
    // If it's an object, iterate over each property
    _.forEach(obj, (value, key) => {
      removeLastUpdatedUser(value);
    });
    // Remove the last_updated_user key
    _.unset(obj, "last_updated_user");
  }
};

export function scrollToElement(elementId, offset = 0) {
  let options = { behavior: "smooth", block: "start", inline: "nearest" };
  if (!elementId) {
    window.scrollTo({
      top: 0 + offset,
      ...options,
    });
    return;
  }

  const element = document.getElementById(elementId);

  if (element) {
    element.scrollIntoView({
      top: element.getBoundingClientRect().top + window.scrollY + offset,
      ...options,
    });
  }
}

// export function numberToWords(number) {
//   const ones = [
//     "",
//     "one",
//     "two",
//     "three",
//     "four",
//     "five",
//     "six",
//     "seven",
//     "eight",
//     "nine",
//   ];
//   const teens = [
//     "",
//     "eleven",
//     "twelve",
//     "thirteen",
//     "fourteen",
//     "fifteen",
//     "sixteen",
//     "seventeen",
//     "eighteen",
//     "nineteen",
//   ];
//   const tens = [
//     "",
//     "ten",
//     "twenty",
//     "thirty",
//     "forty",
//     "fifty",
//     "sixty",
//     "seventy",
//     "eighty",
//     "ninety",
//   ];
//   const thousands = ["", "thousand", "million", "billion", "trillion"];

//   function convertToWords(num) {
//     if (num === "" || num === undefined) return "";
//     if (num === 0) return "zero";
//     if (num < 10) return ones[num];
//     if (num < 20) return teens[num - 10];
//     if (num < 100)
//       return tens[Math.floor(num / 10)] + " " + convertToWords(num % 10);
//     if (num < 1000)
//       return (
//         ones[Math.floor(num / 100)] + " hundred " + convertToWords(num % 100)
//       );
//     for (let i = 0; i < thousands.length; i++) {
//       if (num < 1000 ** (i + 1)) {
//         return (
//           convertToWords(Math.floor(num / 1000 ** i)) +
//           " " +
//           thousands[i] +
//           " " +
//           convertToWords(num % 1000 ** i)
//         );
//       }
//     }
//     return "out of range";
//   }

//   function decimalToWords(decimal) {
//     const decimalWords = decimal
//       ?.toString()
//       ?.split("")
//       ?.map((digit) => ones[parseInt(digit)])
//       ?.join(" ");

//     return `point ${decimalWords}`;
//   }

//   if (isNaN(number)) {
//     return " ";
//   }

//   if (number === 0) {
//     return "zero";
//   }

//   if (number < 0) {
//     return "negative " + numberToWords(Math.abs(number));
//   }

//   const parts = number?.toString().split(".") || [];
//   const integerPart = parseInt(parts[0]);
//   const decimalPart = parts[1] ? parseInt(parts[1]) : 0;

//   let result = convertToWords(integerPart);

//   if (decimalPart > 0) {
//     result += " " + decimalToWords(decimalPart);
//   }

//   return result;
// }
// export function numberToWords(number) {
//   const ones = [
//     "",
//     "one",
//     "two",
//     "three",
//     "four",
//     "five",
//     "six",
//     "seven",
//     "eight",
//     "nine",
//   ];
//   const teens = [
//     "",
//     "eleven",
//     "twelve",
//     "thirteen",
//     "fourteen",
//     "fifteen",
//     "sixteen",
//     "seventeen",
//     "eighteen",
//     "nineteen",
//   ];
//   const tens = [
//     "",
//     "ten",
//     "twenty",
//     "thirty",
//     "forty",
//     "fifty",
//     "sixty",
//     "seventy",
//     "eighty",
//     "ninety",
//   ];
//   const thousands = ["", "thousand", "million", "billion", "trillion"];

//   function convertToWords(num) {
//     if (isNaN(num)) return "";
//     if (num === 10) return "ten";
//     if (num < 10) return ones[num];
//     if (num < 20) return teens[num - 10];
//     if (num < 100)
//       return tens[Math.floor(num / 10)] + " " + convertToWords(num % 10);
//     if (num < 1000)
//       return (
//         ones[Math.floor(num / 100)] + " hundred " + convertToWords(num % 100)
//       );
//     for (let i = 0; i < thousands.length; i++) {
//       if (num < 1000 ** (i + 1)) {
//         return (
//           convertToWords(Math.floor(num / 1000 ** i)) +
//           " " +
//           thousands[i] +
//           " " +
//           convertToWords(num % 1000 ** i)
//         );
//       }
//     }
//     return "out of range";
//   }

//   function decimalToWords(decimal) {
//     const decimalWords = decimal
//       ?.toString()
//       ?.split("")
//       ?.map((digit) => ones[parseInt(digit)])
//       ?.join(" ");

//     return `point ${decimalWords}`;
//   }

//   if (isNaN(number)) {
//     return " ";
//   }

//   if (number < 0) {
//     return "negative " + numberToWords(Math.abs(number));
//   }

//   const parts = number?.toString().split(".") || [];
//   const integerPart = parseInt(parts[0]);
//   const decimalPart = parts[1] ? parseInt(parts[1]) : 0;

//   let result = convertToWords(integerPart);

//   if (decimalPart > 0) {
//     result += " " + decimalToWords(decimalPart);
//   }

//   return result || "zero";
// }

// export function numberToWords(number) {
//   // Define the numerical system
//   var NS = [
//     { value: 1000000000, str: "Arab" },
//     { value: 10000000, str: "Crore" },
//     { value: 100000, str: "Lakh" },
//     { value: 1000, str: "Thousand" },
//     { value: 100, str: "Hundred" },
//     { value: 90, str: "Ninety" },
//     { value: 80, str: "Eighty" },
//     { value: 70, str: "Seventy" },
//     { value: 60, str: "Sixty" },
//     { value: 50, str: "Fifty" },
//     { value: 40, str: "Forty" },
//     { value: 30, str: "Thirty" },
//     { value: 20, str: "Twenty" },
//     { value: 19, str: "Nineteen" },
//     { value: 18, str: "Eighteen" },
//     { value: 17, str: "Seventeen" },
//     { value: 16, str: "Sixteen" },
//     { value: 15, str: "Fifteen" },
//     { value: 14, str: "Fourteen" },
//     { value: 13, str: "Thirteen" },
//     { value: 12, str: "Twelve" },
//     { value: 11, str: "Eleven" },
//     { value: 10, str: "Ten" },
//     { value: 9, str: "Nine" },
//     { value: 8, str: "Eight" },
//     { value: 7, str: "Seven" },
//     { value: 6, str: "Six" },
//     { value: 5, str: "Five" },
//     { value: 4, str: "Four" },
//     { value: 3, str: "Three" },
//     { value: 2, str: "Two" },
//     { value: 1, str: "One" }
//   ];

//   if (Number(number || 0) < 0 || number > 99999999999) {
//     return "Number out of range. Please provide a number between 1 and 99,999,999,999.";
//   }

//   var result = '';

//   for (var n of NS) {
//     if (number >= n.value) {
//       if (number >= 100) {
//         var quotient = Math.floor(number / n.value);
//         var remainder = number % n.value;
//         result += numberToWords(quotient) + ' ' + n.str;
//         if (remainder > 0) {
//           result += ' ' + numberToWords(remainder);
//         }
//         return result.trim();
//       } else {
//         result += n.str;
//         number -= n.value;
//         if (number > 0) result += ' ';
//       }
//     }
//   }

//   if (number > 0) {
//     result += numberToWords(number);
//   }

//   return result || "zero";
// }

export function numberToWords(number) {
  if (Number(number || 0) < 0 || number > 99999999999) {
    return "Number out of range. Please provide a number between 1 and 99,999,999,999.";
  }

  var integerPart = Math.floor(number);
  var decimalPart = Math.round((number - integerPart) * 100); // Consider up to two decimal places

  var result = "";

  if (integerPart > 0) {
    result += convertToWords(integerPart);
  } else {
    result = "";
  }

  if (decimalPart > 0) {
    result += " point " + convertToWords(decimalPart);
  }

  return result;
}

function convertToWords(number) {
  var NS = [
    { value: 1000000000, str: "Arab" },
    { value: 10000000, str: "Crore" },
    { value: 100000, str: "Lakh" },
    { value: 1000, str: "Thousand" },
    { value: 100, str: "Hundred" },
    { value: 90, str: "Ninety" },
    { value: 80, str: "Eighty" },
    { value: 70, str: "Seventy" },
    { value: 60, str: "Sixty" },
    { value: 50, str: "Fifty" },
    { value: 40, str: "Forty" },
    { value: 30, str: "Thirty" },
    { value: 20, str: "Twenty" },
    { value: 19, str: "Nineteen" },
    { value: 18, str: "Eighteen" },
    { value: 17, str: "Seventeen" },
    { value: 16, str: "Sixteen" },
    { value: 15, str: "Fifteen" },
    { value: 14, str: "Fourteen" },
    { value: 13, str: "Thirteen" },
    { value: 12, str: "Twelve" },
    { value: 11, str: "Eleven" },
    { value: 10, str: "Ten" },
    { value: 9, str: "Nine" },
    { value: 8, str: "Eight" },
    { value: 7, str: "Seven" },
    { value: 6, str: "Six" },
    { value: 5, str: "Five" },
    { value: 4, str: "Four" },
    { value: 3, str: "Three" },
    { value: 2, str: "Two" },
    { value: 1, str: "One" },
  ];

  var result = "";

  for (var n of NS) {
    if (number >= n.value) {
      if (number >= 100) {
        var quotient = Math.floor(number / n.value);
        var remainder = number % n.value;
        result += convertToWords(quotient) + " " + n.str;
        if (remainder > 0) {
          result += " " + convertToWords(remainder);
        }
        return result.trim();
      } else {
        result += n.str;
        number -= n.value;
        if (number > 0) result += " ";
      }
    }
  }

  if (number > 0) {
    result += convertToWords(number);
  }

  return result;
}

export function toasterAlert(errorResponse) {
  const errorMessage = [];
  console.log("error message:", errorResponse);

  if (errorResponse && Array.isArray(errorResponse?.data?.message)) {
    errorMessage.push(...errorResponse.data.message);
  } else {
    //alert(errorResponse.data.message.message)
    showToastByStatusCode(
      400,
      errorResponse?.data?.message || errorResponse?.data?.detail
    );
    return;
  }

  // Check if there are any error messages
  if (errorMessage.length > 0) {
    // Handle the error messages, e.g., display them to the user
    // console.error("API Error:", errorMessage);
    showToastByStatusCode(400, errorMessage.join("\n"));
  } else {
    console.error("Unknown API Error");
    showToastByStatusCode(400, "Something went wrong !");
  }
}

export function CommonToasterAlert(errorResponse) {
  const errorMessage = [];
  console.log("error message:", errorResponse?.data?.message);

  if (errorResponse && Array.isArray(errorResponse?.data?.message)) {
    errorMessage.push(...errorResponse.data.message);
  } else {
    showToastByStatusCode(
      400,
      errorResponse?.data?.message || errorResponse?.data?.detail
    );
    return;
  }

  // Check if there are any error messages
  if (errorMessage.length > 0) {
    // Handle the error messages, e.g., display them to the user
    // console.error("API Error:", errorMessage);
    showToastByStatusCode(400, errorMessage.join("\n"));
  } else {
    console.error("Unknown API Error");
    showToastByStatusCode(400, "Something went wrong !");
  }
}

export function isValidAadhaarNumber(aadhaarNumber) {
  // Regular expression pattern for a valid Aadhaar number
  const aadhaarRegex =
    /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/;

  // Remove any spaces or hyphens from the input string
  const cleanedAadhaarNumber = aadhaarNumber?.replace(/\s|-/g, "");
  console.log(cleanedAadhaarNumber);
  // Check if the cleaned input string matches the regex pattern
  return aadhaarRegex.test(cleanedAadhaarNumber);
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function createQueryParams(filters) {
  return (
    filters
      ?.map(
        ({ filter, value }) =>
          `${"filter"}=${filter}&${filter}=${encodeURIComponent(value)}`
      )
      .join("&") || ""
  );
}

export function enterFullScreen(newTab) {
  if (newTab.document.documentElement.requestFullscreen) {
    newTab.document.documentElement.requestFullscreen();
  } else if (newTab.document.documentElement.mozRequestFullScreen) {
    // Firefox
    newTab.document.documentElement.mozRequestFullScreen();
  } else if (newTab.document.documentElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    newTab.document.documentElement.webkitRequestFullscreen();
  } else if (newTab.document.documentElement.msRequestFullscreen) {
    // IE/Edge
    newTab.document.documentElement.msRequestFullscreen();
  }
}
