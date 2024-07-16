const express = require("express");
const fs = require("fs");
const path = require("path");
const { ensureFileAndDirectoryExist } = require("../utils/fileUtils");
const {
  encryptPassword,
  decryptPassword,
} = require("../utils/encryptionUtils");
const router = express.Router();

const dirPath = path.join(__dirname, "../config");
const filePath = path.join(dirPath, "Users.json");
const vmsFilePath = path.join(dirPath, "VMs.json");

const userPasswordSecretKey = process.env.USER_PASSWORD_SECRET_KEY;

// Get all users
router.get("/api/users", (req, res) => {
  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Could not fetch users from ${filePath} file" });
    }
    const users = JSON.parse(data || "[]").filter(
      (user) => user.createdBy === req.userId
    );
    res.json(users);
  });
});

// Endpoint to add a new user
router.post("/api/users", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Both username and password are required" });
  }

  try {
    ensureFileAndDirectoryExist(dirPath, filePath);

    let users = JSON.parse(fs.readFileSync(filePath));

    const duplicateUser = users.find(
      (user) => user.username.toLowerCase() == username.toLowerCase()
    );
    if (duplicateUser) {
      return res
        .status(400)
        .json({ error: "User with same username already exists" });
    }

    users.push({
      username,
      password,
      createdBy: req.userId,
    });

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    res.json({ message: "Users added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Could not add user" });
  }
});

// Edit the user
router.put("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const { username: newUsername, password: newPassword } = req.body;

  if (!newUsername || !newPassword) {
    return res
      .status(400)
      .json({ error: "New username and password are required" });
  }

  ensureFileAndDirectoryExist(dirPath, filePath);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Could not read the file" });
    }

    let users = JSON.parse(data);

    const userIndex = users.findIndex(
      (user) => user.username.toLowerCase() == username.toLowerCase()
    );
    if (userIndex == -1) {
      return res.status(404).json({ error: "User not found." });
    }

    users[userIndex] = {
      username: newUsername,
      password: encryptPassword(newPassword, userPasswordSecretKey),
      createdBy: req.userId,
    };

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Could not write the file." });
      }
      res.json({ message: "User updated successfully" });
    });
  });
});

// Delete user
router.delete("/api/users/:username", (req, res) => {
  const { username } = req.params;

  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read file" });
    }

    let users = JSON.parse(data);
    let updatedUsers = users.filter(
      (user) => user.username.toLowerCase() !== username.toLowerCase()
    );

    if (updatedUsers.length < users.length) {
      fs.readFile(vmsFilePath, (err1, vmdata) => {
        if (err1) {
          return res
            .status(500)
            .json({ error: "Could not read VMs.json file" });
        }

        let vms = JSON.parse(vmdata);
        let updatedVms = vms.filter((vm) => vm.username !== username);

        fs.writeFile(
          vmsFilePath,
          JSON.stringify(updatedVms, null, 2),
          (err1) => {
            if (err1) {
              return res
                .status(500)
                .json({ error: "Could not write VMs.json file" });
            }
          }
        );
      });
    }

    fs.writeFile(filePath, JSON.stringify(updatedUsers, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Could not write file" });
      }
      res.json({ message: "User deleted successfully" });
    });
  });
});

// Decrypt user password
router.get("/api/users/:username/decrypt", (req, res) => {
  const username = req.params.username;
  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read users file" });
    }

    const users = JSON.parse(data);
    const user = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    if (user) {
      const decryptedPassword = decryptPassword(
        user.password,
        userPasswordSecretKey
      );
      res.json({ username: user.username, password: decryptedPassword });
    } else {
      res.status(404).status("User not found");
    }
  });
});

module.exports = router;
