import CryptoJS from "crypto-js";
import configuration from "../config/configuration";

const SECRET_KEY = configuration.ENCRYPTION_SECRET_KEY;

export const localStorageService = {
  set: (key, value) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      SECRET_KEY
    ).toString();
    localStorage.setItem(key, encryptedData);
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  get: (key) => {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedData,
        SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    }
    return null;
  },
};

// Save data to localStorage without encryption
export const setItem = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Retrieve data from localStorage without decryption
export const getItem = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Remove item from localStorage
export const removeItem = (key) => {
  localStorage.removeItem(key);
};

// Clear all items from localStorage
export const clearStorage = () => {
  localStorage.clear();
};
