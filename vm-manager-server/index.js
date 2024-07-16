const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userAccountRoutes = require("./routes/accountUserRoutes");
const vmRoutes = require("./routes/vmRoutes");
const usersRoutes = require("./routes/usersRoutes");
const verifyToken = require("./middlewares/verifyToken");

const app = express();
const PORT = 50000;

app.use(bodyParser.json());
app.use(cors());

app.use("/", userAccountRoutes);
app.use("/", verifyToken, vmRoutes);
app.use("/", verifyToken, usersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
