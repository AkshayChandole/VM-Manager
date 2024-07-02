const fs = require("fs");

// Function to ensure the config directory and VMs.json file exist
const ensureFileAndDirectoryExist = (dirPath, filePath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
};

module.exports = {
  ensureFileAndDirectoryExist,
};
