require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");

const fetchRoute = require("./routes/fetch");
const webhookRoute = require("./routes/webhook");
const statusRoute = require("./routes/status");
const validateRoute = require("./routes/validate");

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/", fetchRoute);
app.use("/", webhookRoute);
app.use("/", statusRoute);
app.use("/", validateRoute);
app.use(express.static("public"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});