const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const vmRoutes = require("./routes/vmRoutes");

const app = express();
const PORT = 50000;

app.use(bodyParser.json());
app.use(cors());

// Mount vmRoutes for VM-related API routes
app.use("/", vmRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
