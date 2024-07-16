const express = require("express");
const fs = require("fs");
const path = require("path");
const { connectToVm } = require("../utils/vmConnectionUtils");
const { ensureFileAndDirectoryExist } = require("../utils/fileUtils");
const { decryptPassword } = require("../utils/encryptionUtils");
const router = express.Router();

const dirPath = path.join(__dirname, "../config");
const filePath = path.join(dirPath, "VMs.json");
const usersFilePath = path.join(dirPath, "Users.json");

const secretKey = "vm-password-key";

// function to get all users
const getUsers = () => {
  ensureFileAndDirectoryExist(dirPath, usersFilePath);
  return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
};

// Get all VMs
router.get("/api/vms", (req, res) => {
  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({
        error: `Could not fetch all the VMs from ${filePath} file`,
      });
    }
    const vms = JSON.parse(data || "[]").filter(
      (vm) => vm.createdBy === req.userId
    );
    res.json(vms);
  });
});

// Add new VM with existing user
router.post("/api/vms", async (req, res) => {
  const { name, ip, domain, username } = req.body;

  if (!name || !ip || !domain || !username) {
    return res.status(400).json({
      error: "VM Name, IP Address, Domain, and Username are required",
    });
  }

  ensureFileAndDirectoryExist(dirPath, filePath);

  try {
    let vms = JSON.parse(fs.readFileSync(filePath));

    const duplicateVm = vms.find(
      (vm) =>
        vm.ip === ip &&
        vm.domain.toLowerCase() == domain.toLowerCase() &&
        vm.username.toLowerCase() == username.toLowerCase()
    );

    if (duplicateVm) {
      return res.status(400).json({
        error:
          "VM with the same ip address, domain, and username already exists",
      });
    }

    vms.push({ name, ip, domain, username, createdBy: req.userId });
    fs.writeFileSync(filePath, JSON.stringify(vms, null, 2));

    res.json({ message: "VM added successfully" });
  } catch (error) {
    console.error("Error adding VM:", error);
    res.status(500).json({ error: "Could not add VM" });
  }
});

// Connect to VM via RDP
router.post("/api/vms/connect", async (req, res) => {
  try {
    const { ip, domain, username } = req.body;
    console.log(req.body);
    const users = getUsers();
    const vmUser = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    const encryptedPassword = vmUser.password;
    const decryptedPassword = decryptPassword(encryptedPassword, secretKey);
    connectToVm(ip, domain, username, decryptedPassword);
    res.json({ message: "Connection request is in progress." });
  } catch (error) {
    return res.status(500).json({ error: "Could not connect to the VM" });
  }
});

// Delete the VM
router.delete("/api/vms/:name", (req, res) => {
  const name = req.params.name;
  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read file" });
    }
    let vms = JSON.parse(data);
    vms = vms.filter((vm) => vm.name !== name);
    fs.writeFile(filePath, JSON.stringify(vms, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Could not delete given VM from ${filePath} file` });
      }
      res.json({ message: "VM deleted successfully!" });
    });
  });
});

module.exports = router;
