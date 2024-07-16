const express = require("express");
const fs = require("fs");
const path = require("path");
const { ensureFileAndDirectoryExist } = require("../utils/fileUtils");
const { decryptPassword } = require("../utils/encryptionUtils");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const dirPath = path.join(__dirname, "../config");
const filePath = path.join(dirPath, "accountUsers.json");

const loginPasswordSecretKey = process.env.LOGIN_PASSWORD_SECRET_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

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
      const decryptedActualPassword = decryptPassword(
        user.password,
        loginPasswordSecretKey
      );
      const decryptedProvidedPassword = decryptPassword(
        password,
        loginPasswordSecretKey
      );

      if (decryptedActualPassword === decryptedProvidedPassword) {
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

    users.push({ username, password });

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
