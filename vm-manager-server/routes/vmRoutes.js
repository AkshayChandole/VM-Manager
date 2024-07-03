const express = require("express");
const fs = require("fs");
const path = require("path");
const RDP = require("node-rdp");
const { connectToVm } = require("../utils/vmConnectionUtils");
const { ensureFileAndDirectoryExist } = require("../utils/fileUtils");
const {
  encryptPassword,
  decryptPassword,
} = require("../utils/encryptionUtils");
const router = express.Router();

const dirPath = path.join(__dirname, "../config");
const filePath = path.join(dirPath, "VMs.json");

// Get all VMs
router.get("/api/vms", (req, res) => {
  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({
        error: `Could not fetch all the VMs from ${filePath} file`,
      });
    }
    const vms = JSON.parse(data || "[]");
    res.json(vms);
  });
});

// Add new VM
router.post("/api/vms", (req, res) => {
  const { name, domain, username, password } = req.body;

  // Validation check
  if (!name || !domain || !username || !password) {
    return res.status(400).json({
      error: "All fields (name, domain, username, password) are required",
    });
  }

  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    let vms = [];
    if (!err && data.length > 0) {
      vms = JSON.parse(data);
    }

    // Check for duplicate VM
    const duplicateVm = vms.find(
      (vm) =>
        vm.name === name && vm.domain === domain && vm.username === username
    );

    if (duplicateVm) {
      return res.status(400).json({
        error: "VM with the same name, domain, and username already exists",
      });
    }

    const encryptedPassword = encryptPassword(password);
    vms.push({ name, domain, username, password: encryptedPassword });
    fs.writeFile(filePath, JSON.stringify(vms, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Could not write file" });
      }
      res.json({ message: "VM added successfully" });
    });
  });
});

// Connect to VM via RDP
router.post("/api/vms/connect", async (req, res) => {
  try {
    const { name, domain, username, password } = req.body;
    const decryptedPassword = decryptPassword(password);
    console.log("decryptedPassword", decryptedPassword);
    connectToVm(name, domain, username, decryptedPassword);
    res.json({ message: "Connection request is in progress." });
  } catch (error) {
    return res.status(500).json({ error: "Could not connect to the VM" });
  }
});

router.delete("/api/vms/:name", (req, res) => {
  const vmName = req.params.name;
  ensureFileAndDirectoryExist(dirPath, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read file" });
    }
    let vms = JSON.parse(data);
    vms = vms.filter((vm) => vm.name !== vmName);
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
