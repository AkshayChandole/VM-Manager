const express = require("express");
const fs = require("fs");
const path = require("path");
const { ensureFileAndDirectoryExist } = require("../utils/fileUtils");
const {
  encryptPassword,
  decryptPassword,
} = require("../utils/encryptionUtils");
const router = express.Router();
const jwt = require("jsonwebtoken");

const dirPath = path.join(__dirname, "../config");
const filePath = path.join(dirPath, "accountUsers.json");

const secretKey = "vm-manager-account-users";
const jwtSecretKey = "vm-manager-account-user-jwt";

// Login a user
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  ensureFileAndDirectoryExist(dirPath, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Could not read account users file" });
    }

    const users = JSON.parse(data || "[]");
    const user = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    if (user) {
      const decryptedPassword = decryptPassword(user.password, secretKey);
      if (decryptedPassword === password) {
        const token = jwt.sign({ username: user.username }, jwtSecretKey, {
          expiresIn: "1h",
        });
        return res.json({ token, message: "Login successful" });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

// Sign up a user
router.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Both username and password are required" });
  }

  console.log(req.body);
  ensureFileAndDirectoryExist(dirPath, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read users file" });
    }

    let users = JSON.parse(data || "[]");

    const duplicateUser = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    if (duplicateUser) {
      return res
        .status(400)
        .json({ error: "User with the same username already exists" });
    }

    const encryptedPassword = encryptPassword(password, secretKey);
    users.push({ username, password: encryptedPassword });

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Could not write users file" });
      }

      // Generate JWT token
      const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: "1h" });
      res.json({ token, message: "User signed up successfully" });
    });
  });
});

module.exports = router;
