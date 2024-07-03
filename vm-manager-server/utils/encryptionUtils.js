const CryptoJS = require("crypto-js");

const secretKey = "vm-password-key";

const encryptPassword = (password) => {
  const encryptedData = CryptoJS.AES.encrypt(password, secretKey).toString();
  return encryptedData;
};

const decryptPassword = (encryptedPassword) => {
  const decryptedPassword = CryptoJS.AES.decrypt(
    encryptedPassword,
    secretKey
  ).toString(CryptoJS.enc.Utf8);
  return decryptedPassword;
};

module.exports = { encryptPassword, decryptPassword };
