const CryptoJS = require("crypto-js");

const encryptPassword = (password, secretKey) => {
  const encryptedData = CryptoJS.AES.encrypt(password, secretKey).toString();
  return encryptedData;
};

const decryptPassword = (encryptedPassword, secretKey) => {
  const decryptedPassword = CryptoJS.AES.decrypt(
    encryptedPassword,
    secretKey
  ).toString(CryptoJS.enc.Utf8);
  return decryptedPassword;
};

module.exports = { encryptPassword, decryptPassword };
