export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Password must contain at least 8 characters, including at least one letter and one number
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

export const validatePhoneNumber = (phoneNumber) => {
  // Phone number must be a valid US phone number
  const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return re.test(phoneNumber);
};

export const validateURL = (url) => {
  const re = /^(ftp|http|https):\/\/[^ "]+$/;
  return re.test(url);
};

export const gstNumberValidation = () => {
  const re =
    /[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/;
  return re;
};
export const tinNumber = (tinNumber) => {
  const re = /^[a-zA-Z0-9]{11}$/;
  return re.test(tinNumber);
};
export const gstNumber = (gstNumber) => {
  const re =
    /[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/;
  return re.test(gstNumber?.toUpperCase());
};

export const aadharValidationMessage = () => {
  return "It should be of 12 Digits.";
};

export const panValidationMessage = () => {
  return "PAN should be in this format ex. 'ABCDE1234A'";
};
