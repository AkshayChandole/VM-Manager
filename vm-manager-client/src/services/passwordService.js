import CryptoJS from "crypto-js";

export const encryptPassword = (password, secretKey) => {
  const encryptedData = CryptoJS.AES.encrypt(password, secretKey).toString();
  return encryptedData;
};
