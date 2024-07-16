const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const path = require("path");
const { ensureFileAndDirectoryExist } = require("../utils/fileUtils");

const dirPath = path.join(__dirname, "../config");
const usersFilePath = path.join(dirPath, "loginUsers.json");

const secretKey = "vm-manager-account-users";
const jwtSecretKey = "vm-manager-account-user-jwt";

// Authenticate user
const authenticate = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  ensureFileAndDirectoryExist(dirPath, usersFilePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read users file" });
    }

    const users = JSON.parse(data);
    const user = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const decryptedPassword = decryptPassword(user.password, secretKey);
    if (decryptedPassword !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, jwtSecretKey, {
      expiresIn: "1h",
    });
    res.json({ token, message: "User is autheticated." });
  });
};

module.exports = { registerUser, loginUser, authenticate };
