import moment from "moment";

// export const calculateExpiryDate = (date, month) => {
//   const formattedCommencementDate = moment(date, "DD/MM/YYYY", true);

//   if (!formattedCommencementDate.isValid()) {
//     return null; // Return null or any desired value for invalid dates
//   }

//   const expiryDate = formattedCommencementDate
//     .add(month, "months")
//     .format("DD/MM/YYYY");

//   return expiryDate;
// };

export const calculateExpiryDate = (date, month) => {
  // Start date

  if (date && month) {
    var startDate = moment(date);

    // Number of months to add
    var monthsToAdd = month;

    // Calculate expiration date
    var expirationDate = startDate.add(monthsToAdd, "months");

    // Format expiration date as desired
    var formattedExpirationDate = expirationDate.format("YYYY-MM-DD");

    console.log("formattedExpirationDate --> ", formattedExpirationDate);

    return formattedExpirationDate;
  }
};
