const fs = require("fs");

// Function to ensure the config directory and required json file exists
const ensureFileAndDirectoryExist = (dirPath, filePath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }
};

const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
  ensureFileAndDirectoryExist,
  readJSONFile,
  writeJSONFile,
};
